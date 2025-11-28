import { Component, Input } from '@angular/core';

import { NzProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: 'app-pomodoro-task-progress',
  imports: [NzProgressModule],
  template: `
    <nz-progress
      [nzPercent]="percentage"
      nzType="circle"
      [nzWidth]="50"
    ></nz-progress>
  `,
  standalone: true,
  styles: [
    `
      nz-progress {
        margin-right: 8px;
        margin-bottom: 8px;
        display: inline-block;
      }
    `,
  ],
})
export class PomodoroTaskProgressComponent {
  @Input() workCyclesNeeded?: number | null;
  @Input() workCyclesCompleted?: number | null;

  get percentage(): number {
    if (!this.workCyclesNeeded || !this.workCyclesCompleted) {
      return 0;
    }
    const percentageRaw =
      (this.workCyclesCompleted / this.workCyclesNeeded) * 100;
    return Math.round(percentageRaw);
  }
}
