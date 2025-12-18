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

  constructor() {
    this.initializeWebSocketOnStartup();
  }

  private initializeWebSocketOnStartup(): void {
    const isLoggedIn = this.loggedIn();

    if (isLoggedIn) {
      this.notificationService.connect();
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

    this.userId.set(null);
    this.username.set(null);
    this.loggedIn.set(false);
    this.isTutorialCompleted.set(false);
    this.money.set(0);

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
