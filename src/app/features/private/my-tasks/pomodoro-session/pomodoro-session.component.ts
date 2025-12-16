import {
  Component,
  HostListener,
  inject,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  IndividualTaskService,
} from '../../../shared/services/tasks/individual-task.service';
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
import { PomodoroTaskService } from '../../../shared/services/tasks/pomodoro-task.service';
import { EditPomodoroRequest } from '../../../shared/models/task-models/edit-pomodoro-request';
import { EditTaskRequest } from '../../../shared/models/task-models/edit-task-request';
import { PomodoroSessionBreakModalComponent } from '../../shared/components/tasks/pomodoro-session-break-modal/pomodoro-session-break-modal.component';
import {ActivityItemDetails} from '../../../shared/models/task-models/activity.model';
import {Page} from '../../../shared/models/util/page.model';

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

  allUsersTasks: ActivityItemDetails[] = [];
  currentSessionPomodoroTasks: ActivityItemDetails[] = [];
  usersPomodoroTasks: ActivityItemDetails[] = [];
  usersNotPomodoroTasks: ActivityItemDetails[] = [];

  timer: ReturnType<typeof setTimeout> | null = null;
  remainingTime = 0;
  isSessionActive = false;
  isBreakActive = false;
  private sessionDuration = 10;
  private breakDuration = 10;

  currentPage = 0;
  pageSize = 50;
  totalPages = 0;
  hasMore = true;

  taskService = inject(IndividualTaskService);
  pomodoroService = inject(PomodoroTaskService);

  @HostListener('window:scroll')
  onScroll(): void {
    const threshold = 200;
    const position = window.scrollY + window.innerHeight;
    const height = document.documentElement.scrollHeight;

    if (
      position > height - threshold &&
      !this.loading &&
      !this.loadingMore &&
      this.hasMore
    ) {
      this.loadMoreTasks();
    }
  }

  ngOnInit() {
    this.taskService
      .getAllActivities(this.currentPage, this.pageSize, null, null, null, null,null)
      .subscribe({
        next: (response: Page<ActivityItemDetails>) => {
          this.allUsersTasks = response.content;
          this.dispatchTasks();
          this.totalPages = response.totalPages;
          this.currentPage = response.number;
          this.hasMore = !response.last;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading tasks:', error);
          this.loading = false;
        },
      });
  }

  loadMoreTasks(): void {
    if (!this.hasMore || this.loadingMore) return;

    this.loadingMore = true;
    const nextPage = this.currentPage + 1;

    this.taskService
      .getAllActivities(nextPage, this.pageSize, null, null, null, null,null)
      .subscribe({
        next: (response: Page<ActivityItemDetails>) => {
          this.allUsersTasks = [...this.allUsersTasks, ...response.content];
          this.dispatchTasks();
          this.totalPages = response.totalPages;
          this.currentPage = response.number;
          this.hasMore = !response.last;
          this.loadingMore = false;
        },
        error: (error) => {
          console.error('Error loading tasks:', error);
          this.loadingMore = false;
        },
      });
  }

  dispatchTasks() {
    const tasksNotInSession: ActivityItemDetails[] = this.allUsersTasks.filter(
      (t) => !this.currentSessionPomodoroTasks.includes(t),
    );

    this.usersPomodoroTasks = tasksNotInSession.filter(
      (t) => t.pomodoro?.id != null,
    );
    this.usersNotPomodoroTasks = tasksNotInSession.filter(
      (t) => t.pomodoro?.id == null,
    );
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
    const request: EditPomodoroRequest = {
      workCyclesCompleted:
        this.currentSessionPomodoroTasks[0].pomodoro!.cyclesCompleted,
      workCyclesNeeded:
        this.currentSessionPomodoroTasks[0].pomodoro!.cyclesRequired,
    };
    this.pomodoroService
      .editPomodoro(
        this.currentSessionPomodoroTasks[0].pomodoro!.id!,
        request,
      )
      .subscribe();

    if (
      this.currentSessionPomodoroTasks[0].pomodoro!.cyclesCompleted ==
      this.currentSessionPomodoroTasks[0].pomodoro!.cyclesRequired
    ) {
      this.pomodoroSessionAcceptTaskModal.task =
        this.currentSessionPomodoroTasks[0];
      this.pomodoroSessionAcceptTaskModal.showModal();
    }
  }

  removeFromPanel(activity: ActivityItemDetails) {
    const request: EditTaskRequest = {
      title: activity.title,
      description: activity.description,
      difficultyId: activity.difficultyId,
      categoryId: activity.categoryId,
      deadlineDate: activity.deadlineDate,
      deadlineTime: activity.deadlineTime,
    };

    this.taskService.editTask(activity.id, request).subscribe();

    this.currentSessionPomodoroTasks = this.currentSessionPomodoroTasks.filter(
      (t) => t.id != activity.id,
    );
    this.allUsersTasks = this.allUsersTasks.filter(
      (t) => t.id != activity.id,
    );
  }

  removeFromCurrentSession(task: ActivityItemDetails) {
    this.usersPomodoroTasks.push(
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
    if (activity.pomodoro?.id == null) {
      this.pomodoroSessionFormModal.task = activity;
      this.pomodoroSessionFormModal.showModal();
    }

    if (activity.pomodoro != null) {
      if (
        activity.pomodoro.cyclesCompleted! >= activity.pomodoro.cyclesRequired!
      ) {
        this.pomodoroSessionFormModal.task = activity;
        this.pomodoroSessionFormModal.showModal();
      } else {
        this.currentSessionPomodoroTasks.push(
          this.usersPomodoroTasks.find((a) => a.id == activity.id) as ActivityItemDetails,
        );
        this.usersPomodoroTasks = this.usersPomodoroTasks.filter(
          (a) => a.id != activity.id,
        );
      }
    }
  }
  moveModalPomodoroToSession(activity: ActivityItemDetails) {
    if (
      this.usersNotPomodoroTasks.find((a) => a.id == activity.id) as ActivityItemDetails
    ) {
      this.currentSessionPomodoroTasks.push(
        this.usersNotPomodoroTasks.find((a) => a.id == activity.id) as ActivityItemDetails,
      );
      this.usersNotPomodoroTasks = this.usersNotPomodoroTasks.filter(
        (a) => a.id != activity.id,
      );
    } else {
      this.currentSessionPomodoroTasks.push(
        this.usersPomodoroTasks.find((a) => a.id == activity.id) as ActivityItemDetails,
      );
      this.usersPomodoroTasks = this.usersPomodoroTasks.filter(
        (a) => a.id != activity.id,
      );
    }
  }
}
