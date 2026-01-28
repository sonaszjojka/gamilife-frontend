import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { UserTaskApiService } from '../../../shared/services/tasks/user-task-api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { TaskRequest } from '../../../shared/models/task/task-request';
import { UserHabitApiService } from '../../../shared/services/tasks/user-habit-api.service';
import {
  ActivityItemDetails,
  ActivityStatus,
  ActivityType,
} from '../../../shared/models/task/activity.model';
import { HabitRequest } from '../../../shared/models/task/habit-request.model';
import { NotificationService } from '../../../shared/services/notification-service/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-activity-item',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconDirective,
    NzButtonComponent,
    DatePipe,
  ],
  templateUrl: './activity-item.component.html',
  styleUrl: './activity-item.component.css',
})
export class ActivityItemComponent implements OnInit {
  protected readonly ActivityType = ActivityType;
  protected readonly ActivityStatus = ActivityStatus;

  activity = input.required<ActivityItemDetails>();
  isCompleted = signal(false);
  isOnDashboard = input<boolean>(false);

  activityUpdated = output<string>();
  editActivity = output<{
    activity: ActivityItemDetails;
    viewMode: boolean;
  }>();

  isInSession = input<boolean>(false);
  inPomodoroList = input<boolean>(false);
  moveToCurrentSession = output<ActivityItemDetails>();
  removeFromCurrentSession = output<ActivityItemDetails>();

  private readonly taskService = inject(UserTaskApiService);
  private readonly habitService = inject(UserHabitApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.isCompleted.set(this.activity().status == ActivityStatus.COMPLETED);
  }

  completeTask(event: MouseEvent): void {
    event.stopPropagation();
    this.isCompleted.set(true);
    const request: TaskRequest = {
      completed: true,
    };
    this.taskService
      .editTask(this.activity().id, request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.activity().completedAt = response.completedAt;
          this.activity().status = ActivityStatus.COMPLETED;
          this.activityUpdated.emit(this.activity().id);
          this.notificationService.success(
            `You have successfully completed the task: ${this.activity().title}`,
          );
        },
        error: () => {
          this.notificationService.error(
            `There was an error completing the task: ${this.activity().title}`,
          );
          this.isCompleted.set(false);
        },
      });
  }

  completeHabitCycle(event: MouseEvent): void {
    event.stopPropagation();
    if (this.activity().type == ActivityType.HABIT) {
      const request: HabitRequest = {
        iterationCompleted: true,
      };
      this.habitService
        .editHabit(this.activity().id, request)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            this.activity().deadlineDate = response.deadlineDate;
            this.activity().currentStreak = response.currentStreak;
            this.activity().longestStreak = response.longestStreak;
            this.activity().canBeWorkedOn = response.workable;
            this.activityUpdated.emit(this.activity().id);
            this.notificationService.success(
              `You have successfully completed a cycle for the habit: ${this.activity().title}`,
            );
          },
          error: () => {
            this.notificationService.error(
              `There was an error completing a cycle for the habit: ${this.activity().title}`,
            );
          },
        });
    }
  }
  onActivityEdit(event: MouseEvent) {
    event.stopPropagation();
    this.editActivity.emit({ activity: this.activity(), viewMode: false });
  }
  onActivityView(event: MouseEvent) {
    event.stopPropagation();
    this.editActivity.emit({ activity: this.activity(), viewMode: true });
  }

  addActivityToPomodoroSession() {
    this.moveToCurrentSession.emit(this.activity());
  }

  removeActivityFromPomodoroSession() {
    this.removeFromCurrentSession.emit(this.activity());
  }

  restoreTask($event: MouseEvent) {
    $event.stopPropagation();
    const request: TaskRequest = {
      completed: false,
    };
    this.taskService
      .editTask(this.activity().id, request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.activity().completedAt = undefined;
          this.activity().status = ActivityStatus.INCOMPLETE;
          this.activityUpdated.emit(this.activity().id);
          this.notificationService.success(
            `You have successfully restored the task: ${this.activity().title}`,
          );
        },
        error: () => {
          this.notificationService.error(
            `There was an error restoring the task: ${this.activity().title}`,
          );
        },
      });
  }

  restoreHabit($event: MouseEvent) {
    $event.stopPropagation();
    const request: HabitRequest = {
      resurrect: true,
    };
    this.habitService
      .editHabit(this.activity().id, request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.activity().status = ActivityStatus.ALIVE;
          this.activity().deadlineDate = response.deadlineDate;
          this.activity().canBeWorkedOn = response.workable;
          this.activityUpdated.emit(this.activity().id);
          this.notificationService.success(
            `You have successfully restored the habit: ${this.activity().title}`,
          );
        },
        error: () => {
          this.notificationService.error(
            `There was an error restoring the habit: ${this.activity().title}`,
          );
        },
      });
  }
}
