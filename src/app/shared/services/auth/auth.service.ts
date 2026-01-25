import { HttpClient } from '@angular/common/http';
import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import {
  catchError,
  finalize,
  Observable,
  Subject,
  tap,
  throwError,
} from 'rxjs';
import { WebSocketNotificationService } from '../../../features/shared/services/websocket-notification-service/web-socket-notification.service';
import { StorageService } from './storage.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  LoginCredentials,
  GamificationUserData,
  LoginResponse,
  RegistrationData,
  ChangePasswordRequest,
  ResetPasswordRequest,
} from '../../../features/shared/models/auth/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly notificationService = inject(WebSocketNotificationService);
  private readonly storage = inject<StorageService>(StorageService);
  private readonly refreshSubject = new Subject<boolean>();
  private readonly destroyRef = inject(DestroyRef);

  refreshSubject$ = this.refreshSubject.asObservable();
  refreshInProgress = false;

  username = signal<string | null>(this.storage.getUsername());
  userId = signal<string | null>(this.storage.getUserId());
  isTutorialCompleted = signal<boolean>(this.storage.getIsTutorialCompleted());
  money = signal<number>(this.storage.getMoney());
  level = signal<number>(this.storage.getLevel());
  experience = signal<number>(this.storage.getExperience());
  requiredExperienceForNextLevel = signal<number | null>(
    this.storage.getRequiredExperienceForNextLevel(),
  );
  statsVersion = signal<number | null>(this.storage.getStatsVersion());
  emailVerified = signal<boolean>(!!this.storage.getIsEmailVerified());
  loggedIn = computed<boolean>(() => {
    const userId = this.userId();
    const isEmailVerified = this.emailVerified();
    return userId !== null && isEmailVerified;
  });

  constructor() {
    this.initializeFromStorage();

    if (this.loggedIn()) {
      this.notificationService.connect();
      this.loadGamificationData();
    }
  }

  private initializeFromStorage(): void {
    const userId = this.storage.getUserId();
    const isEmailVerified = !!this.storage.getIsEmailVerified();

    if (userId && isEmailVerified) {
      this.userId.set(userId);
      this.username.set(this.storage.getUsername());
      this.emailVerified.set(true);
      this.isTutorialCompleted.set(this.storage.getIsTutorialCompleted());
      this.money.set(this.storage.getMoney());
      this.level.set(this.storage.getLevel());
      this.experience.set(this.storage.getExperience());
      this.requiredExperienceForNextLevel.set(
        this.storage.getRequiredExperienceForNextLevel(),
      );
      this.statsVersion.set(this.storage.getStatsVersion());
    }
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    const url = `${environment.apiUrl}/auth/login`;
    return this.http
      .post<LoginResponse>(url, credentials, { withCredentials: true })
      .pipe(tap(this.processAfterLoginResponse.bind(this)));
  }

  verfiyEmail(code: string): Observable<LoginResponse> {
    const url = `${environment.apiUrl}/auth/email-verifications/confirm`;
    return this.http
      .post<LoginResponse>(url, { code }, { withCredentials: true })
      .pipe(tap(this.processAfterLoginResponse.bind(this)));
  }

  register(registrationData: RegistrationData): Observable<LoginResponse> {
    const url = `${environment.apiUrl}/auth/register`;
    return this.http
      .post<LoginResponse>(url, registrationData, { withCredentials: true })
      .pipe(tap(this.processAfterLoginResponse.bind(this)));
  }

  processAfterLoginResponse(res: LoginResponse): void {
    this.saveAuthDataToStorage(
      res.userId,
      res.username,
      res.isTutorialCompleted,
      res.isEmailVerified,
      res.money,
    );
    this.updateAuthState(
      res.userId,
      res.username,
      res.isTutorialCompleted,
      res.isEmailVerified,
      res.money,
    );
    this.loadGamificationData();
    this.notificationService.connect();
  }

  logout() {
    this.http
      .post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.logoutLocal(),
        error: () => this.logoutLocal(),
      });
  }

  logoutLocal() {
    this.notificationService.disconnect();
    this.notificationService.clearAllNotifications();
    this.storage.clearAuthData();

    this.userId.set(null);
    this.username.set(null);
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
          this.refreshSubject.next(true);
          if (!this.isWebSocketConnected()) {
            this.notificationService.connect();
          }
        }),
        catchError((error) => {
          this.refreshSubject.next(false);
          return throwError(() => error);
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.updateGamificationData(data);
        },
        error: (error) => {
          console.error('Failed to load gamification data:', error);
        },
      });
  }

  public updateGamificationData(data: GamificationUserData): void {
    if (this.statsVersion() && data.statsVersion <= this.statsVersion()!) {
      return;
    }

    this.level.set(data.level);
    this.experience.set(data.experience);
    this.money.set(data.money);
    this.requiredExperienceForNextLevel.set(
      data.requiredExperienceForNextLevel,
    );
    this.statsVersion.set(data.statsVersion);

    this.storage.setLevel(data.level);
    this.storage.setExperience(data.experience);
    this.storage.setMoney(data.money);
    this.storage.setRequiredExperienceForNextLevel(
      data.requiredExperienceForNextLevel,
    );
    this.storage.setStatsVersion(data.statsVersion);
  }

  public forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/forgot-password`, {
      email,
    });
  }

  public changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/auth/change-password`,
      request,
      {
        withCredentials: true,
      },
    );
  }

  public resetPassword(request: ResetPasswordRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/reset-password`, {
      code: request.code,
      newPassword: request.newPassword,
    });
  }

  completeUserOnboarding(): void {
    this.isTutorialCompleted.set(true);
    this.storage.setIsTutorialCompleted(true);
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

  private updateAuthState(
    userId: string,
    username: string,
    isTutorialCompleted: boolean,
    isEmailVerified: boolean,
    money: number,
  ): void {
    this.userId.set(userId);
    this.username.set(username);
    this.isTutorialCompleted.set(isTutorialCompleted);
    this.emailVerified.set(isEmailVerified);
    this.money.set(money);
  }

  private saveAuthDataToStorage(
    userId: string,
    username: string,
    isTutorialCompleted: boolean,
    isEmailVerified: boolean,
    money: number,
  ) {
    this.storage.setUserId(userId);
    this.storage.setUsername(username);
    this.storage.setIsTutorialCompleted(isTutorialCompleted);
    this.storage.setIsEmailVerified(isEmailVerified);
    this.storage.setMoney(money);
  }
}
