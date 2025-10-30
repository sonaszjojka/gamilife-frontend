import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-verify-email',
  imports: [CommonModule, NzModalModule, NzButtonModule, NzIconModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css',
  standalone: true,
})
export class VerifyEmailComponent {
  email = signal<string | null>(null);
  isVisible = signal(false);
  resending = signal(false);
  resentSuccessfully = signal(false);
  resentFailure = signal(false);
  private http = inject(HttpClient);

  open(email: string): void {
    this.email.set(email);
    this.isVisible.set(true);
    this.resentSuccessfully.set(false);
    this.resentFailure.set(false);
  }

  close(): void {
    this.isVisible.set(false);
    this.resentSuccessfully.set(false);
    this.resentFailure.set(false);
  }

  resendVerification(): void {
    if (this.resending()) return;

    this.resending.set(true);
    this.resentSuccessfully.set(false);
    const url = `${environment.apiUrl}/auth/email-verifications/resend`;

    this.http.post(url, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.resending.set(false);
        this.resentSuccessfully.set(true);
      },
      error: () => {
        this.resentSuccessfully.set(false);
        this.resending.set(false);
        this.resentFailure.set(true);
      },
    });
  }
}
