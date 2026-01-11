import {
  Component,
  DestroyRef,
  inject,
  input,
  OnChanges,
  output,
  ViewChild,
} from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  NzFormControlComponent,
  NzFormItemComponent,
  NzFormLabelComponent,
} from 'ng-zorro-antd/form';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzAutosizeDirective, NzInputDirective } from 'ng-zorro-antd/input';
import { UserTaskApiService } from '../../../../shared/services/tasks/user-task-api.service';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzTimePickerComponent } from 'ng-zorro-antd/time-picker';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { UserHabitApiService } from '../../../../shared/services/tasks/user-habit-api.service';
import {
  ActivityItemDetails,
  ActivityType,
} from '../../../../shared/models/task-models/activity.model';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { HabitRequest } from '../../../../shared/models/task-models/habit-request.model';
import { PomodoroSessionFormModal } from '../../../shared/pomodoro-form-modal/pomodoro-session-form-modal';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-task-form',
  imports: [
    NzButtonComponent,
    ReactiveFormsModule,
    NzFormItemComponent,
    NzColDirective,
    NzFormControlComponent,
    NzFormLabelComponent,
    NzInputDirective,
    NzSelectComponent,
    NzOptionComponent,
    NzDatePickerComponent,
    NzTimePickerComponent,
    NzIconDirective,
    NzAutosizeDirective,
    NzInputNumberComponent,
    PomodoroSessionFormModal,
  ],
  templateUrl: './task-form.component.html',
  standalone: true,
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent implements OnChanges {
  viewMode = input<boolean>(false);
  type = input.required<ActivityType>();
  activity = input<ActivityItemDetails | null>(null);
  creationMode = input<boolean>();
  editionMode = input<boolean>();
  activityFormSubmitted = output<void>();
  activityDeleted = output<void>();
  closeForm = output<void>();

  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly taskApi = inject(UserTaskApiService);
  private readonly habitApi = inject(UserHabitApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly ActivityType = ActivityType;

  @ViewChild(PomodoroSessionFormModal)
  protected pomodoroModal = new PomodoroSessionFormModal();

  validActivityForm = this.formBuilder.group({
    title: this.formBuilder.control('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(300),
    ]),

    deadlineDate: this.formBuilder.control<Date | undefined>(undefined, [
      Validators.required,
    ]),
    deadlineHour: this.formBuilder.control<Date | undefined>(undefined, []),
    categoryId: this.formBuilder.control<number | undefined>(undefined, [
      Validators.required,
    ]),
    difficultyId: this.formBuilder.control<number | undefined>(undefined, [
      Validators.required,
    ]),
    description: this.formBuilder.control<string | null>(null),
    cycleLength: this.formBuilder.control<number>(
      0,

      [Validators.required],
    ),
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
  ngOnChanges() {
    const activity = this.activity?.();
    const isEditing = this.editionMode?.();
    const isCreating = this.creationMode?.();
    const currentType = this.type();
    const deadlineControl = this.validActivityForm.controls.deadlineDate;
    const cycleControl = this.validActivityForm.controls.cycleLength;

    if (currentType === ActivityType.HABIT) {
      deadlineControl.clearValidators();
      cycleControl.setValidators([Validators.required, Validators.min(1)]);
    } else {
      deadlineControl.setValidators([Validators.required]);
      cycleControl.clearValidators();
    }

    if (activity?.type == ActivityType.HABIT && isEditing) {
      this.validActivityForm.patchValue({
        title: activity.title || '',
        categoryId: activity.categoryId,
        difficultyId: activity.difficultyId,
        description: activity.description || null,
        cycleLength: activity.cycleLength,
      });
    } else if (activity?.type == ActivityType.TASK && isEditing) {
      const endDate = activity.deadlineDate
        ? new Date(activity.deadlineDate)
        : undefined;
      let endHour: Date | undefined = undefined;

      if (activity.deadlineTime) {
        const [hours, minutes, seconds] = activity.deadlineTime
          .split(':')
          .map(Number);
        endHour = new Date();
        endHour.setHours(hours, minutes, seconds || 0, 0);
      }

      this.validActivityForm.patchValue({
        title: activity.title || '',
        deadlineDate: endDate,
        deadlineHour: endHour,
        categoryId: activity.categoryId,
        difficultyId: activity.difficultyId,
        description: activity.description || null,
      });
    } else if (isCreating) {
      this.validActivityForm.reset();
    }
    if (this.viewMode()) {
      this.validActivityForm.disable();
    } else {
      this.validActivityForm.enable();
    }
  }

  onClose() {
    this.closeForm.emit();
    this.validActivityForm.reset();
  }

  onSubmit() {
    console.log(this.activity());
    console.log(this.type());
    console.log(this.creationMode!());
    console.log(this.editionMode!());

    if (this.validActivityForm.invalid) {
      Object.values(this.validActivityForm.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }
    if (
      this.type() == ActivityType.TASK &&
      this.validActivityForm.value.deadlineDate == undefined
    ) {
      Object.values(this.validActivityForm.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    if (
      this.type() == ActivityType.HABIT &&
      (this.validActivityForm.value.cycleLength == undefined ||
        this.validActivityForm.value.cycleLength <= 0)
    ) {
      Object.values(this.validActivityForm.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    const formValue = this.validActivityForm.getRawValue();

    if (this.type() == ActivityType.TASK) {
      let request;
      if (formValue.deadlineHour != undefined) {
        const date = formValue.deadlineHour;
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const deadlineTime = `${hours}:${minutes}:00`;

        request = {
          title: formValue.title,
          deadlineDate: formValue.deadlineDate!.toISOString().slice(0, 10),
          deadlineTime: deadlineTime,
          categoryId: formValue.categoryId,
          difficultyId: formValue.difficultyId,
          description: formValue.description,
        };
      } else {
        request = {
          title: formValue.title,
          deadlineDate: formValue.deadlineDate!.toISOString().slice(0, 10),
          deadlineTime: null,
          categoryId: formValue.categoryId,
          difficultyId: formValue.difficultyId,
          description: formValue.description,
        };
      }

      if (this.creationMode?.()) {
        this.taskApi
          .createTask(request)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.validActivityForm.reset();
              this.activityFormSubmitted.emit();
              this.notificationService.success('Task created successfully!');
            },
            error: () => {
              this.notificationService.error('Error creating task.');
              this.activityFormSubmitted.emit();
            },
          });
      } else if (this.editionMode?.()) {
        const activity = this.activity?.();
        if (activity == null) {
          return;
        }
        this.taskApi
          .editTask(this.activity()!.id, request)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.validActivityForm.reset();
              this.notificationService.success('Task edited successfully!');
              this.activityFormSubmitted.emit();
            },
            error: () => {
              this.notificationService.error('Error editing task.');
              this.activityFormSubmitted.emit();
            },
          });
      }
    } else if (this.type() == ActivityType.HABIT) {
      const request: HabitRequest = {
        title: formValue.title,
        cycleLength: formValue.cycleLength,
        categoryId: formValue.categoryId,
        difficultyId: formValue.difficultyId,
        description: formValue.description,
      };

      if (this.creationMode!()) {
        this.habitApi
          .createHabit(request)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.notificationService.success('Habit created successfully!');
              this.activityFormSubmitted.emit();
            },
            error: () => {
              this.notificationService.error('Error creating habit.');
            },
          });
      } else {
        this.habitApi
          .editHabit(this.activity()!.id, request)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.notificationService.success('Habit edited successfully!');
              this.activityFormSubmitted.emit();
            },
            error: () => {
              this.notificationService.error('Error editing habit.');
            },
          });
      }
    }
  }

  onDelete() {
    if (this.activity()?.type == ActivityType.TASK) {
      this.taskApi
        .deleteTask(this.activity()!.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.notificationService.success('Task deleted successfully!');
            this.validActivityForm.reset();
            this.activityDeleted.emit();
          },
          error: () => {
            this.notificationService.error('Error deleting task.');
            this.activityFormSubmitted.emit();
          },
        });
    } else {
      this.habitApi
        .deleteHabit(this.activity()!.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.notificationService.success('Habit deleted successfully!');
            this.activityFormSubmitted.emit();
          },
          error: () => {
            this.notificationService.error('Error deleting habit.');
          },
        });
    }
  }

  onPomodoroCreation() {
    this.pomodoroModal.activity = this.activity()!;
    this.pomodoroModal.showModal();
  }
}
