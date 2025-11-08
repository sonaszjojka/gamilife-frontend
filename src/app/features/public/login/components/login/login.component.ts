import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
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
import { OAuth2Service } from '../../../../shared/services/oauth2.service';
import { LinkOAuthAccountComponent } from '../../../link-accounts/link-oauth-account/link-oauth-account.component';
import { AuthService } from '../../../../../shared/services/auth/auth.service';

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
    LinkOAuthAccountComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  @ViewChild(VerifyEmailComponent)
  verificationModal!: VerifyEmailComponent;
  @ViewChild(ForgotPasswordComponent)
  forgotPasswordModal!: ForgotPasswordComponent;
  @ViewChild(LinkOAuthAccountComponent)
  linkAccountModal!: LinkOAuthAccountComponent;

  private router = inject(Router);
  private fb = inject(NonNullableFormBuilder);
  private http = inject(HttpClient);
  private oauth2Service = inject(OAuth2Service);
  private authService = inject(AuthService);

  isPasswordVisible = signal(false);

  validateForm = this.fb.group({
    email: this.fb.control('', [Validators.email, Validators.required]),
    password: this.fb.control('', [Validators.required]),
  });

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const navigationState = navigation?.extras?.state;
    const historyState = window.history.state;

    const state = navigationState || historyState;

    if (state?.['linkAccount']) {
      setTimeout(() => {
        if (this.linkAccountModal) {
          this.linkAccountModal.open(
            state['provider'],
            state['providerId'],
            state['userId'],
          );
        }
      }, 100);
    }

    if (state?.['showEmailVerification']) {
      setTimeout(() => {
        if (this.verificationModal) {
          this.verificationModal.open(state['email']);
        }
      }, 100);
    }
  }

  openForgotPassword() {
    this.forgotPasswordModal.open();
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const formData = this.validateForm.value;
      this.handleStandardLogin(formData);
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  // might move to authService
  private handleStandardLogin(formData: unknown) {
    const url = `${environment.apiUrl}/auth/login`;
    this.http
      .post<AfterLoginResponse>(url, formData, { withCredentials: true })
      .subscribe({
        next: (res) => {
          if (!res.isEmailVerified) {
            this.verificationModal.open(res.email);
          } else {
            localStorage.setItem('userId', res.userId);
            this.authService.tryToLogIn();
            this.router.navigate(['/app/dashboard']);
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
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  changePasswordVisibility() {
    this.isPasswordVisible.update((prev) => !prev);
  }

  loginWithGoogle(): void {
    this.oauth2Service.startGoogleLogin();
  }
}

interface AfterLoginResponse {
  userId: string;
  email: string;
  username: string;
  isEmailVerified: boolean;
}
