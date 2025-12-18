import {Component, EventEmitter, inject, Output, signal,} from '@angular/core';

import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {PomodoroFormComponent} from '../pomodoro-form/pomodoro-form.component';
import {PomodoroTaskService} from '../../../../../shared/services/tasks/pomodoro-task.service';
import {CreatePomodoroRequest} from '../../../../../shared/models/task-models/create-pomodoro-request';
import {EditPomodoroRequest} from '../../../../../shared/models/task-models/edit-pomodoro-request';
import {ActivityItemDetails, ActivityType} from '../../../../../shared/models/task-models/activity.model';

@Component({
  selector: 'app-pomdoro-form-modal',
  imports: [NzButtonModule, NzModalModule, PomodoroFormComponent],
  standalone: true,
  template: `
    <nz-modal
      [(nzVisible)]="isVisible"
      nzTitle="{{ this.title }}"
      (nzOnCancel)="handleCancel()"
      (nzOnOk)="handleOk()"
    >
      <ng-container *nzModalContent>
        <app-pomodoro-form
          (formChanged)="onPomodoroFormChange($event)"
          (editFormChanged)="onPomodoroEditFormChange($event)"
          [pomodoroEdition]="editionMode"
          [pomodoroCreation]="creationMode"
          [activity]="activity"
        >
        </app-pomodoro-form>
      </ng-container>
    </nz-modal>
  `,
})
export class PomodoroSessionFormModal {
  activity!:ActivityItemDetails;
  @Output() moveToCurrentSession = new EventEmitter<ActivityItemDetails>();
  editionMode = signal<boolean>(false);
  creationMode = signal<boolean>(false);
  title = '';

  pomodoroService = inject(PomodoroTaskService);
  pomodoroRequest?: CreatePomodoroRequest;
  pomodoroEditRequest?: EditPomodoroRequest;
  isVisible = false;

  showModal(): void {
    if (this.activity.pomodoro?.id) {
      this.editionMode.set(true);
      this.creationMode.set(false);
      this.title = 'Edit Pomodoro Task';
    } else {
      this.creationMode.set(true);
      this.editionMode.set(false);
      this.title = 'Make Task Pomodoro';
    }

    this.isVisible = true;
  }

  handleOk(): void {
    if (this.creationMode() && this.pomodoroRequest) {
      if (this.activity.type==ActivityType.TASK)
      {
        this.pomodoroRequest.taskId=this.activity.id
        this.pomodoroRequest.habitId=undefined
      }
      else
      {
        this.pomodoroRequest.habitId=this.activity.id
        this.pomodoroRequest.taskId=undefined
      }
      this.pomodoroService
        .createPomodoro(this.pomodoroRequest)
        .subscribe({
          //ToDo Take care of Validation Errors
          next: (response) => {
            this.activity.pomodoro = {
              id: response.id,
              cyclesRequired: response.cyclesRequired,
              cyclesCompleted: response.cyclesCompleted,
            };

            this.moveToCurrentSession.emit(this.activity);
            this.isVisible = false;
          },
        });
    } else if (
      this.editionMode() &&
      this.pomodoroEditRequest != null &&
      this.activity.pomodoro?.id
    ) {
      this.pomodoroEditRequest.cyclesCompleted=this.activity.pomodoro.cyclesCompleted

      this.pomodoroService
        .editPomodoro(this.activity.pomodoro!.id, this.pomodoroEditRequest)
        .subscribe({
          next: (response) => {
            this.activity.pomodoro!.cyclesRequired = response.workCyclesNeeded;
            this.activity.pomodoro!.cyclesCompleted =
              response.workCyclesCompleted;
            this.moveToCurrentSession.emit(this.activity);
            this.isVisible = false;
          },
        });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  onPomodoroFormChange(pomodoroRequest: CreatePomodoroRequest) {
    this.pomodoroRequest = pomodoroRequest;
  }

  onPomodoroEditFormChange(pomodoroRequest: EditPomodoroRequest) {
    this.pomodoroEditRequest = pomodoroRequest;
  }
}
