import { formatDate } from '@angular/common';
import { Component, HostListener, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from '../../shared/components/tasks/task-item/task-item.component';
import { TaskFilterComponent } from '../../shared/components/tasks/task-filter/task-filter.component';
import {
  IndividualTaskService,
  Page,
} from '../../../shared/services/tasks/individual-task.service';

import { Task } from '../../../shared/models/task-models/task.model';
import { TaskFormComponent } from '../../shared/components/tasks/task-form/task-form.component';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { TaskCalendarComponent } from '../../shared/components/tasks/task-calendar/task-calendar.component';
import { NotificationService } from '../../../shared/services/notification-service/notification.service';

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
export class TaskListComponent {
  tasks: Task[] = [];
  groupedTasks: Record<string, Task[]> = {};

  loading = false;
  loadingMore = false;
  editionMode = signal<boolean | null>(false);
  creationMode = signal<boolean | null>(false);
  categoryId = signal<number | null>(null);
  difficultyId = signal<number | null>(null);
  isCompleted = signal<boolean | null>(false);
  isGroupTask = signal<boolean | null>(null);
  selectedTask = signal<Task | null>(null);

  currentPage = 0;
  pageSize = 4;
  totalPages = 0;
  hasMore = true;

  private changeFilterEffect = effect(() => {
    this.categoryId();
    this.difficultyId();
    this.isCompleted();
    this.isGroupTask();

    this.currentPage = 0;
    this.loadTasks();
  });
  private taskService = inject(IndividualTaskService);
  private notificationService = inject(NotificationService);

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
      .getUserTasks(
        this.currentPage,
        this.pageSize,
        this.categoryId(),
        this.difficultyId(),
        this.isCompleted(),
        this.isGroupTask(),
      )
      .subscribe({
        next: (response: Page<Task>) => {
          this.tasks = response.content;
          this.groupTasksByDate();
          this.totalPages = response.totalPages;
          this.currentPage = response.number;
          this.hasMore = !response.last;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading tasks:', error);
          this.loading = false;
          this.notificationService.handleApiError(
            error,
            'Failed to load tasks',
          );
        },
      });
  }

  loadMoreTasks(): void {
    if (!this.hasMore || this.loadingMore) return;

    this.loadingMore = true;
    const nextPage = this.currentPage + 1;

    this.taskService
      .getUserTasks(
        nextPage,
        this.pageSize,
        this.categoryId(),
        this.difficultyId(),
        this.isCompleted(),
        this.isGroupTask(),
      )
      .subscribe({
        next: (response: Page<Task>) => {
          this.tasks = [...this.tasks, ...response.content];
          this.groupTasksByDate();
          this.currentPage = response.number;
          this.hasMore = !response.last;
          this.loadingMore = false;
        },
        error: (error) => {
          console.error('Error loading more tasks:', error);
          this.loadingMore = false;
          this.notificationService.handleApiError(
            error,
            'Failed to load more tasks',
          );
        },
      });
  }

  private groupTasksByDate(): void {
    const grouped: Record<string, Task[]> = {};
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    this.tasks.forEach((task) => {
      const date = task.endTime ? new Date(task.endTime) : null;
      if (!date) return;

      let label: string;
      if (this.isSameDay(date, today)) label = 'Today';
      else if (this.isSameDay(date, tomorrow)) label = 'Tomorrow';
      else label = formatDate(date, 'd MMMM yyyy', 'en-US');

      if (!grouped[label]) grouped[label] = [];
      grouped[label].push(task);
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

  onTaskUpdated(taskId: string): void {
    const changedTask = this.tasks.find((t) => t.taskId == taskId)!;
    const isTaskNoneActive: boolean =
      changedTask.completedAt != null ||
      new Date(changedTask.endTime!) < new Date(Date.now());

    if (
      (changedTask.categoryId != this.categoryId() &&
        this.categoryId() != null) ||
      (changedTask.difficultyId != this.difficultyId() &&
        this.difficultyId() != null) ||
      (changedTask.isGroupTask != this.isGroupTask() &&
        this.isGroupTask() != null) ||
      (isTaskNoneActive != this.isCompleted() && this.isCompleted() != null)
    ) {
      this.tasks = this.tasks.filter((t) => t.taskId != taskId);
      this.groupTasksByDate();
    }
  }

  onTaskEdit(selectedTask: Task): void {
    this.selectedTask.set(selectedTask);
    this.editionMode.set(true);
    this.creationMode.set(false);
  }

  onTaskCreation(): void {
    this.selectedTask.set(null);
    this.creationMode.set(true);
    this.editionMode.set(false);
  }

  onTaskSubmit(): void {
    this.isCompleted.set(false);
    this.isGroupTask.set(null);
    this.categoryId.set(null);
    this.difficultyId.set(null);
    this.currentPage = 0;
    this.loadTasks();
    this.editionMode.set(false);
    this.creationMode.set(false);
    this.selectedTask.set(null);
  }
  onTaskDelete(): void {
    this.tasks = this.tasks.filter((t) => t != this.selectedTask());
    this.groupTasksByDate();
    this.editionMode.set(false);
    this.creationMode.set(false);
    this.selectedTask.set(null);
  }
}
