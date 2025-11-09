import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
import { environment } from '../../../../../../environments/environment.development';

@Component({
  selector: 'app-reset-password',
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
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isSubmitting = signal(false);
  isPasswordVisible = signal(false);
  status = signal<'idle' | 'sending' | 'success' | 'error'>('idle');

  code: string | null = null;

  validateForm = this.fb.group({
    password: this.fb.control('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(128),
      this.isPasswordValidator.bind(this),
    ]),
  });

  ngOnInit(): void {
    this.code = this.route.snapshot.queryParamMap.get('code');

    if (!this.code) {
      this.status.set('error');
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

    this.status.set('sending');
    this.isSubmitting.set(true);

    const newPassword = this.validateForm.value.password!;
    const code = this.code;

    this.http
      .post(`${environment.apiUrl}/auth/reset-password`, {
        code,
        newPassword,
      })
      .subscribe({
        next: () => {
          this.status.set('success');
          this.isSubmitting.set(false);
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.status.set('error');
          const detail = err.error?.detail;
          if (detail) {
            this.validateForm.get('password')?.setErrors({ apiError: detail });
          }
        },
      });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
