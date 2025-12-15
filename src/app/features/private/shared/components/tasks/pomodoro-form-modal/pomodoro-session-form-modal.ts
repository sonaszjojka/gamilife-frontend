import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { PomodoroFormComponent } from '../pomodoro-form/pomodoro-form.component';
import { Task } from '../../../../../shared/models/task-models/task.model';
import { PomodoroTaskService } from '../../../../../shared/services/tasks/pomodoro-task.service';
import { CreatePomodoroRequest } from '../../../../../shared/models/task-models/create-pomodoro-request';
import { EditPomodoroRequest } from '../../../../../shared/models/task-models/edit-pomodoro-request';
import { NotificationService } from '../../../../../shared/services/notification-service/notification.service';

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
        >
        </app-pomodoro-form>
      </ng-container>
    </nz-modal>
  `,
})
export class PomodoroSessionFormModal {
  @Input() task!: Task;
  @Output() moveToCurrentSession = new EventEmitter<Task>();
  editionMode = signal<boolean>(false);
  creationMode = signal<boolean>(false);
  title = '';

  pomodoroService = inject(PomodoroTaskService);
  notificationService = inject(NotificationService);
  pomodoroRequest?: CreatePomodoroRequest;
  pomodoroEditRequest?: EditPomodoroRequest;
  isVisible = false;

  showModal(): void {
    if (this.task.pomodoro?.pomodoroId) {
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
      this.pomodoroService
        .createPomodoro(this.task.taskId, this.pomodoroRequest)
        .subscribe({
          next: (response) => {
            this.task.pomodoro = {
              pomodoroId: response.pomodoroId,
              workCyclesNeeded: response.workCyclesNeeded,
              workCyclesCompleted: response.workCyclesCompleted,
              createdAt: response.createdAt,
            };

            this.moveToCurrentSession.emit(this.task);
            this.notificationService.handleApiSuccess(
              'POST',
              'Pomodoro task created successfully',
            );
            this.isVisible = false;
          },
          error: (error) => {
            this.notificationService.handleApiError(error);
          },
        });
    } else if (
      this.editionMode() &&
      this.pomodoroEditRequest != null &&
      this.task.pomodoro?.pomodoroId
    ) {
      this.pomodoroService
        .editPomodoro(this.task.pomodoro.pomodoroId, this.pomodoroEditRequest)
        .subscribe({
          next: (response) => {
            this.task.pomodoro!.workCyclesNeeded = response.workCyclesNeeded;
            this.task.pomodoro!.workCyclesCompleted =
              response.workCyclesCompleted;
            this.moveToCurrentSession.emit(this.task);
            this.notificationService.handleApiSuccess(
              'PUT',
              'Pomodoro task updated successfully',
            );
            this.isVisible = false;
          },
          error: (error) => {
            this.notificationService.handleApiError(error);
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
