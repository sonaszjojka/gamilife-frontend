import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
@Component({
  selector: 'app-guest-home',
  imports: [NzCardModule, NzIconModule],
  templateUrl: './guest-home.component.html',
  styleUrl: './guest-home.component.css',
})
export class GuestHomeComponent {
  private router = inject(Router);

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
