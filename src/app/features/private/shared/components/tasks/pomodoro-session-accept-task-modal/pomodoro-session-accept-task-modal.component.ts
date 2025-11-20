import {Component, EventEmitter, Input, Output} from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import {PomodoroFormComponent} from '../pomodoro-form/pomodoro-form.component';
import { Task } from '../../../../../shared/models/task-models/task.model';


@Component({
  selector: 'app-pomdoro-accept-task-modal',
  imports: [NzButtonModule, NzModalModule, PomodoroFormComponent],
  standalone: true,
  template: `

    <nz-modal [(nzVisible)]="isVisible" nzTitle="Do You Wish To End This Task?" (nzOnCancel)="handleCancel()" (nzOnOk)="handleOk()">
      <ng-container *nzModalContent>

      </ng-container>
    </nz-modal>
  `
})
export class PomodoroSessionAcceptTaskModalComponent {
  @Input() task!:Task
  @Output() removeFromPanel= new EventEmitter<Task>;
  @Output() removeFromSession= new EventEmitter<Task>;
  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {

    this.removeFromPanel.emit(this.task);
    this.isVisible=false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.removeFromSession.emit(this.task);
  }

}
