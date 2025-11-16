import { formatDate } from '@angular/common';
import { Component, OnInit, HostListener, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskFilterComponent } from '../task-filter/task-filter.component';
import {
  IndividualTaskService,
  Page,
} from '../../service/individual-task.service';

import { Task } from '../../model/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';
import { NzButtonComponent } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    TaskItemComponent,
    TaskFilterComponent,
    TaskFormComponent,
    NzButtonComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  tasks: Task[] = [];
  groupedTasks: { [date: string]: Task[] } = {};

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
  constructor(private taskService: IndividualTaskService) {}

  @HostListener('window:scroll', ['$event'])
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
        },
      });
  }

  private groupTasksByDate(): void {
    const grouped: { [key: string]: Task[] } = {};
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
    const isTaskNoneActive: Boolean =
      changedTask.completedAt != null ||
      new Date(changedTask.endTime!) < new Date(Date.now());

    if (
      changedTask.categoryId != this.categoryId() ||
      changedTask.difficultyId != this.difficultyId() ||
      changedTask.isGroupTask != this.isGroupTask() ||
      isTaskNoneActive != this.isCompleted() //rename filter param
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
