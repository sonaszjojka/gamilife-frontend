import {Component, EventEmitter, inject, Input, Output} from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import {PomodoroFormComponent} from '../pomodoro-form/pomodoro-form.component';
import { Task } from '../../../../../shared/models/task-models/task.model';
import {PomodoroTaskService} from '../../../../../shared/services/tasks/pomodoro-task.service';
import {CreatePomodoroRequest} from '../../../../../shared/models/task-models/create-pomodoro-request';

@Component({
  selector: 'app-pomdoro-modal',
  imports: [NzButtonModule, NzModalModule, PomodoroFormComponent],
  standalone: true,
  template: `

    <nz-modal [(nzVisible)]="isVisible" nzTitle="Make Task Pomodoro" (nzOnCancel)="handleCancel()" (nzOnOk)="handleOk()">
      <ng-container *nzModalContent>

        <app-pomodoro-form
          (formChanged)="onPomodoroFormChange($event)"
        >

        </app-pomodoro-form>
      </ng-container>
    </nz-modal>
  `
})
export class PomodoroSessionModal {
  @Input() task!:Task
  @Output() moveToCurrentSession = new EventEmitter<Task>();
  pomodoroService = inject(PomodoroTaskService)
  pomodoroRequest?:CreatePomodoroRequest;
  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    if (this.pomodoroRequest) {
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

  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  onPomodoroFormChange(pomodoroRequest:CreatePomodoroRequest)
  {
    this.pomodoroRequest=pomodoroRequest
  }
}
