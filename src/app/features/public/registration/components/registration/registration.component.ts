import { Component, inject, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-registration',
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
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent {
  private router = inject(Router);
  private fb = inject(NonNullableFormBuilder);
  isPasswordVisible = signal(false);
  private password? = signal<string>('');

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
      this.passwordValidator.bind(this),
    ]),
    publicProfile: this.fb.control(false),
    budgetReports: this.fb.control(false),
  });

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  changePasswordVisibility() {
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

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return { required: true };

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const valid = passwordRegex.test(value);
    return valid ? null : { passwordStrength: true };
  }
}
