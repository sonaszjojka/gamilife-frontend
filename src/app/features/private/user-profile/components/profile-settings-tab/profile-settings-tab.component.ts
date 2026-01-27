import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  inject,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserDetails } from '../../../../shared/models/group/user.model';
import { AuthService } from '../../../../../shared/services/auth/auth.service';
import { UserApiService } from '../../../../shared/services/user-api/user-api.service';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChangePasswordPageComponent } from '../../../change-password/change-password-page/change-password-page.component';
import { SetupPasswordComponent } from '../setup-password/setup-password';

@Component({
  selector: 'app-profile-settings-tab',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzDividerModule,
    NzAlertModule,
    NzDescriptionsModule,
    NzTagModule,
    NzIconModule,
    ChangePasswordPageComponent,
    SetupPasswordComponent,
  ],
  templateUrl: './profile-settings-tab.component.html',
  styleUrl: './profile-settings-tab.component.css',
})
export class ProfileSettingsTabComponent implements OnInit {
  @Input() userDetails!: UserDetails;
  @Output() settingsUpdated = new EventEmitter<UserDetails>();

  settingsForm!: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationService);
  private readonly userApi = inject(UserApiService);
  protected readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.settingsForm = this.fb.group({
      firstName: [this.userDetails.firstName, [Validators.required]],
      lastName: [this.userDetails.lastName, [Validators.required]],
      username: [this.userDetails.username, [Validators.required]],
      dateOfBirth: [
        this.userDetails.dateOfBirth
          ? new Date(this.userDetails.dateOfBirth)
          : null,
        [Validators.required],
      ],
      isProfilePublic: [this.userDetails.isProfilePublic],
      sendBudgetReports: [this.userDetails.sendBudgetReports],
    });
  }

  onSubmit(): void {
    if (this.settingsForm.valid) {
      const formValue = this.settingsForm.value;

      const request = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        username: formValue.username,
        dateOfBirth: formValue.dateOfBirth.toISOString().split('T')[0],
        sendBudgetReports: formValue.sendBudgetReports,
        isProfilePublic: formValue.isProfilePublic,
      };

      this.userApi
        .updateUser(this.userDetails.id, request)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            this.settingsForm.markAsPristine();
            this.notificationService.success('Profile updated successfully!');

            const updatedUser: UserDetails = {
              ...this.userDetails,
              firstName: response.firstName,
              lastName: response.lastName,
              username: response.username,
              dateOfBirth: response.dateOfBirth,
              sendBudgetReports: response.sendBudgetReports,
              isProfilePublic: response.isProfilePublic,
            };
            this.settingsUpdated.emit(updatedUser);
          },
          error: (error) => {
            this.notificationService.handleApiError(
              error,
              'Failed to update profile',
            );
          },
        });
    }
  }

  resetForm(): void {
    this.settingsForm.reset({
      firstName: this.userDetails.firstName,
      lastName: this.userDetails.lastName,
      username: this.userDetails.username,
      dateOfBirth: this.userDetails.dateOfBirth
        ? new Date(this.userDetails.dateOfBirth)
        : null,
      isProfilePublic: this.userDetails.isProfilePublic,
      sendBudgetReports: this.userDetails.sendBudgetReports,
    });
  }
}
