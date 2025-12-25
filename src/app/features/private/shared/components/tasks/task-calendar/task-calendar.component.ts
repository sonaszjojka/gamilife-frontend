import { Component, Input } from '@angular/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import {ActivityItemDetails} from '../../../../../shared/models/task-models/activity.model';

@Component({
  selector: 'app-task-calendar',
  imports: [
    NzBadgeModule,
    NzCalendarModule,
    NzButtonComponent,
    NzIconDirective,
  ],
  templateUrl: './task-calendar.component.html',
  standalone: true,
  styleUrl: './task-calendar.component.css',
})
export class TaskCalendarComponent {
  @Input() taskCalendarList: ActivityItemDetails[] = [];

  isSameDay(activityDeadline: string | Date, calendarDate: Date): boolean {
    const activityDate = new Date(activityDeadline);

    return (
      activityDate.getDate() === calendarDate.getDate() &&
      activityDate.getMonth() === calendarDate.getMonth() &&
      activityDate.getFullYear() === calendarDate.getFullYear()
    );
  }
}
