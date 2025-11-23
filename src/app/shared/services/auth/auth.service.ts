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
}

export interface UserData {
  userId: string;
  username: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  loggedIn = signal<boolean>(!!localStorage.getItem('userId'));
  username = signal<string | null>(null);
  userId = signal<string | null>(localStorage.getItem('userId') ?? null);

  private router = inject(Router);
  private http = inject(HttpClient);
  private refreshSubject = new Subject<void>();
  refreshInProgress = false;

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    const url = `${environment.apiUrl}/auth/login`;
    return this.http
      .post<LoginResponse>(url, credentials, { withCredentials: true })
      .pipe(
        tap((res) => {
          localStorage.setItem('userId', res.userId);
          this.userId.set(res.userId);
          this.username.set(res.username);
          this.loggedIn.set(true);
        }),
      );
  }

  loadUserData(): Observable<UserData> {
    const url = `${environment.apiUrl}/auth/me`;
    return this.http.get<UserData>(url, { withCredentials: true }).pipe(
      tap((userData) => {
        this.username.set(userData.username);
        this.userId.set(userData.userId);
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
    this.userId.set(null);
    this.username.set(null);
    this.loggedIn.set(false);
    this.router.navigate(['/login']);
  }

  tryToLogIn(): boolean {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.userId.set(userId);
      this.loggedIn.set(true);
      this.loadUserData().subscribe({
        error: () => {
          this.logoutLocal();
        },
      });
      return true;
    }

    return false;
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

  waitForRefresh(): Observable<void> {
    return this.refreshSubject.asObservable();
  }
}
