import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UserTaskApiService } from '../../../shared/services/tasks/user-task-api.service';
import { TaskItemComponent } from '../../shared/components/tasks/task-item/task-item.component';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { PomodoroSessionFormModal } from '../../shared/components/tasks/pomodoro-form-modal/pomodoro-session-form-modal';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { PomodoroSessionAcceptTaskModalComponent } from '../../shared/components/tasks/pomodoro-session-accept-task-modal/pomodoro-session-accept-task-modal.component';
import { UserPomodoroApiService } from '../../../shared/services/tasks/user-pomodoro-api.service';
import { TaskRequest } from '../../../shared/models/task-models/task-request';
import { PomodoroSessionBreakModalComponent } from '../../shared/components/tasks/pomodoro-session-break-modal/pomodoro-session-break-modal.component';
import {
  ActivityItemDetails,
  ActivityType,
} from '../../../shared/models/task-models/activity.model';
import { Page } from '../../../shared/models/util/page.model';
import { PomodoroRequest } from '../../../shared/models/task-models/pomodoro-request';
import { HabitRequest } from '../../../shared/models/task-models/habit-request.model';
import { UserHabitApiService } from '../../../shared/services/tasks/user-habit-api.service';
import { NotificationService } from '../../../shared/services/notification-service/notification.service';
import { UserActivitiesApiService } from '../../../shared/services/tasks/user-activities-api.service';

@Component({
  selector: 'app-pomodoro-session',
  imports: [
    TaskItemComponent,
    NzButtonComponent,
    CdkDrag,
    CdkDropList,
    PomodoroSessionFormModal,
    NzWaveDirective,
    PomodoroSessionAcceptTaskModalComponent,
    PomodoroSessionBreakModalComponent,
  ],
  templateUrl: './pomodoro-session.component.html',
  standalone: true,
  styleUrl: './pomodoro-session.component.css',
})
export class PomodoroSessionComponent implements OnInit, OnDestroy {
  @ViewChild(PomodoroSessionFormModal)
  pomodoroSessionFormModal!: PomodoroSessionFormModal;
  @ViewChild(PomodoroSessionAcceptTaskModalComponent)
  pomodoroSessionAcceptTaskModal!: PomodoroSessionAcceptTaskModalComponent;
  @ViewChild(PomodoroSessionBreakModalComponent)
  pomodoroSessionBreakModal!: PomodoroSessionBreakModalComponent;

  loading = false;
  loadingMore = false;

  currentSessionPomodoroTasks: ActivityItemDetails[] = [];
  usersPomodoroActivities: ActivityItemDetails[] = [];
  usersNotPomodoroTasks: ActivityItemDetails[] = [];

  timer: ReturnType<typeof setTimeout> | null = null;
  remainingTime = 0;
  isSessionActive = false;
  isBreakActive = false;

  private sessionDuration = 10;
  private breakDuration = 10;

  pageSize = 5;

  currentPomodoroPage = 0;
  totalPomodoroPages = 0;

  currentNonPomodoroPage = 0;
  totalNonPomodoroPages = 0;

