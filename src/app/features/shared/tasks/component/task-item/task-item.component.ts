import {Component, EventEmitter, Input, Output, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Task } from '../../model/task.model';
import { IndividualTaskService } from '../../service/individual-task.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import {getTimeConfig} from 'ng-zorro-antd/date-picker';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {EditTaskRequest} from '../../model/edit-task-request';
import {PomodoroTaskProgressComponent} from '../pomodoro-task-progress/pomodoro-task-progress.component';

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
    PomodoroTaskProgressComponent
  ],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent implements OnInit {
  @Input() task!: Task;
  @Output() taskUpdated = new EventEmitter<string>();
  @Output() editTask = new EventEmitter<Task>();
  isCompleted = signal(false);

  constructor(private taskService: IndividualTaskService) {}

  ngOnInit(): void {
    this.isCompleted.set(this.task.completedAt != null);
  }

  completeTask(): void  {
    this.isCompleted.set(true)
    const request:EditTaskRequest ={
      title: this.task.title,
      startTime:this.task.startTime,
      endTime:this.task.endTime,
      categoryId:this.task.categoryId,
      difficultyId:this.task.difficultyId,
      completedAt: new Date(Date.now()).toISOString(),
      description: this.task.description
    }
    this.taskService.editTask(this.task.taskId,request).subscribe({
      next: (response) => {
        this.task.completedAt = response.completedAt;
        this.taskUpdated.emit(this.task.taskId);
      },
      error: (error) => {
        console.error('Error:', error);
        this.isCompleted.set(false)
      }
    });
  }

  onTaskEdit()
  {
    this.editTask.emit(this.task)
  }

  isInactive(): boolean {
    return !!this.task.completedAt ||  new Date(this.task.endTime!) < new Date(Date.now());
  }
}
