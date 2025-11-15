import {Component, inject, Input, OnInit, effect, WritableSignal, Output, EventEmitter} from '@angular/core';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzColDirective} from 'ng-zorro-antd/grid';
import {NzInputDirective} from 'ng-zorro-antd/input';
import {Task} from '../../model/task.model';
import {IndividualTaskService} from '../../service/individual-task.service';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {EditTaskRequest} from '../../model/edit-task-request';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzTimePickerComponent} from 'ng-zorro-antd/time-picker';
import {DatePipe} from '@angular/common';
import {NzIconDirective} from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-task-form',
  imports: [
    NzButtonComponent,
    ReactiveFormsModule,
    NzFormItemComponent,
    NzColDirective,
    NzFormControlComponent,
    NzFormLabelComponent,
    NzInputDirective,
    NzSelectComponent,
    NzOptionComponent,
    NzDatePickerComponent,
    NzTimePickerComponent,
    DatePipe,
    NzIconDirective
  ],
  templateUrl: './task-form.component.html',
  standalone: true,
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {

  @Input() task!: WritableSignal<Task | null>;
  @Input() creationMode?: WritableSignal<boolean|null>
  @Input() editionMode?: WritableSignal<boolean|null>;
  @Output() taskFormSubmitted = new EventEmitter<void>();
  @Output() taskDeleted=new EventEmitter<void>()


  private formBuilder = inject(NonNullableFormBuilder);
  private taskService = inject(IndividualTaskService)

  validTaskForm = this.formBuilder.group({
    title: this.formBuilder.control('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(300)
    ]),
    startTimeDate: this.formBuilder.control<Date|null>(null, [
      Validators.required
    ]),
    startTimeHour: this.formBuilder.control<Date|null>(null, [
      Validators.required
    ]),
    endTimeDate: this.formBuilder.control<Date|null>(null,[
      Validators.required
      ]),
    endTimeHour:this.formBuilder.control<Date|null>(null,[
      Validators.required
    ]),
    categoryId: this.formBuilder.control<number>(0, [
      Validators.required
    ]),
    difficultyId: this.formBuilder.control<number>(0, [
      Validators.required
    ]),
    completedAt: this.formBuilder.control(''),
    description: this.formBuilder.control('', [
      Validators.required
    ])
  });

  categories = [
    {categoryId: 1, categoryName: 'Work'},
    {categoryId: 2, categoryName: 'Personal'},
    {categoryId: 3, categoryName: 'Health'}
  ];

  difiiculties = [
    {difficultyId: 1, difficultyName: 'Easy'},
    {difficultyId: 2, difficultyName: 'Medium'},
    {difficultyId: 3, difficultyName: 'Hard'}
  ];

  constructor() {
    effect(() => {
      const task = this.task?.();
      const isEditing = this.editionMode?.();
      const isCreating = this.creationMode?.();

      if (task && isEditing) {
        const startDate = task.startTime ? new Date(task.startTime) : null;
        const endDate = task.endTime?new Date(task.endTime):null;
        this.validTaskForm.patchValue({
          title: task.title || '',
          startTimeDate: startDate,
          startTimeHour: startDate,
          endTimeDate: endDate,
          endTimeHour:endDate,
          categoryId: task.categoryId ,
          difficultyId: task.difficultyId ,
          completedAt: task.completedAt || '',
          description: task.description || ''
        });
      } else if (isCreating) {
        this.validTaskForm.reset();
      }
    });
  }

  onClose() {
    this.editionMode?.set(false);
    this.creationMode?.set(false);
    this.validTaskForm.reset();
  }

  onSubmit() {
    if (this.validTaskForm.invalid) {
      Object.values(this.validTaskForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    const formValue = this.validTaskForm.getRawValue();
    let mergedStartTime = '';
    const startTimeDate = formValue.startTimeDate;
    const startTimeHour = formValue.startTimeHour;

    startTimeDate!.setHours(startTimeHour!.getHours()+1,startTimeHour!.getMinutes(),startTimeHour!.getSeconds());
    mergedStartTime=startTimeDate!.toISOString();

    let mergedEndTime='';
    const endTimeDate = formValue.endTimeDate;
    const endTimeHour=formValue.endTimeHour;

    endTimeDate!.setHours(endTimeHour!.getHours()+1,endTimeHour!.getMinutes(),endTimeHour!.getSeconds())
    mergedEndTime=endTimeDate!.toISOString()


    const request: EditTaskRequest = {
      title: formValue.title,
      startTime: mergedStartTime,
      endTime: mergedEndTime,
      categoryId: formValue.categoryId,
      difficultyId: formValue.difficultyId,
      completedAt: formValue.completedAt,
      description: formValue.description
    }

    if (this.creationMode?.()) {
      this.taskService.createTask(request).subscribe({
        next: (response) => {
          this.validTaskForm.reset();
          this.taskFormSubmitted.emit();
        },
        error: (error) => {
          console.error('Error creating task:', error);
          this.taskFormSubmitted.emit();
        }
      });
    } else if (this.editionMode?.()) {
      const task = this.task?.();
      if (task == null) {
        return;
      }

      this.taskService.editTask(task.taskId, request).subscribe({
        next: (response) => {
          this.validTaskForm.reset();
          this.taskFormSubmitted.emit();
        },
        error: (error) => {
          console.error('Error editing task:', error);
          this.taskFormSubmitted.emit();
        }
      });
    }
  }

  onDelete() {
    const task = this.task?.();
    if (task == null) {
      return;
    }
    this.taskService.deleteTask(task.taskId).subscribe({
      next:()=>{
        this.validTaskForm.reset();
        this.taskDeleted.emit();
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.taskFormSubmitted.emit();
      }
    })

  }
}
