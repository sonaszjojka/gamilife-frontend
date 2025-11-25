import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { finalize, Observable, Subject, tap } from 'rxjs';

export interface IAuthService {
  isLoggedIn: Signal<boolean>;
  username: Signal<string | null>;
  userId: Signal<string | null>;

  login(credentials: LoginCredentials): Observable<LoginResponse>;
  logout(): void;
  loadUserData(): Observable<UserData>;
}

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
}

export interface UserData {
  userId: string;
  username: string;
  email: string;
  isTutorialCompleted: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private refreshSubject = new Subject<void>();

  refreshInProgress = false;

  loggedIn = signal<boolean>(!!localStorage.getItem('userId'));
  username = signal<string | null>(null);
  userId = signal<string | null>(localStorage.getItem('userId') ?? null);
  isTutorialCompleted = signal<boolean>(
    localStorage.getItem('isTutorialCompleted') === 'true',
  );

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    const url = `${environment.apiUrl}/auth/login`;
    return this.http
      .post<LoginResponse>(url, credentials, { withCredentials: true })
      .pipe(
        tap((res) => {
          this.saveAuthDataToStorage(res.userId, res.isTutorialCompleted);
          this.updateAuthState(
            res.userId,
            res.username,
            res.isTutorialCompleted,
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
    localStorage.removeItem('userId');
    localStorage.removeItem('isTutorialCompleted');

    this.userId.set(null);
    this.username.set(null);
    this.loggedIn.set(false);
    this.isTutorialCompleted.set(false);
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

  private updateAuthState(
    userId: string,
    username: string,
    isTutorialCompleted: boolean,
  ): void {
    this.userId.set(userId);
    this.username.set(username);
    this.loggedIn.set(true);
    this.isTutorialCompleted.set(isTutorialCompleted);
  }

  private saveAuthDataToStorage(userId: string, isTutorialCompleted: boolean) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('isTutorialCompleted', String(isTutorialCompleted));
  }
}
