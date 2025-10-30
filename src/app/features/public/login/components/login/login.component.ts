import { Component, inject, signal, ViewChild } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { environment } from '../../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { VerifyEmailComponent } from '../verify-email/verify-email.component';
import { ForgotPasswordComponent } from '../../../forgot-password/components/forgot-password/forgot-password.component';
@Component({
  selector: 'app-login',
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
    CommonModule,
    VerifyEmailComponent,
    ForgotPasswordComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @ViewChild(VerifyEmailComponent)
  verificationModal!: VerifyEmailComponent;
  @ViewChild(ForgotPasswordComponent)
  forgotPasswordModal!: ForgotPasswordComponent;
  private router = inject(Router);
  private fb = inject(NonNullableFormBuilder);
  isPasswordVisible = signal(false);
  private password? = signal<string>('');
  private http = inject(HttpClient);

  validateForm = this.fb.group({
    email: this.fb.control('', [Validators.email, Validators.required]),
    password: this.fb.control('', [Validators.required]),
  });

  openForgotPassword() {
    this.forgotPasswordModal.open();
  }
  submitForm(): void {
    if (this.validateForm.valid) {
      const formData = this.validateForm.value;
      const url = `${environment.apiUrl}/auth/login`;

      this.http
        .post<AfterLoginResponse>(url, formData, { withCredentials: true })
        .subscribe({
          next: (res) => {
            if (!res.isEmailVerified) {
              this.verificationModal.open(res.email);
            } else {
              this.router.navigate(['/dashboard']);
            }
          },
          error: (err) => {
            if (err.status === 401) {
              this.validateForm.controls['password'].setErrors({
                apiError: 'Invalid credentials',
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

  goToRegister() {
    this.router.navigate(['/register']);
  }

  changePasswordVisibility() {
    this.isPasswordVisible.update((prev) => !prev);
  }
}

interface AfterLoginResponse {
  userId: number;
  email: string;
  username: string;
  isEmailVerified: boolean;
}
