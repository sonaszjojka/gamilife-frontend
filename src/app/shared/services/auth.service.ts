import { Injectable, signal, Signal } from '@angular/core';

export interface IAuthService {
  isLoggedIn: Signal<boolean>;

  login(): void;
  logout(): void;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = signal(false);

  login() {
    this.loggedIn.set(true);
  }
  logout() {
    this.loggedIn.set(false);
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}
