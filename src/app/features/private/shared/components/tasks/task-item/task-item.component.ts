import {
  Component,
  EventEmitter,
  inject,
  input,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { UserTaskApiService } from '../../../../../shared/services/tasks/user-task-api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { TaskRequest } from '../../../../../shared/models/task-models/task-request';
import { PomodoroTaskProgressComponent } from '../pomodoro-task-progress/pomodoro-task-progress.component';
import { UserHabitApiService } from '../../../../../shared/services/tasks/user-habit-api.service';
import {
  ActivityItemDetails,
  ActivityStatus,
  ActivityType,
  HabitStatus,
} from '../../../../../shared/models/task-models/activity.model';
import { HabitRequest } from '../../../../../shared/models/task-models/habit-request.model';
import { NotificationService } from '../../../../../shared/services/notification-service/notification.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconDirective,
    NzButtonComponent,
    PomodoroTaskProgressComponent,
    DatePipe,
  ],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css',
})
export class TaskItemComponent implements OnInit {
  protected readonly ActivityType = ActivityType;
  protected readonly ActivityStatus = ActivityStatus;
  protected readonly HabitStatus = HabitStatus;

  @Input() activity!: ActivityItemDetails;
  isCompleted = signal(false);

  @Output() taskUpdated = new EventEmitter<string>();
  @Output() editTask = new EventEmitter<{
    activity: ActivityItemDetails;
    viewMode: boolean;
  }>();

  isInSession = input<boolean>(false);
  inPomodoroList = input<boolean>(false);
  @Output() moveToCurrentSession = new EventEmitter<ActivityItemDetails>();
  @Output() removeFromCurrentSession = new EventEmitter<ActivityItemDetails>();

  taskService = inject(UserTaskApiService);
  habitService = inject(UserHabitApiService);
  notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.isCompleted.set(
      this.activity.status != ActivityStatus.DEADLINE_MISSED,
    );
  }

  completeTask(event: MouseEvent): void {
    event.stopPropagation();
    this.isCompleted.set(true);
    const request: TaskRequest = {
      title: this.activity.title,
      deadlineDate: this.activity.deadlineDate,
      deadlineTime: this.activity.deadlineTime,
      categoryId: this.activity.categoryId,
      difficultyId: this.activity.difficultyId,
      completed: true,
      description: this.activity.description,
    };
    this.taskService.editTask(this.activity.id, request).subscribe({
      next: (response) => {
        this.activity.completedAt = response.completedAt;
        this.activity.status = ActivityStatus.COMPLETED;
        this.taskUpdated.emit(this.activity.id);
        this.notificationService.success(
          `You have successfully completed the task: ${this.activity.title}`,
        );
      },
      error: () => {
        this.notificationService.error(
          `There was an error completing the task: ${this.activity.title}`,
        );
        this.isCompleted.set(false);
      },
    });
  }

  completeHabitCycle(event: MouseEvent): void {
    event.stopPropagation();
    if (this.activity.type == ActivityType.HABIT) {
      const request: HabitRequest = {
        iterationCompleted: true,
      };
      this.habitService.editHabit(this.activity.id, request).subscribe({
        next: (response) => {
          this.activity.deadlineDate = response.deadlineDate;
          this.activity.currentStreak = response.currentStreak;
          this.activity.longestStreak = response.longestStreak;
          this.activity.canBeWorkedOn = response.workable;
          this.taskUpdated.emit(this.activity.id);
          this.notificationService.success(
            `You have successfully completed a cycle for the habit: ${this.activity.title}`,
          );
        },
        error: () => {
          this.notificationService.error(
            `There was an error completing a cycle for the habit: ${this.activity.title}`,
          );
        },
      });
    }
  }
  onTaskEdit(event: MouseEvent) {
    event.stopPropagation();
    this.editTask.emit({ activity: this.activity, viewMode: false });
  }
  onTaskView(event: MouseEvent) {
    event.stopPropagation();
    this.editTask.emit({ activity: this.activity, viewMode: true });
  }

  addTaskToPomodoroSession() {
    this.moveToCurrentSession.emit(this.activity);
  }

  removeTaskFromPomodoroSession() {
    this.removeFromCurrentSession.emit(this.activity);
  }

  restoreHabit($event: MouseEvent) {
    $event.stopPropagation();
    const request: HabitRequest = {
      resurrect: true,
    };
    this.habitService.editHabit(this.activity.id, request).subscribe({
      next: (response) => {
        this.activity.habitStatus = HabitStatus.ALIVE;
        this.activity.deadlineDate = response.deadlineDate;
        this.activity.canBeWorkedOn = response.workable;
        this.taskUpdated.emit(this.activity.id);
        this.notificationService.success(
          `You have successfully restored the habit: ${this.activity.title}`,
        );
      },
      error: () => {
        this.notificationService.error(
          `There was an error restoring the habit: ${this.activity.title}`,
        );
      },
    });
  }
}
