import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { finalize, Observable, Subject, tap } from 'rxjs';

export interface IAuthService {
  isLoggedIn: Signal<boolean>;

  login(): void;
  logout(): void;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  loggedIn = signal<boolean>(!!localStorage.getItem('userId'));
  private router = inject(Router);
  private http = inject(HttpClient);
  private refreshSubject = new Subject<void>();
  refreshInProgress = false;

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
    this.loggedIn.set(false);
    this.router.navigate(['/login']);
  }

  tryToLogIn() {
    this.loggedIn.set(!!localStorage.getItem('userId'));
    return this.loggedIn;
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
