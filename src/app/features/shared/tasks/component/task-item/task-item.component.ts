import {Component, EventEmitter, Input, Output, OnInit, signal} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Task } from '../../model/task.model';
import { IndividualTaskService } from '../../service/individual-task.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import {getTimeConfig} from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    FormsModule,
    NzCheckboxComponent,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent implements OnInit {
  @Input() task!: Task;
  @Output() taskFinished = new EventEmitter<string>();
  isCompleted = signal(false);

  constructor(private taskService: IndividualTaskService) {}

  ngOnInit(): void {
    this.isCompleted.set(this.task.completedAt != null);
  }

  completeTask(checked: boolean): void  {
    this.isCompleted.set(checked)
    this.taskService.finishTask(this.task).subscribe({
      next: (response) => {
        this.task.completedAt = response.completedAt;
        this.taskFinished.emit(this.task.taskId);
      },
      error: (error) => {
        console.error('Error:', error);
        this.isCompleted.set(!checked)
      }
    }
    );
  }

  isExpired(): boolean {
    return !!this.task.completedAt ||  new Date(this.task.endTime!) < new Date(Date.now());
  }
}
