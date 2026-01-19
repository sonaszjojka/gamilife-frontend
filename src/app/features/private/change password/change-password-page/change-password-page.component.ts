import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import {
  NzFormControlComponent,
  NzFormDirective,
  NzFormItemComponent,
  NzFormLabelComponent,
} from 'ng-zorro-antd/form';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NgIf } from '@angular/common';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzResultComponent } from 'ng-zorro-antd/result';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { UserApiService } from '../../../shared/services/user-api/user-api.service';
import { NotificationService } from '../../../shared/services/notification-service/notification.service';
import { ChangePasswordRequest } from '../../../shared/models/auth/auth.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-change-password-page',
  standalone: true,
  templateUrl: 'change-password-page.component.html',
  imports: [
    NzIconDirective,
    NzFormItemComponent,
    NzFormDirective,
    NzFormControlComponent,
    NzInputGroupComponent,
    NzInputDirective,
    ReactiveFormsModule,
    NzFormLabelComponent,
    NgIf,
    NzButtonComponent,
    NzResultComponent,
    NzSpinComponent,
    NzWaveDirective,
  ],
  styleUrl: 'change-password-page.component.css',
})
export class ChangePasswordPageComponent {
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private readonly userApi = inject(UserApiService);
  private readonly notificationApi = inject(NotificationService);
  isSubmitting = signal(false);
  isPasswordVisible = signal(false);

  validateForm = this.fb.group({
    oldPassword: this.fb.control('', [Validators.required]),
    newPassword: this.fb.control('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(128),
      this.isPasswordValidator.bind(this),
    ]),
    repeatNewPassword: this.fb.control('', [Validators.required]),
  });

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

  submitForm() {
    if (this.validateForm.invalid) {
      Object.values(this.validateForm.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }
    if (
      this.validateForm.value.newPassword !=
      this.validateForm.value.repeatNewPassword
    ) {
      this.notificationApi.error(
        'Your new password does not match repeated password',
      );
      return;
    }

    const request: ChangePasswordRequest = {
      oldPassword: this.validateForm.value.oldPassword!,
      newPassword: this.validateForm.value.newPassword!,
    };

    this.userApi
      .changePassword(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationApi.success('Password changed successfully');
          this.router.navigate([`${environment.apiUrl}/profile`]);
        },
        error: () => {
          this.notificationApi.error('Error occurred changing password');
          this.router.navigate([`${environment.apiUrl}/profile`]);
        },
      });
  }
}
