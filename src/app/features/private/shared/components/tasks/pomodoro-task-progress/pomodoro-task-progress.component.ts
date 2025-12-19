import {Component, input, Input} from '@angular/core';

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
  cyclesRequired = input<number>(1)
  cyclesCompleted= input<number>(0)
  get percentage(): number {
    if (!this.cyclesRequired || !this.cyclesCompleted) {
      return 0;
    }
    const percentageRaw =
      (this.cyclesCompleted() / this.cyclesRequired()) * 100;
    return Math.round(percentageRaw);
  }
}
