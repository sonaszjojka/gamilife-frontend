import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';
import { IndividualTaskService, Page } from '../../service/individual-task.service';
import { Task } from '../../model/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    TaskItemComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;
  loadingMore = false;

  params: any = {
  categoryId: null,
    difficultyId: null,
    isCompleted: null,
    isGroupTask: null
  };

  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  hasMore = true;

  constructor(private taskService: IndividualTaskService) {}

  ngOnInit(): void {
    this.params.isCompleted = false;
    this.params.difficultyId="1";
    this.loadTasks();

  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const threshold = 200;
    const position = window.pageYOffset + window.innerHeight;
    const height = document.documentElement.scrollHeight;

    if (position > height - threshold && !this.loading && !this.loadingMore && this.hasMore) {
      this.loadMoreTasks();
    }
  }

  loadTasks(): void {
    this.loading = true;
    this.tasks = [];
    this.taskService.getUserTasks(this.currentPage, this.pageSize,this.params.categoryId,this.params.difficultyId,this.params.isCompleted,this.params.isGroupTask).subscribe({
      next: (response: Page<Task>) => {
        this.tasks = response.content;
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
    if (!this.hasMore || this.loadingMore) {
      return;
    }

    this.loadingMore = true;
    const nextPage = this.currentPage + 1;

    this.taskService.getUserTasks(nextPage, this.pageSize,this.params.categoryId,this.params.difficultyId,this.params.isCompleted,this.params.isGroupTask).subscribe({
      next: (response: Page<Task>) => {
        this.tasks = [...this.tasks, ...response.content];
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

  onTaskUpdated(): void {
    this.currentPage = 0;
    this.loadTasks();
  }

  onChangeFilters(newParams: any): void {
    this.params = newParams;
    this.loadTasks();
  }

  trackByTaskId(index: number, task: Task): string {
    return task.taskId;
  }
}
