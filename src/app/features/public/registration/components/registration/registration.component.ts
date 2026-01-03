import {
  Component,
  DestroyRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { environment } from '../../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { LinkOAuthAccountComponent } from '../../../link-accounts/link-oauth-account/link-oauth-account.component';
import { OAuth2Service } from '../../../../shared/services/oauth2/oauth2.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {VerifyEmailComponent} from '../../../login/components/verify-email/verify-email.component';
@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    NzCardModule,
    NzIconModule,
    NzFormModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzInputModule,
    NzPopoverModule,
    RouterModule,
    NzDatePickerModule,
    CommonModule,
    LinkOAuthAccountComponent,
    VerifyEmailComponent,
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  private router = inject(Router);
  private fb = inject(NonNullableFormBuilder);
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  isSubmitting = signal(false);
  isPasswordVisible = signal(false);
  private password = signal<string>('');
  private oauth2Service = inject(OAuth2Service);
  @ViewChild(LinkOAuthAccountComponent)
  linkAccountModal!: LinkOAuthAccountComponent;
  @ViewChild(VerifyEmailComponent)
  verifyEmail! :VerifyEmailComponent

  validateForm = this.fb.group({
    firstName: this.fb.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    lastName: this.fb.control('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ]),
    username: this.fb.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    dateOfBirth: this.fb.control<Date | null>(null, [Validators.required]),
    password: this.fb.control('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(128),
      this.isPasswordValidator.bind(this),
    ]),
    isPublicProfile: this.fb.control(false),
    isBudgetReports: this.fb.control(false),
  });

  submitForm(): void {
    if (this.validateForm.valid) {
      this.isSubmitting.update(() => true);
      const formData = this.validateForm.value;
      const url = `${environment.apiUrl}/auth/register`;

      this.http
        .post(url, formData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.isSubmitting.update(() => false);
            this.verifyEmail.open(formData.email!)
          },
          error: (err) => {
            this.isSubmitting.update(() => false);
            if (err.status === 400 || err.status === 409) {
              const detailMessage = err.error?.detail || 'Something went wrong';
              this.validateForm.setErrors({
                apiError: detailMessage,
              });
            } else {
              this.validateForm.setErrors({ apiError: 'Something went wrong' });
            }
          },
        });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  changePasswordVisibility(): void {
    this.isPasswordVisible.update((prev) => !prev);
  }

  disabledFutureDate = (current: Date): boolean => {
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 120);
    today.setHours(0, 0, 0, 0);
    minDate.setHours(0, 0, 0, 0);
    return current > today || current < minDate;
  };

  isPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return { required: true };

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,128}$/;

    const valid = passwordRegex.test(value);
    return valid ? null : { passwordStrength: true };
  }

  registerWithGoogle(): void {
    this.oauth2Service.startGoogleLogin();
  }
}
