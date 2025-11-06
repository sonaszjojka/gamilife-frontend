import { inject, Injectable, signal, Signal } from '@angular/core';
import { Router } from '@angular/router';

export interface IAuthService {
  isLoggedIn: Signal<boolean>;

  login(): void;
  logout(): void;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  loggedIn = signal<boolean>(!!localStorage.getItem('userId'));
  private router = inject(Router);

  logout() {
    localStorage.removeItem('userId');
    this.loggedIn.set(false);
    this.router.navigate(['/login']);
  }
  tryToLogIn() {
    this.loggedIn.set(!!localStorage.getItem('userId'));
    return this.loggedIn;
  }
}
