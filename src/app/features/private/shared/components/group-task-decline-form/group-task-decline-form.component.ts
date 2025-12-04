

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
  selector: 'app-group-task-decline-form',
  templateUrl: './group-task-decline-form.component.html',
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

export class GroupTaskDeclineFormComponent{
  formSubmitted = output<void>();

  private fb = inject(NonNullableFormBuilder);
  private groupTaskApi = inject(GroupTaskApiService);

  task=input.required<GroupTask>();
  groupId=input.required<string>();
  isVisible = false;

  protected validateForm = this.fb.group({
      declineMessage: this.fb.control<string>('', {
        validators: [Validators.required, Validators.maxLength(300)],
      }),

    }

  );


  openForm(): void {
    this.isVisible = true;
  }

  handleSubmit(): void {
      this.handleEdit();
      this.isVisible = false;
  }
  handleCancel(): void {
    this.isVisible=false;
    this.validateForm.reset();
  }


  handleEdit(): void {
    if (this.validateForm.valid) {
      const formValue = this.validateForm.getRawValue();

      let editGroupTaskRequest: EditGroupTaskDto = {
        title: this.task().taskDto.title,
        description: this.task().taskDto.description,
        startTime: this.task().taskDto.startTime,
        endTime: this.task().taskDto.endTime,
        categoryId: this.task().taskDto.category.id,
        difficultyId: this.task().taskDto.difficulty.id,
        completedAt: null,
        isAccepted:false,
        reward:this.task().reward,
        declineMessage:formValue.declineMessage
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
