import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { OAuth2Service } from '../../../shared/services/oauth2/oauth2.service';
import { LinkOAuthAccountRequest } from '../../../shared/models/auth/oauth2.model';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-link-oauth-account',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,
    NzAlertModule,
    ReactiveFormsModule,
  ],
  templateUrl: './link-oauth-account.component.html',
  styleUrl: './link-oauth-account.component.css',
})
export class LinkOAuthAccountComponent {
  isVisible = signal(false);
  linking = signal(false);
  linkingSuccess = signal(false);
  errorMessage = signal<string | null>(null);
  isPasswordVisible = signal(false);

  provider = signal<string>('');
  providerId = signal<string>('');
  userId = signal<number>(0);

  private oauth2Service = inject(OAuth2Service);
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  validateForm = this.fb.group({
    password: this.fb.control('', [Validators.required]),
  });

  open(provider: string, providerId: string, userId: number): void {
    this.provider.set(provider);
    this.providerId.set(providerId);
    this.userId.set(userId);
    this.isVisible.set(true);
    this.errorMessage.set(null);
    this.validateForm.reset();
  }

  close(): void {
    this.isVisible.set(false);
    this.errorMessage.set(null);
    this.validateForm.reset();
  }

  changePasswordVisibility(): void {
    this.isPasswordVisible.update((prev) => !prev);
  }

  linkAccount(): void {
    if (this.linking()) return;

    if (this.validateForm.valid) {
      this.linking.set(true);
      this.errorMessage.set(null);

      const linkRequest: LinkOAuthAccountRequest = {
        shouldLink: true,
        provider: this.provider(),
        providerId: this.providerId(),
        userId: this.userId(),
        password: this.validateForm.value.password,
      };

      this.oauth2Service
        .linkOAuthAccount(linkRequest)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.linking.set(false);
            this.close();
            this.oauth2Service.clearOAuthData();
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            this.linking.set(false);
            if (err.status === 401) {
              this.errorMessage.set('Invalid password. Please try again.');
            } else if (err.status === 409) {
              this.errorMessage.set('This account is already linked.');
            } else {
              this.errorMessage.set('Something went wrong. Please try again.');
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

  skipLinking(): void {
    this.oauth2Service.clearOAuthData();
    this.close();
    this.router.navigate(['/login']);
  }

  getProviderDisplayName(): string {
    const provider = this.provider().toLowerCase();
    switch (provider) {
      case 'google':
        return 'Google';
      case 'facebook':
        return 'Facebook';
      case 'github':
        return 'GitHub';
      default:
        return provider.charAt(0).toUpperCase() + provider.slice(1);
    }
  }
}
