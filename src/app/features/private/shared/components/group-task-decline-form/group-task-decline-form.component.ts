import { Component, DestroyRef, inject, input, output } from '@angular/core';
import {
  EditGroupTaskDto,
  GroupTask,
} from '../../../../shared/models/group/group-task.model';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GroupTaskApiService } from '../../../../shared/services/group-task-api/group-task-api.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import {
  NzFormControlComponent,
  NzFormDirective,
  NzFormItemComponent,
  NzFormLabelComponent,
} from 'ng-zorro-antd/form';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-group-task-decline-form',
  templateUrl: './group-task-decline-form.component.html',
  imports: [
    CommonModule,
    NzModalModule,
    ReactiveFormsModule,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzInputDirective,
    NzFormDirective,
  ],
  standalone: true,
})
export class GroupTaskDeclineFormComponent {
  formSubmitted = output<void>();

  private fb = inject(NonNullableFormBuilder);
  private groupTaskApi = inject(GroupTaskApiService);
  private notification = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  task = input.required<GroupTask>();
  groupId = input.required<string>();
  isVisible = false;

  protected validateForm = this.fb.group({
    declineMessage: this.fb.control<string>('', {
      validators: [Validators.required, Validators.maxLength(300)],
    }),
  });

  openForm(): void {
    this.isVisible = true;
  }

  handleSubmit(): void {
    if (this.validateForm.valid) {
      this.handleEdit();
      this.isVisible = false;
    } else {
      this.notification.showValidationError();
      Object.values(this.validateForm.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.validateForm.reset();
  }

  handleEdit(): void {
    if (this.validateForm.valid) {
      const formValue = this.validateForm.getRawValue();

      const editGroupTaskRequest: EditGroupTaskDto = {
        title: this.task().taskDto.title,
        description: this.task().taskDto.description,
        deadlineDate: this.task().taskDto.deadlineDate,
        deadlineTime: this.task().taskDto.deadlineTime,
        categoryId: this.task().taskDto.category.id,
        difficultyId: this.task().taskDto.difficulty.id,
        completedAt: null,
        isAccepted: false,
        reward: this.task().reward,
        declineMessage: formValue.declineMessage,
      };
      this.groupTaskApi
        .editGroupTask(
          this.groupId(),
          this.task()!.groupTaskId,
          editGroupTaskRequest,
        )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.notification.success('Task declined successfully');
            this.validateForm.reset();
            this.formSubmitted.emit();
          },
          error: (error) => {
            this.notification.handleApiError(error, 'Failed to decline task');
          },
        });
    }
  }
}
