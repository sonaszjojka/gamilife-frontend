import {
  Component,
  inject,
  Input,
  effect,
  WritableSignal,
  Output,
  EventEmitter,
  signal, input,
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
import { IndividualTaskService } from '../../../../../shared/services/tasks/individual-task.service';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { EditTaskRequest } from '../../../../../shared/models/task-models/edit-task-request';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzTimePickerComponent } from 'ng-zorro-antd/time-picker';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { PomodoroFormComponent } from '../pomodoro-form/pomodoro-form.component';
import { CreatePomodoroRequest } from '../../../../../shared/models/task-models/create-pomodoro-request';
import { PomodoroTaskService } from '../../../../../shared/services/tasks/pomodoro-task.service';
import { EditPomodoroRequest } from '../../../../../shared/models/task-models/edit-pomodoro-request';
import { CreateHabitRequest } from '../../../../../shared/models/task-models/create-habit-request';
import { EditHabitRequest } from '../../../../../shared/models/task-models/edit-habit-request';
import { HabitFormComponent } from '../habit-form/habit-form.component';
import { HabitTaskService } from '../../../../../shared/services/tasks/habit-task.service';
import {ActivityItemDetails} from '../../../../../shared/models/task-models/activity.model';
import { NotificationService } from '../../../../../shared/services/notification-service/notification.service';

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
    PomodoroFormComponent,
    NzAutosizeDirective,
    HabitFormComponent,
  ],
  templateUrl: './task-form.component.html',
  standalone: true,
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent {
  isDisabled = input<boolean>(true)
  pomodoroCreation = signal<boolean>(false);
  pomodoroEdition = signal<boolean>(false);
  habitCreation = signal<boolean>(false);
  habitEdition = signal<boolean>(false);
  @Input() activity!: WritableSignal<ActivityItemDetails | null>;
  @Input() creationMode?: WritableSignal<boolean | null>;
  @Input() editionMode?: WritableSignal<boolean | null>;
  @Output() taskFormSubmitted = new EventEmitter<void>();
  @Output() taskDeleted = new EventEmitter<void>();
  pomodoroRequest?: CreatePomodoroRequest;
  pomodoroEditRequest?: EditPomodoroRequest;
  habitRequest?: CreateHabitRequest;
  habitEditRequest?: EditHabitRequest;

  habitCreateDurationDays?: number;
  habitEditDurationDays?: number;

  private formBuilder = inject(NonNullableFormBuilder);
  private taskService = inject(IndividualTaskService);
  private pomodoroService = inject(PomodoroTaskService);
  private habitService = inject(HabitTaskService);
  private notificationService = inject(NotificationService);

  validTaskForm = this.formBuilder.group({
    title: this.formBuilder.control('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(300),
    ]),

    deadlineDate: this.formBuilder.control<Date | null>(null, [
      Validators.required,
    ]),
    deadlineHour: this.formBuilder.control<Date | null>(null, [
      Validators.required,
    ]),
    categoryId: this.formBuilder.control<number>(0, [Validators.required]),
    difficultyId: this.formBuilder.control<number>(0, [Validators.required]),
    completedAt: this.formBuilder.control(''),
    description: this.formBuilder.control('', [Validators.required]),
  });

  categories = [
    {categoryId: 1, categoryName: 'Work'},
    {categoryId: 2, categoryName: 'Personal'},
    {categoryId: 3, categoryName: 'Health'},
  ];

  difiiculties = [
    {difficultyId: 1, difficultyName: 'Easy'},
    {difficultyId: 2, difficultyName: 'Medium'},
    {difficultyId: 3, difficultyName: 'Hard'},
  ];

  constructor() {
    effect(() => {
      const activity = this.activity?.();
      const isEditing = this.editionMode?.();
      const isCreating = this.creationMode?.();

      if (activity && isEditing) {
        const endDate = activity.deadlineDate ? new Date(activity.deadlineDate) : null;
        const endHour = activity.deadlineTime ? new Date(activity.deadlineTime) : null;
        this.validTaskForm.patchValue({
          title: activity.title || '',
          deadlineDate: endDate,
          deadlineHour: endHour,
          categoryId: activity.categoryId,
          difficultyId: activity.difficultyId,
          description: activity.description || '',
        });
      } else if (isCreating) {
        this.validTaskForm.reset();
      }
    });
  }

  onClose() {
    this.editionMode?.set(false);
    this.creationMode?.set(false);
    this.validTaskForm.reset();
  }

  onSubmit() {
    if (this.validTaskForm.invalid) {
      Object.values(this.validTaskForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      this.notificationService.showValidationError();
      return;
    }

    const formValue = this.validTaskForm.getRawValue();



    const request: EditTaskRequest = {
      title: formValue.title,
      deadlineDate: formValue.deadlineDate!.toISOString().slice(0,10),
      deadlineTime: formValue.deadlineHour!.toISOString().slice(11,19),
      categoryId: formValue.categoryId,
      difficultyId: formValue.difficultyId,
      description: formValue.description,
    };

    if (this.creationMode?.()) {
      this.taskService.createTask(request).subscribe({
        next: () => {
          this.validTaskForm.reset();
          this.notificationService.handleApiSuccess(
            'POST',
            'Task created successfully',
          );
          this.taskFormSubmitted.emit();
        },
        error: (error) => {
          this.notificationService.handleApiError(error);
          this.taskFormSubmitted.emit();
        },
      });

    } else if (this.editionMode?.()) {
      const activity = this.activity?.();
      if (activity == null) {
        return;
      }
      /*
      if (this.pomodoroRequest && this.pomodoroCreation()) {
        this.pomodoroService
          .createPomodoro(activity.taskId, this.pomodoroRequest)
          .subscribe({
            next: (response) => {
              activity.pomodoro = {
                pomodoroId: response.pomodoroId,
                workCyclesNeeded: response.workCyclesNeeded,
                workCyclesCompleted: response.workCyclesCompleted,
                createdAt: response.createdAt,
              };
              this.notificationService.handleApiSuccess(
                'POST',
                'Pomodoro added successfully',
              );
            },
            error: (error) => {
              this.notificationService.handleApiError(error);
            },
          });
      } else if (this.pomodoroEditRequest && this.pomodoroEdition()) {
        if (activity.pomodoro && activity.pomodoro.pomodoroId) {
          this.pomodoroService
            .editPomodoro(activity.pomodoro.pomodoroId, this.pomodoroEditRequest)
            .subscribe({
              next: (response) => {
                if (activity.pomodoro) {
                  activity.pomodoro.workCyclesNeeded = response.workCyclesNeeded;
                  activity.pomodoro.workCyclesCompleted =
                    response.workCyclesCompleted;
                  activity.pomodoro.createdAt = response.createdAt;
                }
                this.notificationService.handleApiSuccess(
                  'PUT',
                  'Pomodoro updated successfully',
                );
              },
              error: (error) => {
                this.notificationService.handleApiError(error);
              },
            });

        }
      }

      if (this.habitRequest && this.habitCreation()) {
        this.habitRequest.cycleLength = daysAsDuration(
          this.habitCreateDurationDays!,
        );

        this.habitService
          .createHabitTask(activity.taskId, this.habitRequest)
          .subscribe({
            next: (response) => {
              activity.taskHabit = {
                habitId: response.habitId,
                cycleLength: response.cycleLength,
                currentStreak: response.currentStreak,
                longestStreak: response.longestStreak,
                acceptedDate: response.acceptedDate,
              };
              //ToDo decide if we need to set activity.endTime from here or use already existing one
              this.notificationService.handleApiSuccess(
                'POST',
                'Habit added successfully',
              );
              //ToDo decide if we need to set task.endTime from here or use already existing one
            },
            error: (error) => {
              this.notificationService.handleApiError(error);
            },
          });
      } else if (this.habitEditRequest && this.habitEdition()) {
        this.habitEditRequest.cycleLength = daysAsDuration(
          this.habitEditDurationDays!,
        );
        if (activity.taskHabit && activity.taskHabit.habitId) {
          this.habitService
            .editHabitTask(
              activity.taskHabit.habitId,
              activity.taskId,
              this.habitEditRequest,
            )
            .subscribe({
              next: (response) => {
                if (activity.taskHabit) {
                  activity.taskHabit.cycleLength = response.cycleLength;
                  activity.taskHabit.currentStreak = response.currentStreak;
                  activity.taskHabit.longestStreak = response.longestStreak;
                  activity.taskHabit.acceptedDate = response.acceptedDate;
                }
                this.notificationService.handleApiSuccess(
                  'PUT',
                  'Habit updated successfully',
                );
              },
              error: (error) => {
                this.notificationService.handleApiError(error);
              },
            });


        }

       */
    }

    this.taskService.editTask(this.activity()!.id, request).subscribe({
      next: () => {
        this.validTaskForm.reset();
        this.taskFormSubmitted.emit();
      },
      error: (error) => {
        console.error('Error editing task:', error);
        this.taskFormSubmitted.emit();
      },
    });
  }



  onDelete() {
    this.taskService.deleteTask(this.activity()!.id).subscribe({
      next: () => {
        this.validTaskForm.reset();
        this.notificationService.handleApiSuccess(
          'DELETE',
          'Task deleted successfully',
        );
        this.taskDeleted.emit();
      },
      error: (error) => {
        this.notificationService.handleApiError(error);
        this.taskFormSubmitted.emit();
      },
    });
  }

  onPomodoroCreation() {
    this.pomodoroCreation.update((value) => !value);
  }

  onPomodoroEdition() {
    this.pomodoroEdition.update((value) => !value);
  }

  onPomodoroFormChange(pomodoroRequest: CreatePomodoroRequest) {
    if (pomodoroRequest != null) this.pomodoroRequest = pomodoroRequest;
  }

  onPomodoroEditFormChange(pomodoroEditRequest: EditPomodoroRequest) {
    if (pomodoroEditRequest != null)
      this.pomodoroEditRequest = pomodoroEditRequest;
  }

  onHabitCreation() {
    this.habitCreation.update((value) => !value);
    this.habitRequest = {
      cycleLength: '',
      currentStreak: 0,
      longestStreak: 0,
      acceptedDate: null,
    };
  }

  onHabitEdition() {
    this.habitEdition.update((value) => !value);
  }

  onHabitFormChange(habitCreateDurationInDays: number) {
    if (habitCreateDurationInDays != null)
      this.habitCreateDurationDays = habitCreateDurationInDays;
  }

  onHabitEditFormChange(habitEditDurationInDays: number) {
    if (habitEditDurationInDays != null)
      this.habitEditDurationDays = habitEditDurationInDays;
  }
}
