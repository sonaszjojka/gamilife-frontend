import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { VerifyEmailComponent } from '../components/verify-email/verify-email.component';
import { ForgotPasswordComponent } from '../components/forgot-password/forgot-password.component';
import { OAuth2Service } from '../../../shared/services/oauth2/oauth2.service';
import { LinkOAuthAccountComponent } from '../../link-accounts/link-oauth-account/link-oauth-account.component';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoginCredentials } from '../../../shared/models/auth/auth.model';

@Component({
  selector: 'app-login-page',
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
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  standalone: true,
})
export class LoginPageComponent implements OnInit {
  @ViewChild(VerifyEmailComponent)
  verificationModal!: VerifyEmailComponent;
  @ViewChild(ForgotPasswordComponent)
  forgotPasswordModal!: ForgotPasswordComponent;
  @ViewChild(LinkOAuthAccountComponent)
  linkAccountModal!: LinkOAuthAccountComponent;

  private router = inject(Router);
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private oauth2Service = inject(OAuth2Service);
  private destroyRef = inject(DestroyRef);

  isLoading = signal(false);

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
      const credentials: LoginCredentials = {
        email: this.validateForm.value.email!,
        password: this.validateForm.value.password!,
      };
      this.handleStandardLogin(credentials);
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  private handleStandardLogin(credentials: LoginCredentials) {
    this.isLoading.set(true);
    this.authService
      .login(credentials)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          if (!res.isEmailVerified) {
            this.verificationModal.open(res.email);
          } else {
            this.router.navigate(['/app/dashboard']);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
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

  loginWithGoogle(): void {
    this.isLoading.set(true);
    this.oauth2Service.startGoogleLogin();
  }
}
