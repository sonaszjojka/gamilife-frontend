import {Component, EventEmitter, Input, Output, OnInit, signal, input, inject} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Task } from '../../../../../shared/models/task-models/task.model';
import { IndividualTaskService } from '../../../../../shared/services/tasks/individual-task.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {EditTaskRequest} from '../../../../../shared/models/task-models/edit-task-request';
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
  isCompleted = signal(false);

  @Output() taskUpdated = new EventEmitter<string>();
  @Output() editTask = new EventEmitter<Task>();

  isInSession=input<boolean>(false);
  inPomodoroList = input<boolean>(false)
  @Output() moveToCurrentSession = new EventEmitter<Task>();
  @Output() removeFromCurrentSession = new EventEmitter<Task>();

  taskService = inject(IndividualTaskService)

  ngOnInit(): void {
    this.isCompleted.set(this.task.completedAt != null);

  }

  completeTask(): void  {
    if (this.task.taskHabit==null)
    {
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
    else {
      //this.task.endTime=this.task.endTime + this.task.habit.duration;
      // const request:EditTaskRequest ={
      //       title: this.task.title,
      //       startTime:this.task.startTime,
      //       endTime:this.task.endTime,
      //       categoryId:this.task.categoryId,
      //       difficultyId:this.task.difficultyId,
      //       completedAt: this.task.completedAt,
      //       description: this.task.description
      //     }
      //this.taskService.editTask(this.task.taskId,request).subscribe({});
      //

    }
  }

  onTaskEdit()
  {
    this.editTask.emit(this.task)
  }



  isInactive(): boolean {
    return !!this.task.completedAt ||  new Date(this.task.endTime!) < new Date(Date.now());
  }

  addTaskToPomodoroSession() {
    this.moveToCurrentSession.emit(this.task)
  }

  removeTaskFromPomodoroSession()
  {
    this.removeFromCurrentSession.emit(this.task)

  }
}
