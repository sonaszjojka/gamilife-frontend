import { Component, DestroyRef, inject, input, output } from '@angular/core';
import {
  EditGroupTaskDto,
  GroupTask,
} from '../../../../../shared/models/group/group-task.model';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GroupTaskApiService } from '../../../../../shared/services/group-task-api/group-task-api.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import {
  NzFormControlComponent,
  NzFormDirective,
  NzFormItemComponent,
  NzFormLabelComponent,
} from 'ng-zorro-antd/form';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { NzTimePickerComponent } from 'ng-zorro-antd/time-picker';
import { NotificationService } from '../../../../../shared/services/notification-service/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-group-task-form',
  templateUrl: './group-task-form.component.html',
  imports: [
    CommonModule,
    NzModalModule,
    ReactiveFormsModule,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzInputDirective,
    NzFormDirective,
    NzDatePickerComponent,
    NzSelectComponent,
    NzOptionComponent,
    NzTimePickerComponent,
  ],
  standalone: true,
})
export class GroupTaskFormComponent {
  formSubmitted = output<void>();

  private fb = inject(NonNullableFormBuilder);
  private groupTaskApi = inject(GroupTaskApiService);
  private notification = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  task = input<GroupTask | null>(null);
  groupId = input.required<string>();
  isVisible = false;

  protected validateForm = this.fb.group({
    title: this.fb.control<string>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(200),
    ]),
    description: this.fb.control<string | null>(null, {
      validators: [Validators.maxLength(200)],
    }),
    endDate: this.fb.control<Date | null>(null, [Validators.required]),
    endTime: this.fb.control<Date | null>(null, []),

    categoryId: this.fb.control<number | null>(null, [Validators.required]),
    difficultyId: this.fb.control<number | null>(null, [Validators.required]),
    reward: this.fb.control<number>(1, [
      Validators.required,
      Validators.min(1),
      Validators.max(9999),
    ]),
  });

  categories = [
    { categoryId: 1, categoryName: 'Work' },
    { categoryId: 2, categoryName: 'Personal' },
    { categoryId: 3, categoryName: 'Health' },
  ];

  difiiculties = [
    { difficultyId: 1, difficultyName: 'Easy' },
    { difficultyId: 2, difficultyName: 'Medium' },
    { difficultyId: 3, difficultyName: 'Hard' },
  ];

  openForm(): void {
    const task = this.task();
    if (task != null) {
      if (task.taskDto.deadlineTime != null) {
        const endHour = new Date();
        const [hours, minutes, seconds] = task.taskDto.deadlineTime
          .split(':')
          .map(Number);
        endHour.setHours(hours, minutes, seconds || 0, 0);

        this.validateForm.patchValue({
          title: task.taskDto.title,
          description: task.taskDto!.description,
          endDate: new Date(task.taskDto.deadlineDate),
          endTime: endHour,
          categoryId: task.taskDto.category.id,
          difficultyId: task.taskDto.difficulty.id,
          reward: task.reward,
        });
      } else {
        this.validateForm.patchValue({
          title: task.taskDto.title,
          description: task.taskDto!.description,
          endDate: new Date(task.taskDto.deadlineDate),
          categoryId: task.taskDto.category.id,
          difficultyId: task.taskDto.difficulty.id,
          reward: task.reward,
        });
      }
    }
    this.isVisible = true;
  }

  handleCreate(): void {
    if (this.validateForm.valid) {
      let request;
      const formValue = this.validateForm.getRawValue();
      if (formValue.endTime !== null) {
        const date = formValue.endTime!;
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const deadlineTime = `${hours}:${minutes}:00`;

        request = {
          title: formValue.title,
          description: formValue.description,
          deadlineDate: formValue.endDate!.toISOString().slice(0, 10),
          deadlineTime: deadlineTime,
          categoryId: formValue.categoryId,
          difficultyId: formValue.difficultyId,
          reward: formValue.reward,
        };
      } else {
        request = {
          title: formValue.title,
          description: formValue.description,
          deadlineDate: formValue.endDate!.toISOString().slice(0, 10),
          deadlineTime: null,
          categoryId: formValue.categoryId,
          difficultyId: formValue.difficultyId,
          reward: formValue.reward,
        };
      }

      this.groupTaskApi
        .postGroupTask(this.groupId(), request)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.notification.success('Task created successfully');
            this.formSubmitted.emit();
          },
          error: (error) => {
            this.notification.handleApiError(error, 'Failed to create task');
          },
        });
    }
  }

  handleSubmit(): void {
    if (this.validateForm.valid) {
      if (this.task() == null) {
        this.handleCreate();
      } else {
        this.handleEdit();
      }
      this.isVisible = false;
      this.validateForm.reset();
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

  getTitle(): string {
    if (this.task() == null) {
      return 'Create Task';
    } else {
      return 'Edit Task';
    }
  }

  handleEdit(): void {
    if (this.validateForm.valid) {
      let editGroupTaskRequest: EditGroupTaskDto;
      const formValue = this.validateForm.getRawValue();
      if (formValue.endTime !== null) {
        const date = formValue.endTime;
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const deadlineTime = `${hours}:${minutes}:00`;
        editGroupTaskRequest = {
          title: formValue.title,
          description: formValue.description,
          deadlineDate: formValue.endDate!.toISOString().slice(0, 10),
          deadlineTime: deadlineTime,
          categoryId: formValue.categoryId!,
          difficultyId: formValue.difficultyId!,
          completedAt: null,
          isAccepted: null,
          reward: formValue.reward,
          declineMessage: null,
        };
      } else {
        editGroupTaskRequest = {
          title: formValue.title,
          description: formValue.description,
          deadlineDate: formValue.endDate!.toISOString().slice(0, 10),
          deadlineTime: null,
          categoryId: formValue.categoryId!,
          difficultyId: formValue.difficultyId!,
          completedAt: null,
          isAccepted: null,
          reward: formValue.reward,
          declineMessage: null,
        };
      }

      this.groupTaskApi
        .editGroupTask(
          this.groupId(),
          this.task()!.groupTaskId,
          editGroupTaskRequest,
        )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.notification.success('Task updated successfully');
            this.formSubmitted.emit();
          },
          error: (error) => {
            this.notification.handleApiError(error, 'Failed to update task');
          },
        });
    }
  }
}
