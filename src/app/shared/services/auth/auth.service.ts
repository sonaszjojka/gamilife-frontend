import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { finalize, Observable, Subject, tap } from 'rxjs';
import { WebSocketNotificationService } from '../../../features/shared/services/websocket-notification-service/web-socket-notification.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  email: string;
  username: string;
  isEmailVerified: boolean;
  isTutorialCompleted: boolean;
  money: number;
}

export interface GamificationUserData {
  userId: string;
  username: string;
  level: number;
  experience: number;
  money: number;
  requiredExperienceForNextLevel: number | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private notificationService = inject(WebSocketNotificationService);
  private refreshSubject = new Subject<void>();

  refreshInProgress = false;

  loggedIn = signal<boolean>(!!localStorage.getItem('userId'));
  username = signal<string | null>(localStorage.getItem('username') ?? null);
  userId = signal<string | null>(localStorage.getItem('userId') ?? null);
  isTutorialCompleted = signal<boolean>(
    localStorage.getItem('isTutorialCompleted') === 'true',
  );
  money = signal<number>(Number(localStorage.getItem('money')) || 0);
  level = signal<number>(Number(localStorage.getItem('level')) || 1);
  experience = signal<number>(Number(localStorage.getItem('experience')) || 0);
  requiredExperienceForNextLevel = signal<number | null>(
    localStorage.getItem('requiredExperienceForNextLevel')
      ? Number(localStorage.getItem('requiredExperienceForNextLevel'))
      : null,
  );

  constructor() {
    this.initializeFromLocalStorage();
    this.initializeWebSocketOnStartup();
  }

  private initializeFromLocalStorage(): void {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const isTutorialCompleted =
      localStorage.getItem('isTutorialCompleted') === 'true';
    const money = Number(localStorage.getItem('money')) || 0;
    const level = Number(localStorage.getItem('level')) || 1;
    const experience = Number(localStorage.getItem('experience')) || 0;
    const requiredExp = localStorage.getItem('requiredExperienceForNextLevel');

    if (userId) {
      this.userId.set(userId);
      this.username.set(username);
      this.loggedIn.set(true);
      this.isTutorialCompleted.set(isTutorialCompleted);
      this.money.set(money);
      this.level.set(level);
      this.experience.set(experience);
      this.requiredExperienceForNextLevel.set(
        requiredExp ? Number(requiredExp) : null,
      );
    }
  }

  private initializeWebSocketOnStartup(): void {
    const isLoggedIn = this.loggedIn();

    if (isLoggedIn) {
      this.notificationService.connect();
      this.loadGamificationData();
    }
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    const url = `${environment.apiUrl}/auth/login`;
    return this.http
      .post<LoginResponse>(url, credentials, { withCredentials: true })
      .pipe(
        tap((res) => {
          this.saveAuthDataToStorage(
            res.userId,
            res.username,
            res.isTutorialCompleted,
            res.money,
          );
          this.updateAuthState(
            res.userId,
            res.username,
            res.isTutorialCompleted,
            res.money,
          );
          this.loadGamificationData();
        }),
      );
  }

  logout() {
    this.http
      .post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => this.logoutLocal(),
        error: () => this.logoutLocal(),
      });
  }

  logoutLocal() {
    this.notificationService.disconnect();
    this.notificationService.clearAllNotifications();

    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('isTutorialCompleted');
    localStorage.removeItem('money');
    localStorage.removeItem('level');
    localStorage.removeItem('experience');
    localStorage.removeItem('requiredExperienceForNextLevel');

    this.userId.set(null);
    this.username.set(null);
    this.loggedIn.set(false);
    this.isTutorialCompleted.set(false);
    this.money.set(0);
    this.level.set(1);
    this.experience.set(0);
    this.requiredExperienceForNextLevel.set(null);

    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<void> {
    this.refreshInProgress = true;

    return this.http
      .post<void>(
        `${environment.apiUrl}/auth/refresh`,
        {},
        { withCredentials: true },
      )
      .pipe(
        tap(() => {
          this.refreshSubject.next();
          if (!this.isWebSocketConnected()) {
            this.notificationService.connect();
          }
        }),
        finalize(() => {
          this.refreshInProgress = false;
        }),
      );
  }

  loadGamificationData(): void {
    const userId = this.userId();
    if (!userId) return;

    this.http
      .get<GamificationUserData>(
        `${environment.apiUrl}/gamification-users/${userId}`,
        { withCredentials: true },
      )
      .subscribe({
        next: (data) => {
          this.updateGamificationData(data);
        },
        error: (error) => {
          console.error('Failed to load gamification data:', error);
        },
      });
  }

  private updateGamificationData(data: GamificationUserData): void {
    this.level.set(data.level);
    this.experience.set(data.experience);
    this.money.set(data.money);
    this.requiredExperienceForNextLevel.set(
      data.requiredExperienceForNextLevel,
    );

    localStorage.setItem('level', String(data.level));
    localStorage.setItem('experience', String(data.experience));
    localStorage.setItem('money', String(data.money));
    if (data.requiredExperienceForNextLevel !== null) {
      localStorage.setItem(
        'requiredExperienceForNextLevel',
        String(data.requiredExperienceForNextLevel),
      );
    }
  }

  completeUserOnboarding(): void {
    this.isTutorialCompleted.set(true);
    localStorage.setItem('isTutorialCompleted', 'true');
  }

  updateMoney(amount: number): void {
    this.money.set(amount);
    localStorage.setItem('money', String(amount));
  }

  adjustMoney(delta: number): void {
    const newAmount = this.money() + delta;
    this.updateMoney(newAmount);
  }

  getExperiencePercentage(): number {
    const required = this.requiredExperienceForNextLevel();
    if (!required || required === 0) return 0;

    const current = this.experience();
    return Math.min((current / required) * 100, 100);
  }

  private isWebSocketConnected(): boolean {
    let connected = false;
    const subscription = this.notificationService.connected$.subscribe(
      (status: boolean) => {
        connected = status;
      },
    );
    subscription.unsubscribe();
    return connected;
  }

  reconnectWebSocket(): void {
    if (this.loggedIn()) {
      this.notificationService.disconnect();
      setTimeout(() => {
        this.notificationService.connect();
      }, 500);
    }
  }

  private updateAuthState(
    userId: string,
    username: string,
    isTutorialCompleted: boolean,
    money: number,
  ): void {
    this.userId.set(userId);
    this.username.set(username);
    this.loggedIn.set(true);
    this.isTutorialCompleted.set(isTutorialCompleted);
    this.money.set(money);
  }

  private saveAuthDataToStorage(
    userId: string,
    username: string,
    isTutorialCompleted: boolean,
    money: number,
  ) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    localStorage.setItem('isTutorialCompleted', String(isTutorialCompleted));
    localStorage.setItem('money', String(money));
  }
}
