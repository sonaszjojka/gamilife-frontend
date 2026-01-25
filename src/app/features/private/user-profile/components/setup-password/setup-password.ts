import {
  signal,
  inject,
  input,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../../../../../shared/services/auth/auth.service';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';

@Component({
  selector: 'app-setup-password',
  imports: [NzAlertModule, NzButtonModule, NzIconModule],
  template: `<nz-alert
      nzType="info"
      nzMessage="Password Setup"
      nzDescription="You do not have a local password set up for your account. Click the button below to receive an email that will allow you to set up your password."
      nzShowIcon
      style="margin-bottom: 16px"
    >
    </nz-alert>
    <button
      nz-button
      nzType="default"
      (click)="onResetPassword()"
      [nzLoading]="sendingResetEmail()"
      [disabled]="sendingResetEmail()"
    >
      <i nz-icon nzType="mail"></i>
      Send Password Setup Email
    </button>`,
  styleUrl: './setup-password.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notificationService = inject(NotificationService);

  email = input.required<string>();

  sendingResetEmail = signal(false);

  onResetPassword(): void {
    this.sendingResetEmail.set(true);
    this.authService
      .forgotPassword(this.email())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.sendingResetEmail.set(false);
          this.notificationService.success(
            'Password setup email sent. Please check your email.',
          );
        },
        error: () => {
          this.sendingResetEmail.set(false);
          this.notificationService.error(
            'Failed to send password setup email. Please try again later.',
          );
        },
      });
  }
}
