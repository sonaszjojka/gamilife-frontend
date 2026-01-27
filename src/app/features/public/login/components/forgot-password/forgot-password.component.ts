import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    CommonModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
  standalone: true,
})
export class ForgotPasswordComponent {
  isVisible = signal(false);
  sending = signal(false);
  sentSuccessfully = signal(false);
  errorMessage = signal<string | null>(null);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);

  validateForm = this.fb.group({
    email: this.fb.control('', [Validators.email, Validators.required]),
  });

  open(): void {
    this.isVisible.set(true);
    this.sentSuccessfully.set(false);
    this.errorMessage.set(null);
    this.validateForm.reset();
  }

  close(): void {
    this.isVisible.set(false);
    this.sentSuccessfully.set(false);
    this.errorMessage.set(null);
    this.validateForm.reset();
  }

  sendResetLink(): void {
    if (this.sending()) return;

    if (this.validateForm.valid) {
      this.sending.set(true);
      this.sentSuccessfully.set(false);
      this.errorMessage.set(null);
      const formData = this.validateForm.value;

      this.authService
        .forgotPassword(formData.email!)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.sending.set(false);
            this.sentSuccessfully.set(true);
          },
          error: (err) => {
            this.sending.set(false);
            if (err.status === 404) {
              this.errorMessage.set('Email address not found');
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
}
