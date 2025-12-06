

import {Component, inject, input, output} from '@angular/core';
import {EditGroupTaskDto, GroupTask} from '../../../../shared/models/group/group-task.model';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {GroupTaskApiService} from '../../../../shared/services/group-task-api/group-task-api.service';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzInputDirective} from 'ng-zorro-antd/input';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {CommonModule} from '@angular/common';
@Component({
  selector: 'app-group-task-form',
  templateUrl: './group-task-form.component.html',
  imports: [
    CommonModule,
    NzModalModule,
    ReactiveFormsModule,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzInputDirective,
    NzFormDirective,
    NzDatePickerComponent,
    NzSelectComponent,
    NzOptionComponent
  ],
  standalone: true
})

export class GroupTaskFormComponent{
  formSubmitted = output<void>();

  private fb = inject(NonNullableFormBuilder);
  private groupTaskApi = inject(GroupTaskApiService);

  task=input<GroupTask|null>(null);
  groupId=input.required<string>();
  isVisible = false;


//ToDo add hour selection
  protected validateForm = this.fb.group({
    title: this.fb.control<string>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(200),
    ]),
    description: this.fb.control<string>('', {
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    startTime: this.fb.control<Date | null>(null, [
      Validators.required,
      ]),
    endTime: this.fb.control<Date | null>(null, [
      Validators.required,
      ]),
    categoryId: this.fb.control<number>(1, [
      Validators.required,
    ]),
    difficultyId: this.fb.control<number>(1, [
      Validators.required,
    ]),
    reward:this.fb.control<number>(1,[
      Validators.required,
      Validators.min(1),
      Validators.max(9999)
    ])
  }

  );

  categories = [
    { categoryId: 1, categoryName: 'Work' },
    { categoryId: 2, categoryName: 'Personal' },
    { categoryId: 3, categoryName: 'Health' },
  ];

  difiiculties = [
    { difficultyId: 1, difficultyName: 'Easy' },
    { difficultyId: 2, difficultyName: 'Medium' },
    { difficultyId: 3, difficultyName: 'Hard' },
  ];

  openForm(): void {
    const task = this.task();
    if (task != null) {
      this.validateForm.patchValue({
        title: task.taskDto.title,
        description: task.taskDto!.description!,
        startTime: new Date(task.taskDto.startTime),
        endTime: new Date(task.taskDto.endTime),
        categoryId:   task.taskDto.category.id,
        difficultyId: task.taskDto.difficulty.id,
        reward: task.reward
      });
    }
    this.isVisible = true;
  }

  handleCreate(): void {
    if (this.validateForm.valid) {
      const formValue = this.validateForm.getRawValue();
      const request = {
        title: formValue.title,
        description: formValue.description,
        startTime: formValue.startTime,
        endTime: formValue.endTime,
        categoryId: formValue.categoryId,
        difficultyId: formValue.difficultyId,
        reward:formValue.reward
      };

      this.groupTaskApi.postGroupTask(this.groupId(), request).subscribe({
        next: () => { this.formSubmitted.emit();},
        error: (error) => {
          console.error('Error creating task:', error);
        },
      });
    }
  }

  handleSubmit(): void {
    if (this.task()==null) {
      this.handleCreate();
      this.isVisible = false;
      this.validateForm.reset();
    }
    else
    {
      this.handleEdit();
      this.isVisible = false;
      this.validateForm.reset();
    }

  }
  handleCancel(): void {
    this.isVisible=false;
    this.validateForm.reset();
  }

  getTitle():string{

    if (this.task()==null)
    {
      return "Create Task"
    }
    else
    {
      return "Edit Task"
    }
  }

  handleEdit(): void {
    if (this.validateForm.valid) {
      const formValue = this.validateForm.getRawValue();
      let editGroupTaskRequest: EditGroupTaskDto = {
        title: formValue.title,
        description: formValue.description,
        startTime: formValue.startTime!.toISOString(),
        endTime: formValue.endTime!.toISOString(),
        categoryId: formValue.categoryId!,
        difficultyId: formValue.difficultyId!,
        completedAt: null,
        isAccepted:null,
        reward:formValue.reward,
        declineMessage:null
      }

          this.groupTaskApi.editGroupTask(this.groupId(), this.task()!.groupTaskId, editGroupTaskRequest).subscribe({
            next: () => {
              this.formSubmitted.emit();
            },
            error: (error) => {
              console.error('Error editing group task:', error);
            },
          })
    }


  }
}
