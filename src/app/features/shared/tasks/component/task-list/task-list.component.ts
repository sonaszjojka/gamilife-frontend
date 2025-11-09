import { formatDate } from '@angular/common';
import {Component, OnInit, HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskFilterComponent } from '../task-filter/task-filter.component';
import { IndividualTaskService, Page } from '../../service/individual-task.service';
import { Task } from '../../model/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent, TaskFilterComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',

})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  groupedTasks: { [date: string]: Task[] } = {};

  loading = false;
  loadingMore = false;

  params: any = {
    categoryId: null,
    difficultyId: null,
    isCompleted: null,
    isGroupTask: null
  };

  currentPage = 0;
  pageSize = 4;
  totalPages = 0;
  hasMore = true;

  constructor(private taskService: IndividualTaskService) {}

  ngOnInit(): void {
    this.params.isCompleted = false;
    this.loadTasks();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const threshold = 200;
    const position = window.scrollY + window.innerHeight;
    const height = document.documentElement.scrollHeight;

    if (position > height - threshold && !this.loading && !this.loadingMore && this.hasMore) {
      this.loadMoreTasks();
    }
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getUserTasks(
      this.currentPage,
      this.pageSize,
      this.params.categoryId,
      this.params.difficultyId,
      this.params.isCompleted,
      this.params.isGroupTask
    ).subscribe({
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
      }
    });
  }

  loadMoreTasks(): void {
    if (!this.hasMore || this.loadingMore) return;

    this.loadingMore = true;
    const nextPage = this.currentPage + 1;

    this.taskService.getUserTasks(
      nextPage,
      this.pageSize,
      this.params.categoryId,
      this.params.difficultyId,
      this.params.isCompleted,
      this.params.isGroupTask
    ).subscribe({
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
      }
    });
  }

  private groupTasksByDate(): void {
    const grouped: { [key: string]: Task[] } = {};
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    this.tasks.forEach(task => {
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
    return a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  getGroupKeys(): string[] {
    return Object.keys(this.groupedTasks);
  }

  onTaskFinished(taskId:string): void {
    this.tasks = this.tasks.filter(t=>t.taskId!=taskId)
    this.groupTasksByDate()
  }

}
