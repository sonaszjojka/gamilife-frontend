import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.development';

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

  logout() {
    localStorage.removeItem('userId');
    this.loggedIn.set(false);
    this.http
      .post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .subscribe({
        complete: () => this.router.navigate(['/login']),
      });
  }

  tryToLogIn() {
    this.loggedIn.set(!!localStorage.getItem('userId'));
    return this.loggedIn;
  }
}
