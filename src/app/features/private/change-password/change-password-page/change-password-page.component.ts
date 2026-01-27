import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  NzFormControlComponent,
  NzFormDirective,
  NzFormItemComponent,
  NzFormLabelComponent,
} from 'ng-zorro-antd/form';
import { NzInputDirective, NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { NotificationService } from '../../../shared/services/notification-service/notification.service';
import { ChangePasswordRequest } from '../../../shared/models/auth/auth.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-change-password-page',
  standalone: true,
  templateUrl: 'change-password-page.component.html',
  imports: [
    NzFormItemComponent,
    NzFormDirective,
    NzFormControlComponent,
    NzInputDirective,
    ReactiveFormsModule,
    NzFormLabelComponent,
    NzButtonComponent,
    NzWaveDirective,
    NzInputModule,
  ],
  styleUrl: 'change-password-page.component.css',
})
export class ChangePasswordPageComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly notificationApi = inject(NotificationService);

  isSubmitting = signal(false);

  validateForm = this.fb.group({
    oldPassword: this.fb.control('', [Validators.required]),
    newPassword: this.fb.control('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(128),
      this.validatePasswordStrength.bind(this),
    ]),
    repeatNewPassword: this.fb.control('', [
      Validators.required,
      this.checkPasswordsMatch.bind(this),
    ]),
  });

  constructor() {
    this.validateForm.controls.newPassword.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.validateForm.controls.repeatNewPassword.updateValueAndValidity();
      });
  }

  validatePasswordStrength(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return { required: true };

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,128}$/;

    const valid = passwordRegex.test(value);
    return valid ? null : { passwordStrength: true };
  }

  checkPasswordsMatch(control: AbstractControl): ValidationErrors | null {
    if (!control.parent) {
      return null;
    }
    const newPassword = control.parent.get('newPassword')?.value;
    const repeatNewPassword = control.value;

    return newPassword === repeatNewPassword
      ? null
      : { passwordsMismatch: true };
  }

  submitForm() {
    this.isSubmitting.set(true);
    if (this.validateForm.invalid) {
      Object.values(this.validateForm.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      this.isSubmitting.set(false);
      return;
    }

    const request: ChangePasswordRequest = {
      oldPassword: this.validateForm.value.oldPassword!,
      newPassword: this.validateForm.value.newPassword!,
    };

    this.authService
      .changePassword(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.notificationApi.success('Password changed successfully');
          this.validateForm.reset();
        },
        error: (e) => {
          this.isSubmitting.set(false);
          const errorCode: string | undefined = e.error?.code;

          if (!errorCode) {
            this.notificationApi.error(
              'Unknown error occurred during password change',
            );
          } else if (errorCode === '2001') {
            this.notificationApi.error('Current password is incorrect');
          } else if (errorCode === '1501') {
            this.notificationApi.error(
              'New password does not meet security requirements',
            );
          } else if (errorCode === '2005') {
            this.notificationApi.error(
              'New password cannot be same as old password',
            );
          }
        },
      });
  }
}
