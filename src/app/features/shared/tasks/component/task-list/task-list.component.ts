// components/task-list/task-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';
import { IndividualTaskService } from '../../service/individual-task.service';
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

  constructor(private taskService: IndividualTaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;

    this.taskService.getUserTasks().subscribe({
      next: (response) => {
        this.tasks = response.tasks;
        this.loading = false;
      },
      error: (error) => {
        console.error('Błąd:', error);
        this.loading = false;
      }
    });
  }
}
