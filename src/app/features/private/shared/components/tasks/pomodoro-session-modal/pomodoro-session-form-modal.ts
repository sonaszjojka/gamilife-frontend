import {Component, EventEmitter, inject, Input, Output, signal,} from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import {PomodoroFormComponent} from '../pomodoro-form/pomodoro-form.component';
import { Task } from '../../../../../shared/models/task-models/task.model';
import {PomodoroTaskService} from '../../../../../shared/services/tasks/pomodoro-task.service';
import {CreatePomodoroRequest} from '../../../../../shared/models/task-models/create-pomodoro-request';
import {EditPomodoroRequest} from '../../../../../shared/models/task-models/edit-pomodoro-request';

@Component({
  selector: 'app-pomdoro-form-modal',
  imports: [NzButtonModule, NzModalModule, PomodoroFormComponent],
  standalone: true,
  template: `

    <nz-modal [(nzVisible)]="isVisible" nzTitle="{{this.title}}}" (nzOnCancel)="handleCancel()" (nzOnOk)="handleOk()">
      <ng-container *nzModalContent>

        <app-pomodoro-form
          (formChanged)="onPomodoroFormChange($event)"
          (editFormChanged)="onPomodoroEditFormChange($event)"
          [pomodoroEdition]="editionMode"
          [pomodoroCreation]="creationMode"
        >

        </app-pomodoro-form>
      </ng-container>
    </nz-modal>
  `
})
export class PomodoroSessionFormModal {
  @Input() task!:Task
  @Output() moveToCurrentSession = new EventEmitter<Task>();
  editionMode=signal<boolean>(false)
  creationMode=signal<boolean>(false)
  title:string='';

  pomodoroService = inject(PomodoroTaskService)
  pomodoroRequest?:CreatePomodoroRequest;
  pomodoroEditRequest?:EditPomodoroRequest;
  isVisible = false;

  showModal(): void {
    if (this.task.pomodoroId) {
      this.editionMode.set(true);
      this.creationMode.set(false);
    } else {
      this.creationMode.set(true);
      this.editionMode.set(false);
    }

    this.isVisible = true;
  }

  handleOk(): void {

    if (this.pomodoroRequest!=null) {
      this.pomodoroService.createPomodoro(this.task.taskId, this.pomodoroRequest).subscribe({

//ToDo Take care of Validation Errors
        next: (response) => {

          this.task.pomodoroId = response.pomodoroId
          this.task.workCyclesNeeded = response.workCyclesNeeded
          this.task.workCyclesCompleted = response.workCyclesCompleted

          this.moveToCurrentSession.emit(this.task)
          this.isVisible = false;

        }
      })
    }
    else if (this.pomodoroEditRequest!=null)
    {
      this.pomodoroService.editPomodoro(this.task.pomodoroId!,this.pomodoroEditRequest).subscribe({

        next: (response) => {
          this.task.workCyclesNeeded = response.workCyclesNeeded
          this.task.workCyclesCompleted = response.workCyclesCompleted

          this.moveToCurrentSession.emit(this.task)
          this.isVisible = false;

        }

      })
    }

  }

  handleCancel(): void {
    this.isVisible = false;
  }

  onPomodoroFormChange(pomodoroRequest:CreatePomodoroRequest)
  {
    this.pomodoroRequest=pomodoroRequest
  }

  onPomodoroEditFormChange(pomodoroRequest:EditPomodoroRequest)
  {
    this.pomodoroEditRequest=pomodoroRequest
  }
}
