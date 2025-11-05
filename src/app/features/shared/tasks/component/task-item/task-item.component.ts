
import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Task } from '../../model/task.model';
import {IndividualTaskService} from '../../service/individual-task.service';
import {NzFloatButtonComponent} from 'ng-zorro-antd/float-button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzCheckboxComponent} from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzFloatButtonComponent,
    FormsModule,
    NzCheckboxComponent,
    ReactiveFormsModule
  ],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() taskUpdated = new EventEmitter<void>();
  isCompleted: boolean = false;

  ngOnInit(): void {
    this.isCompleted= this.task.completedAt != null;
  }

  constructor(private taskService: IndividualTaskService,) {}


  completeTask(checked:boolean): void {
    this.isCompleted = checked;
    this.taskService.finishTask(this.task).subscribe({
      next: (response) => {
        this.task = response.task;
        this.taskUpdated.emit();
      },
      error: (error) => {
        console.error('Błąd:', error);
        this.isCompleted = !checked;
      }
    })
  }

}
