import { Component, EventEmitter, Input, Output } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ActivityItemDetails } from '../../../../shared/models/task/activity.model';

@Component({
  selector: 'app-pomdoro-accept-task-modal',
  imports: [NzButtonModule, NzModalModule],
  standalone: true,
  template: `
    <nz-modal
      [(nzVisible)]="isVisible"
      nzTitle="Do You Wish To End This Task?"
      (nzOnCancel)="handleCancel()"
      (nzOnOk)="handleOk()"
    >
      <ng-container *nzModalContent> </ng-container>
    </nz-modal>
  `,
})
export class PomodoroSessionAcceptTaskModalComponent {
  @Input() activity!: ActivityItemDetails;
  @Output() removeFromPanel = new EventEmitter<ActivityItemDetails>();
  @Output() removeFromSession = new EventEmitter<ActivityItemDetails>();

  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.removeFromPanel.emit(this.activity);
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.removeFromSession.emit(this.activity);
  }
}
