import {CommonModule, formatDate} from '@angular/common';
import {Component, HostListener, inject, OnInit, signal} from '@angular/core';
import {TaskItemComponent} from '../../shared/components/tasks/task-item/task-item.component';
import {TaskFilterComponent} from '../../shared/components/tasks/task-filter/task-filter.component';
import {TaskFormComponent} from '../../shared/components/tasks/task-form/task-form.component';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {TaskCalendarComponent} from '../../shared/components/tasks/task-calendar/task-calendar.component';
import {IndividualTaskService} from '../../../shared/services/tasks/individual-task.service';
import {Page} from '../../../shared/models/util/page.model';
import {ActivityItemDetails, ActivityStatus, ActivityType} from '../../../shared/models/task-models/activity.model';

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
export class TaskListComponent implements  OnInit{
  activities: ActivityItemDetails[] = [];
  groupedTasks: Record<string, ActivityItemDetails[]> = {};

  loading = false;
  loadingMore = false;
  editionMode = signal<boolean | null>(false);
  creationMode = signal<boolean | null>(false);
  viewMode = signal<boolean>(true)
  title= signal<string|null>(null);
  startDate=signal<string|null>(null)
  endDate=signal<string|null>(null)
  categoryId = signal<number | null>(null);
  difficultyId = signal<number | null>(null);
  selectedActivity= signal<ActivityItemDetails | undefined>(undefined);
  formType= signal<ActivityType>(ActivityType.TASK)

  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  hasMore = true;


  private taskService = inject(IndividualTaskService);
   ngOnInit () {
    this.title();
    this.startDate();
    this.endDate();
    this.categoryId();
    this.difficultyId();

    this.currentPage = 0;
    this.loadTasks();
  };

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

  loadTasks(): void {
    this.loading = true;
    this.taskService
      .getAllActivities(
        this.currentPage,
        this.pageSize,
        this.title(),
        this.startDate(),
        this.endDate(),
        this.categoryId(),
        this.difficultyId(),
      )
      .subscribe({
        next: (response: Page<ActivityItemDetails>) => {
          this.activities = response.content;
          this.groupTasksByDate();
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
      .getAllActivities(
        nextPage,
        this.pageSize,
        this.title(),
        this.startDate(),
        this.endDate(),
        this.categoryId(),
        this.difficultyId(),
      )
      .subscribe({
        next: (response: Page<ActivityItemDetails>) => {
          this.activities = [...this.activities, ...response.content];
          this.groupTasksByDate();
          this.currentPage = response.number;
          this.hasMore = !response.last;
          this.loadingMore = false;
        },
        error: (error) => {
          console.error('Error loading more tasks:', error);
          this.loadingMore = false;
        },
      });
  }

  private groupTasksByDate(): void {
    const grouped: Record<string, ActivityItemDetails[]> = {};
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    this.activities.forEach((activity) => {
      const date = activity.deadlineDate ? new Date(activity.deadlineDate) : null;
      if (!date) return;

      let label: string;
      if (this.isSameDay(date, today)) label = 'Today';
      else if (this.isSameDay(date, tomorrow)) label = 'Tomorrow';
      else label = formatDate(date, 'd MMMM yyyy', 'en-US');

      if (!grouped[label]) grouped[label] = [];
      grouped[label].push(activity);
    });

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


  onTaskUpdated(activityId: string): void {
    const changedActivity = this.activities.find((t) => t.id == activityId)!;
    const isTaskNoneActive: boolean = (changedActivity.status != ActivityStatus.DEADLINE_MISSED)|| changedActivity.completedAt!=null
    if (
      (changedActivity.categoryId != this.categoryId() &&
        this.categoryId() != null) ||
      (changedActivity.difficultyId != this.difficultyId() &&
        this.difficultyId() != null)
    ) {
      this.activities = this.activities.filter((t) => t.id != activityId);
      this.groupTasksByDate();
    }
  }

  onActivityEdit(event: { activity: ActivityItemDetails, viewMode: boolean }): void {
    this.selectedActivity.set(event.activity);
    this.viewMode.set(event.viewMode)
    this.formType.set(event.activity.type)
    this.editionMode.set(true);
    this.creationMode.set(false);
  }

  onTaskCreation(): void {
    this.selectedActivity.set(undefined);
    this.formType.set(ActivityType.TASK)
    this.creationMode.set(true);
    this.editionMode.set(false);
  }

  onHabitCreation(): void {
    this.selectedActivity.set(undefined);
    this.formType.set(ActivityType.HABIT)
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
    this.loadTasks();
    this.editionMode.set(false);
    this.creationMode.set(false);
    this.selectedActivity.set(undefined);
  }

  onTaskDelete(): void {
    /*
   this.activities = this.activities.filter((t) => t != this.selectedActivity());
   this.groupTasksByDate();
   this.editionMode.set(false);
   this.creationMode.set(false);
   this.selectedActivity.emit(null);

     */
 }


}
