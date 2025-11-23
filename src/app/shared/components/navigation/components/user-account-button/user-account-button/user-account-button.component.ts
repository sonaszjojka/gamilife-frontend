import { Component, inject } from '@angular/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-account-button',
  standalone: true,
  imports: [NzDropDownModule, NzIconModule, CommonModule],
  templateUrl: './user-account-button.component.html',
  styleUrl: './user-account-button.component.css',
})
export class UserAccountButtonComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn = this.authService.loggedIn;
  username = this.authService.username;

  logout() {
    this.authService.logout();
  }
}
