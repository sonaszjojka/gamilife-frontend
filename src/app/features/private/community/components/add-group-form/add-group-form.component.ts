import {
  Component,
  inject,
  signal,
  output,
  DestroyRef,
  input,
} from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GroupApiService } from '../../../../shared/services/groups-api/group-api.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { GroupType } from '../../../../shared/models/group/group-type.model';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-add-group-form',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzIconModule,
    NzTooltipModule,
  ],
  templateUrl: './add-group-form.component.html',
  styleUrl: './add-group-form.component.css',
})
export class AddGroupFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly groupApiService = inject(GroupApiService);
  private readonly notification = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  groupCreated = output<void>();

  protected validateForm = this.fb.group({
    groupName: this.fb.control('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]),
    groupCurrencySymbol: this.fb.control('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(1),
    ]),
    groupTypeId: this.fb.control('', [Validators.required]),
    membersLimit: this.fb.control('', [
      Validators.required,
      Validators.min(2),
      Validators.max(100),
    ]),
  });

  isVisible = signal(false);
  groupTypes = input.required<GroupType[]>();
  isLoading = signal(false);

  open(): void {
    this.isVisible.set(true);
  }

  handleCreate(): void {
    if (this.validateForm.valid) {
      this.isLoading.set(true);
      const formValue = this.validateForm.getRawValue();

      this.groupApiService
        .createGroup(formValue)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.notification.success('Group created successfully');
            this.isVisible.set(false);
            this.validateForm.reset();
            this.isLoading.set(false);
            this.groupCreated.emit();
          },
          error: (err) => {
            this.notification.handleApiError(err, 'Failed to create group');
            this.isLoading.set(false);
          },
        });
    } else {
      this.notification.showValidationError();
      Object.values(this.validateForm.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
    }
  }

  handleCancel(): void {
    this.isVisible.set(false);
    this.validateForm.reset();
  }
}