  private readonly taskService = inject(UserTaskApiService);
  private readonly pomodoroService = inject(UserPomodoroApiService);
  private readonly habitService = inject(UserHabitApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly activitiesService = inject(UserActivitiesApiService);

  @HostListener('window:scroll')
  onScroll(): void {
    const threshold = 200;
    const position = window.scrollY + window.innerHeight;
    const height = document.documentElement.scrollHeight;

    if (
      position > height - threshold &&
      !this.loading &&
      !this.loadingMore &&
      this.currentPomodoroPage + 1 < this.totalPomodoroPages
    ) {
      this.loadMorePomodoroActivities();
    }
    if (
      position > height - threshold &&
      !this.loading &&
      !this.loadingMore &&
      this.currentNonPomodoroPage + 1 < this.totalNonPomodoroPages
    ) {
      this.loadMoreNonPomodoroActivities();
    }
  }

  ngOnInit() {
    this.activitiesService
      .getAllActivities(
        this.currentPomodoroPage,
        this.pageSize,
        null,
        null,
        null,
        null,
        null,
        true,
        true,
      )
      .subscribe({
        next: (response: Page<ActivityItemDetails>) => {
          this.usersPomodoroActivities = response.content;
          this.totalPomodoroPages = response.totalPages;
          this.currentPomodoroPage = response.number;
          this.loading = false;
        },
        error: () => {
          this.notificationService.error(
            'Could not load users pomodoro activities',
          );
          this.loading = false;
        },
      });

    this.activitiesService
      .getAllActivities(
        this.currentPomodoroPage,
        this.pageSize,
        null,
        null,
        null,
        null,
        null,
        true,
        false,
      )
      .subscribe({
        next: (response: Page<ActivityItemDetails>) => {
          this.usersNotPomodoroTasks = response.content;
          this.totalNonPomodoroPages = response.totalPages;
          this.currentNonPomodoroPage = response.number;
          this.loading = false;
        },
        error: () => {
          this.notificationService.error(
            'Could not load users not pomodoro activities',
          );
          this.loading = false;
        },
      });
  }

  loadMorePomodoroActivities(): void {
    if (this.loadingMore) return;
    this.loadingMore = true;
    const nextPage = this.currentPomodoroPage + 1;
    this.activitiesService
      .getAllActivities(
        nextPage,
        this.pageSize,
        null,
        null,
        null,
        null,
        null,
        true,
        true,
      )
      .subscribe({
        next: (response: Page<ActivityItemDetails>) => {
          this.usersPomodoroActivities = [
            ...this.usersPomodoroActivities,
            ...response.content,
          ];
          this.totalPomodoroPages = response.totalPages;
          this.currentPomodoroPage = response.number;
          this.loadingMore = false;
        },
        error: () => {
          this.notificationService.error(
            'Could not load users pomodoro activities',
          );
          this.loadingMore = false;
        },
      });
  }

  loadMoreNonPomodoroActivities(): void {
    if (this.loadingMore) return;
    this.loadingMore = true;
    const nextPage = this.currentNonPomodoroPage + 1;
    this.activitiesService
      .getAllActivities(
        nextPage,
        this.pageSize,
        null,
        null,
        null,
        null,
        null,
        true,
        false,
      )
      .subscribe({
        next: (response: Page<ActivityItemDetails>) => {
          this.usersNotPomodoroTasks = [
            ...this.usersNotPomodoroTasks,
            ...response.content,
          ];
          this.totalNonPomodoroPages = response.totalPages;
          this.currentNonPomodoroPage = response.number;
          this.loadingMore = false;
        },
        error: () => {
          this.notificationService.error(
            'Could not load users not pomodoro activities',
          );
          this.loadingMore = false;
        },
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.currentSessionPomodoroTasks,
      event.previousIndex,
      event.currentIndex,
    );
  }

  onSessionStarted(): void {
    if (!this.currentSessionPomodoroTasks[0]) return;

    if (this.isSessionActive) {
      this.stopTimer();
    } else {
      if (this.remainingTime === 0) {
        this.remainingTime = this.sessionDuration;
      }
      this.isSessionActive = true;
      this.startCountdown();
    }
  }

  private startCountdown(): void {
    if (this.remainingTime <= 0) {
      if (this.isBreakActive) {
        this.handleBreakEnd();
        return;
      } else {
        this.addWorkCycleToTaskOnTop();
        this.startBreak();
        return;
      }
    }

    if (!this.isBreakActive && this.currentSessionPomodoroTasks.length == 0) {
      this.stopTimer();
      this.remainingTime = 0;
      this.isSessionActive = false;
      return;
    }

    if (this.currentSessionPomodoroTasks.length == 0) {
      this.stopTimer();
      this.remainingTime = 0;
      this.isSessionActive = false;
      this.isBreakActive = false;
      return;
    }

    this.remainingTime--;
    this.timer = setTimeout(() => this.startCountdown(), 1000);
  }

  private startBreak(): void {
    this.stopTimer();
    this.isBreakActive = true;
    this.remainingTime = this.breakDuration;
    this.pomodoroSessionBreakModal.showBreakStartModal();
    this.isSessionActive = true;
    this.startCountdown();
  }

  private handleBreakEnd(): void {
    this.stopTimer();
    this.isBreakActive = false;
    this.remainingTime = 0;
    this.pomodoroSessionBreakModal.showBreakEndModal();
  }

  continueSession(): void {
    this.remainingTime = this.sessionDuration;
    this.isSessionActive = true;
    this.startCountdown();
  }

  endSession(): void {
    this.stopTimer();
    this.remainingTime = 0;
    this.isSessionActive = false;
  }

  private stopTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.isSessionActive = false;
  }

  resetTimer(): void {
    this.stopTimer();
    this.remainingTime = 0;
    this.isBreakActive = false;
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  addWorkCycleToTaskOnTop() {
    this.currentSessionPomodoroTasks[0].pomodoro!.cyclesCompleted =
      this.currentSessionPomodoroTasks[0].pomodoro!.cyclesCompleted! + 1;
    const request: PomodoroRequest = {
      cyclesCompleted:
        this.currentSessionPomodoroTasks[0].pomodoro!.cyclesCompleted,
      cyclesRequired:
        this.currentSessionPomodoroTasks[0].pomodoro!.cyclesRequired,
    };
    this.pomodoroService
      .editPomodoro(this.currentSessionPomodoroTasks[0].pomodoro!.id!, request)
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfully updated completed cycles',
          );
        },
        error: () => {
          this.notificationService.error(
            'An error occurred during updating completed cycles',
          );
        },
      });

    if (
      this.currentSessionPomodoroTasks[0].pomodoro!.cyclesCompleted ==
      this.currentSessionPomodoroTasks[0].pomodoro!.cyclesRequired
    ) {
      this.pomodoroSessionAcceptTaskModal.activity =
        this.currentSessionPomodoroTasks[0];
      this.pomodoroSessionAcceptTaskModal.showModal();
    }
  }

  removeFromPanel(activity: ActivityItemDetails) {
    if (activity.type == ActivityType.TASK) {
      const request: TaskRequest = {
        title: activity.title,
        description: activity.description,
        difficultyId: activity.difficultyId,
        categoryId: activity.categoryId,
        deadlineDate: activity.deadlineDate,
        deadlineTime: activity.deadlineTime,
        completed: true,
      };

      this.taskService.editTask(activity.id, request).subscribe({
        next: () => {
          this.notificationService.success('Successfully finished task');
        },
        error: () => {
          this.notificationService.error('Error occurred while finishing task');
        },
      });
    } else if (activity.type == ActivityType.HABIT) {
      const request: HabitRequest = {
        title: activity.title,
        description: activity.description,
        difficultyId: activity.difficultyId,
        categoryId: activity.categoryId,
        cycleLength: activity.cycleLength!,
        iterationCompleted: true,
      };
      this.habitService.editHabit(activity.id, request).subscribe({
        next: (response) => {
          activity.longestStreak = response.longestStreak;
          activity.currentStreak = response.currentStreak;
          this.notificationService.success('Successfully finished habit cycle');
        },
        error: (err) => {
          console.log(err);
          this.notificationService.error(
            'Error occurred while finishing habit cycle',
          );
        },
      });
    }
    this.currentSessionPomodoroTasks = this.currentSessionPomodoroTasks.filter(
      (t) => t.id != activity.id,
    );
  }

  removeFromCurrentSession(task: ActivityItemDetails) {
    this.usersPomodoroActivities.push(
      this.currentSessionPomodoroTasks.find(
        (t) => t.id == task.id,
      ) as ActivityItemDetails,
    );
    this.currentSessionPomodoroTasks = this.currentSessionPomodoroTasks.filter(
      (t) => t.id != task.id,
    );
  }

  moveTaskToCurrentSession(activity: ActivityItemDetails) {
    if (!activity) return;
    if (activity.pomodoro == undefined) {
      this.pomodoroSessionFormModal.activity = activity;
      this.pomodoroSessionFormModal.showModal();
    }

    if (activity.pomodoro != null) {
      if (
        activity.pomodoro.cyclesCompleted! >= activity.pomodoro.cyclesRequired!
      ) {
        this.pomodoroSessionFormModal.activity = activity;
        this.pomodoroSessionFormModal.showModal();
      } else {
        this.currentSessionPomodoroTasks.push(
          this.usersPomodoroActivities.find(
            (a) => a.id == activity.id,
          ) as ActivityItemDetails,
        );
        this.usersPomodoroActivities = this.usersPomodoroActivities.filter(
          (a) => a.id != activity.id,
        );
      }
    }
  }
  moveModalPomodoroToSession(activity: ActivityItemDetails) {
    if (
      this.usersNotPomodoroTasks.find(
        (a) => a.id == activity.id,
      ) as ActivityItemDetails
    ) {
      this.currentSessionPomodoroTasks.push(
        this.usersNotPomodoroTasks.find(
          (a) => a.id == activity.id,
        ) as ActivityItemDetails,
      );
      this.usersNotPomodoroTasks = this.usersNotPomodoroTasks.filter(
        (a) => a.id != activity.id,
      );
    } else {
      this.currentSessionPomodoroTasks.push(
        this.usersPomodoroActivities.find(
          (a) => a.id == activity.id,
        ) as ActivityItemDetails,
      );
      this.usersPomodoroActivities = this.usersPomodoroActivities.filter(
        (a) => a.id != activity.id,
      );
    }
  }
}
