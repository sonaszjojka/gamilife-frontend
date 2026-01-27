import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../shared/services/notification-service/notification.service';
import { AuthService } from '../../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzResultModule,
    NzSpinModule,
  ],
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.css'],
})
export class ResetPasswordPageComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  isSubmitting = signal(false);
  isPasswordVisible = signal(false);

  code: string | null = null;

  validateForm = this.fb.group({
    password: this.fb.control('', [
      Validators.required,
      this.isPasswordValidator.bind(this),
    ]),
  });

  ngOnInit(): void {
    this.code = this.route.snapshot.queryParamMap.get('code');

    if (!this.code) {
      this.router.navigate(['/login']);
      this.notificationService.error(
        'Invalid password reset link. Please request a new one.',
      );
    }
  }

  isPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return { required: true };

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,128}$/;

    const valid = passwordRegex.test(value);
    return valid ? null : { passwordStrength: true };
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible.update((prev) => !prev);
  }

  submitForm(): void {
    if (!this.code) return;

    if (this.validateForm.invalid) {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.isSubmitting.set(true);

    const newPassword = this.validateForm.value.password!;
    const code = this.code;

    this.authService
      .resetPassword({ code, newPassword })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.notificationService.success(
            'Password has been reset successfully. You can now log in with your new password.',
          );
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          if (err?.error?.code === '2005') {
            this.notificationService.error(
              'New password is same as the old password. Just try logging with it!',
            );
          } else {
            this.notificationService.error(
              'Failed to reset password. Try requesting a new link.',
            );
          }

          this.router.navigate(['/login']);
        },
      });
  }
}
