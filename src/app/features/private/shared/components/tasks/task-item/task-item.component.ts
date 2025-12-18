import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  signal,
  input,
  inject,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Task } from '../../../../../shared/models/task-models/task.model';
import { IndividualTaskService } from '../../../../../shared/services/tasks/individual-task.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { EditTaskRequest } from '../../../../../shared/models/task-models/edit-task-request';
import { PomodoroTaskProgressComponent } from '../pomodoro-task-progress/pomodoro-task-progress.component';
import { durationToDays } from '../../../../../../shared/util/DateFormatterUtil';
import { HabitTaskService } from '../../../../../shared/services/tasks/habit-task.service';
import { EditHabitRequest } from '../../../../../shared/models/task-models/edit-habit-request';
import { NotificationService } from '../../../../../shared/services/notification-service/notification.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    NzIconDirective,
    NzButtonComponent,
    PomodoroTaskProgressComponent,
  ],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css',
})
export class TaskItemComponent implements OnInit {
  @Input() task!: Task;
  isCompleted = signal(false);

  @Output() taskUpdated = new EventEmitter<string>();
  @Output() editTask = new EventEmitter<Task>();

  isInSession = input<boolean>(false);
  inPomodoroList = input<boolean>(false);
  @Output() moveToCurrentSession = new EventEmitter<Task>();
  @Output() removeFromCurrentSession = new EventEmitter<Task>();

  taskService = inject(IndividualTaskService);
  habitService = inject(HabitTaskService);
  notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.isCompleted.set(this.task.completedAt != null);
  }

  completeTask(): void {
    this.isCompleted.set(true);
    const request: EditTaskRequest = {
      title: this.task.title,
      startTime: this.task.startTime,
      endTime: this.task.endTime,
      categoryId: this.task.categoryId,
      difficultyId: this.task.difficultyId,
      completedAt: new Date(Date.now()).toISOString(),
      description: this.task.description,
    };
    this.taskService.editTask(this.task.taskId, request).subscribe({
      next: (response) => {
        this.task.completedAt = response.completedAt;
        this.taskUpdated.emit(this.task.taskId);
        this.notificationService.success('Task completed successfully');
      },
      error: (error) => {
        this.isCompleted.set(false);
        this.notificationService.handleApiError(
          error,
          'Failed to complete task',
        );
      },
    });
  }

  completeHabitCycle(): void {
    if (this.task.taskHabit !== null)
      this.task.endTime = this.addCycleLengthToEndTime(
        this.task.endTime!,
        this.task.taskHabit.cycleLength,
      );
    const request: EditTaskRequest = {
      title: this.task.title,
      startTime: this.task.startTime,
      endTime: this.task.endTime,
      categoryId: this.task.categoryId,
      difficultyId: this.task.difficultyId,
      completedAt: this.task.completedAt,
      description: this.task.description,
    };
    this.taskService.editTask(this.task.taskId, request).subscribe({
      next: () => {
        this.task.taskHabit!.currentStreak++;
        if (
          this.task.taskHabit!.longestStreak <
          this.task.taskHabit!.currentStreak
        ) {
          this.task.taskHabit!.longestStreak =
            this.task.taskHabit!.currentStreak;
        }

        const request: EditHabitRequest = {
          currentStreak: this.task.taskHabit!.currentStreak,
          longestStreak: this.task.taskHabit!.longestStreak,
          cycleLength: this.task.taskHabit!.cycleLength,
          acceptedDate: this.task.taskHabit!.acceptedDate,
        };
        this.habitService
          .editHabitTask(
            this.task.taskHabit!.habitId,
            this.task.taskId,
            request,
          )
          .subscribe({
            next: () => {
              this.taskUpdated.emit(this.task.taskId);
              this.notificationService.success(
                `Habit cycle completed! Current streak: ${this.task.taskHabit!.currentStreak}`,
              );
            },
            error: (error) => {
              this.notificationService.handleApiError(
                error,
                'Failed to update habit streak',
              );
            },
          });
      },
      error: (error) => {
        this.isCompleted.set(false);
        this.notificationService.handleApiError(
          error,
          'Failed to complete habit cycle',
        );
      },
    });
  }

  completeHabit(): void {
    const acceptedDate = new Date(Date.now());

    acceptedDate.setHours(
      acceptedDate.getHours() + 1,
      acceptedDate.getMinutes(),
      acceptedDate.getSeconds(),
      acceptedDate.getMilliseconds(),
    );
    const request: EditHabitRequest = {
      currentStreak: this.task.taskHabit!.currentStreak,
      longestStreak: this.task.taskHabit!.longestStreak,
      cycleLength: this.task.taskHabit!.cycleLength,
      acceptedDate: acceptedDate.toISOString(),
    };
    this.habitService
      .editHabitTask(this.task.taskHabit!.habitId, this.task.taskId, request)
      .subscribe({
        next: () => {
          this.completeTask();
          this.taskUpdated.emit(this.task.taskId);
        },
        error: (error) => {
          this.notificationService.handleApiError(
            error,
            'Failed to complete habit',
          );
        },
      });
  }

  onTaskEdit() {
    this.editTask.emit(this.task);
  }

  isInactive(): boolean {
    return (
      !!this.task.completedAt ||
      new Date(this.task.endTime!) < new Date(Date.now())
    );
  }

  addTaskToPomodoroSession() {
    this.moveToCurrentSession.emit(this.task);
  }

  removeTaskFromPomodoroSession() {
    this.removeFromCurrentSession.emit(this.task);
  }

  addCycleLengthToEndTime(endTime: string, cycleLength: string): string {
    const endDate = new Date(endTime);
    const cycleLengthInDays = durationToDays(cycleLength);
    endDate.setDate(endDate.getDate() + cycleLengthInDays);
    return endDate.toISOString();
  }
}
