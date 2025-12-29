import { CommonModule, formatDate } from '@angular/common';
import {
  Component, DestroyRef,
  effect,
  HostListener,
  inject,
  OnInit,
  output,
  signal,
  untracked,
  ViewChild,
} from '@angular/core';
import { TaskItemComponent } from '../../shared/components/tasks/task-item/task-item.component';
import { TaskFilterComponent } from '../../shared/components/tasks/task-filter/task-filter.component';
import { TaskFormComponent } from '../../shared/components/tasks/task-form/task-form.component';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { TaskCalendarComponent } from '../../shared/components/tasks/task-calendar/task-calendar.component';
import { UserTaskApiService } from '../../../shared/services/tasks/user-task-api.service';
import { Page } from '../../../shared/models/util/page.model';
import {
  ActivityItemDetails,
  ActivityStatus,
  ActivityType,
  HabitStatus,
} from '../../../shared/models/task-models/activity.model';
import { ActivityListView } from '../../../shared/models/task-models/activity-list-view.model';
import { UserHabitApiService } from '../../../shared/services/tasks/user-habit-api.service';
import { UserActivitiesApiService } from '../../../shared/services/tasks/user-activities-api.service';
import { NotificationService } from '../../../shared/services/notification-service/notification.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    TaskItemComponent,
    TaskFilterComponent,
    TaskFormComponent,
    NzButtonComponent,
    TaskCalendarComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit {
  activities: ActivityItemDetails[] = [];
  groupedTasks: Record<string, ActivityItemDetails[]> = {};
  loading = false;
  loadingMore = false;

  protected readonly ActivityListView = ActivityListView;

  editionMode = signal<boolean | null>(false);
  creationMode = signal<boolean | null>(false);
  viewMode = signal<boolean>(true);

  title = signal<string | null>(null);
  startDate = signal<string | null>(null);
  endDate = signal<string | null>(null);
  categoryId = signal<number | null>(null);
  difficultyId = signal<number | null>(null);

  activityListType = signal<ActivityListView>(ActivityListView.Activities);
  isAlive = signal<boolean>(true);

  refreshCalendar = output<void>();
  selectedActivity = signal<ActivityItemDetails | undefined>(undefined);
  formType = signal<ActivityType>(ActivityType.TASK);

  currentPage = 0;
  pageSize = 5;
  totalPages = 0;

  private readonly taskService = inject(UserTaskApiService);
  private readonly habitService = inject(UserHabitApiService);
  private readonly activityService = inject(UserActivitiesApiService);
  private readonly notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef)

  @ViewChild('calendarComponent')
  calendarComponent?: TaskCalendarComponent;

  ngOnInit() {
    this.currentPage = 0;
    this.load();
  }

  private filterEffect = effect(() => {
    this.title();
    this.startDate();
    this.endDate();
    this.categoryId();
    this.difficultyId();
    this.isAlive();
    this.activityListType();
    untracked(() => {
      this.currentPage = 0;
      this.load();
    });
  });

  @HostListener('window:scroll')
  onScroll(): void {
    const threshold = 200;
    const position = window.scrollY + window.innerHeight;
    const height = document.documentElement.scrollHeight;

    if (
      position > height - threshold &&
      !this.loading &&
      !this.loadingMore &&
      this.currentPage + 1 < this.totalPages
    ) {
      this.loadMore();
    }
  }

  load(): void {
    this.loading = true;
    if (this.activityListType() === ActivityListView.Activities) {
      this.activityService
        .getAllActivities(
          this.currentPage,
          this.pageSize,
          this.title(),
          this.startDate(),
          this.endDate(),
          this.categoryId(),
          this.difficultyId(),
          null,
          null,
        )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: Page<ActivityItemDetails>) => {
            this.activities = response.content;
            this.groupActivitiesByDate();
            this.totalPages = response.totalPages;
            this.currentPage = response.number;
            this.loading = false;
          },
          error: (error) => {
            this.notificationService.error('Error loading activities');
            console.error('Error loading activities:', error);
            this.loading = false;
          },
        });
    } else if (this.activityListType() === ActivityListView.Habits) {
      this.habitService
        .getHabits(
          this.currentPage,
          this.pageSize,
          this.isAlive(),
          this.categoryId(),
          this.difficultyId(),
        )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: Page<ActivityItemDetails>) => {
            this.activities = response.content;
            this.groupActivitiesByDate();
            this.totalPages = response.totalPages;
            this.currentPage = response.number;
            this.loading = false;
          },
          error: (error) => {
            this.notificationService.error('Error loading habits');
            console.error('Error loading habits:', error);
            this.loading = false;
          },
        });
    } else if (this.activityListType() === ActivityListView.Tasks) {
      this.taskService
        .getTasks(
          this.currentPage,
          this.pageSize,
          !this.isAlive(),
          this.categoryId(),
          this.difficultyId(),
        )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: Page<ActivityItemDetails>) => {
            this.activities = response.content;
            this.groupActivitiesByDate();
            this.totalPages = response.totalPages;
            this.currentPage = response.number;
            this.loading = false;
          },
          error: (error) => {
            this.notificationService.error('Error loading tasks');
            console.error('Error loading tasks:', error);
            this.loading = false;
          },
        });
    }
  }

  loadMore(): void {
    if (this.loadingMore) return;
    this.loadingMore = true;
    const nextPage = this.currentPage + 1;
    if (this.activityListType() === ActivityListView.Activities) {
      this.activityService
        .getAllActivities(
          nextPage,
          this.pageSize,
          this.title(),
          this.startDate(),
          this.endDate(),
          this.categoryId(),
          this.difficultyId(),
          null,
          null,
        )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: Page<ActivityItemDetails>) => {
            this.activities = [...this.activities, ...response.content];
            this.groupActivitiesByDate();
            this.currentPage = response.number;
            this.loadingMore = false;
          },
          error: (error) => {
            this.notificationService.error('Error loading more activities');
            console.error('Error loading more activities:', error);
            this.loadingMore = false;
          },
        });
    } else if (this.activityListType() === ActivityListView.Habits) {
      this.habitService
        .getHabits(
          nextPage,
          this.pageSize,
          this.isAlive(),
          this.categoryId(),
          this.difficultyId(),
        )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: Page<ActivityItemDetails>) => {
            this.activities = [...this.activities, ...response.content];
            this.groupActivitiesByDate();
            this.currentPage = response.number;
            this.loadingMore = false;
          },
          error: (error) => {
            this.notificationService.error('Error loading more habits');
            console.error('Error loading more habits:', error);
            this.loadingMore = false;
          },
        });
    } else if (this.activityListType() === ActivityListView.Tasks) {
      this.taskService
        .getTasks(
          nextPage,
          this.pageSize,
          !this.isAlive(),
          this.categoryId(),
          this.difficultyId(),
        )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: Page<ActivityItemDetails>) => {
            this.activities = [...this.activities, ...response.content];
            this.groupActivitiesByDate();
            this.currentPage = response.number;
            this.loadingMore = false;
          },
          error: (error) => {
            this.notificationService.error('Error loading more tasks');
            console.error('Error loading more tasks:', error);
            this.loadingMore = false;
          },
        });
    }
  }

  private groupActivitiesByDate(): void {
    const grouped: Record<string, ActivityItemDetails[]> = {};
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    this.activities.forEach((activity) => {
      const date = activity.deadlineDate
        ? new Date(activity.deadlineDate)
        : null;
      if (!date) return;

      let label: string;
      if (this.isSameDay(date, today)) label = 'Today';
      else if (this.isSameDay(date, tomorrow)) label = 'Tomorrow';
      else label = formatDate(date, 'd MMMM yyyy', 'en-US');

      if (!grouped[label]) grouped[label] = [];
      grouped[label].push(activity);
    });
    this.refreshCalendar.emit();
    this.groupedTasks = grouped;
  }

  private isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  getGroupKeys(): string[] {
    return Object.keys(this.groupedTasks);
  }

  onActivityUpdated(activityId: string): void {
    const changedActivity = this.activities.find((t) => t.id === activityId);
    if (!changedActivity) return;

    const matchesCategory =
      this.categoryId() === null ||
      changedActivity.categoryId === this.categoryId();
    const matchesDifficulty =
      this.difficultyId() === null ||
      changedActivity.difficultyId === this.difficultyId();
    const matchesDate =
      this.endDate() === null ||
      changedActivity.deadlineDate === this.endDate();

    let matchesAliveStatus = true;

    if (this.activityListType() === ActivityListView.Tasks) {
      const isActuallyAlive =
        changedActivity.status !== ActivityStatus.COMPLETED;
      matchesAliveStatus = isActuallyAlive === this.isAlive();
    } else if (this.activityListType() === ActivityListView.Habits) {
      matchesAliveStatus =
        (changedActivity.habitStatus === HabitStatus.ALIVE) === this.isAlive();
    } else if (this.activityListType() === ActivityListView.Activities) {
      if (this.isAlive()) {
        matchesAliveStatus =
          changedActivity.status !== ActivityStatus.COMPLETED;
      }
    }

    if (
      !matchesCategory ||
      !matchesDifficulty ||
      !matchesDate ||
      !matchesAliveStatus
    ) {
      this.activities = this.activities.filter((t) => t.id !== activityId);
    }
    this.calendarComponent?.loadActivities();
    this.groupActivitiesByDate();
  }

  onActivityEdit(event: {
    activity: ActivityItemDetails;
    viewMode: boolean;
  }): void {
    this.selectedActivity.set(event.activity);
    this.viewMode.set(event.viewMode);
    this.formType.set(event.activity.type);
    this.editionMode.set(true);
    this.creationMode.set(false);
  }

  onTaskCreation(): void {
    this.selectedActivity.set(undefined);
    this.viewMode.set(false);
    this.formType.set(ActivityType.TASK);
    this.creationMode.set(true);
    this.editionMode.set(false);
  }

  onHabitCreation(): void {
    this.selectedActivity.set(undefined);
    this.viewMode.set(false);
    this.formType.set(ActivityType.HABIT);
    this.creationMode.set(true);
    this.editionMode.set(false);
  }

  onTaskSubmit(): void {
    this.title.set(null);
    this.startDate.set(null);
    this.endDate.set(null);
    this.categoryId.set(null);
    this.difficultyId.set(null);
    this.currentPage = 0;
    this.load();
    this.editionMode.set(false);
    this.creationMode.set(false);
    this.selectedActivity.set(undefined);
    this.activityListType.set(ActivityListView.Activities);
  }

  onTaskDelete(): void {
    this.activities = this.activities.filter(
      (t) => t != this.selectedActivity(),
    );
    this.groupActivitiesByDate();
    this.editionMode.set(false);
    this.creationMode.set(false);
    this.selectedActivity.set(undefined);
  }
}
