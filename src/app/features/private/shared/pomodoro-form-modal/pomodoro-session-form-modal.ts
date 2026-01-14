import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Output,
  signal,
} from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { PomodoroFormComponent } from '../pomodoro-form/pomodoro-form.component';
import { UserPomodoroApiService } from '../../../shared/services/tasks/user-pomodoro-api.service';
import { PomodoroRequest } from '../../../shared/models/task/pomodoro-request';
import {
  ActivityItemDetails,
  ActivityType,
} from '../../../shared/models/task/activity.model';
import { NotificationService } from '../../../shared/services/notification-service/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  activity!: ActivityItemDetails;
  @Output() moveToCurrentSession = new EventEmitter<ActivityItemDetails>();
  editionMode = signal<boolean>(false);
  creationMode = signal<boolean>(false);
  title = '';

  private pomodoroApi = inject(UserPomodoroApiService);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);
  pomodoroRequest?: PomodoroRequest;
  isVisible = false;

  showModal(): void {
    if (this.activity.pomodoro?.id) {
      this.editionMode.set(true);
      this.creationMode.set(false);
      console.log(this.activity);
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
      if (this.activity.type == ActivityType.TASK) {
        this.pomodoroRequest.taskId = this.activity.id;
        this.pomodoroRequest.habitId = undefined;
      } else {
        this.pomodoroRequest.habitId = this.activity.id;
        this.pomodoroRequest.taskId = undefined;
      }
      this.pomodoroApi
        .createPomodoro(this.pomodoroRequest)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            this.activity.pomodoro = {
              id: response.id,
              cyclesRequired: response.cyclesRequired,
              cyclesCompleted: response.cyclesCompleted,
            };

            this.moveToCurrentSession.emit(this.activity);
            this.isVisible = false;
            this.notificationService.success(
              `Pomodoro created successfully for: ${this.activity.title}`,
            );
          },
          error: () => {
            this.notificationService.error(
              `There was an error creating Pomodoro for: ${this.activity.title}`,
            );
          },
        });
    } else if (
      this.editionMode() &&
      this.pomodoroRequest != null &&
      this.activity.pomodoro?.id
    ) {
      this.pomodoroApi
        .editPomodoro(this.activity.pomodoro!.id, this.pomodoroRequest)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            this.activity.pomodoro!.cyclesRequired = response.cyclesRequired;
            this.activity.pomodoro!.cyclesCompleted = response.cyclesCompleted;
            this.moveToCurrentSession.emit(this.activity);
            this.isVisible = false;
            this.notificationService.success(
              `Pomodoro updated successfully for: ${this.activity.title}`,
            );
          },
          error: () => {
            this.notificationService.error(
              `There was an error updating Pomodoro for: ${this.activity.title}`,
            );
          },
        });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  onPomodoroFormChange(pomodoroRequest: PomodoroRequest) {
    this.pomodoroRequest = pomodoroRequest;
  }
}
