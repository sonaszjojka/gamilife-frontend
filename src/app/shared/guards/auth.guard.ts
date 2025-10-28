import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isLoggedIn()) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  }
}
