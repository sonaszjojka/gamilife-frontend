import { Component, Input } from '@angular/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { Task } from '../../../../../shared/models/task-models/task.model';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';

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
  @Input() taskCalendarList: Task[] = [];

  isSameDay(taskEndTime: string | Date, calendarDate: Date): boolean {
    const taskDate = new Date(taskEndTime);

    return (
      taskDate.getDate() === calendarDate.getDate() &&
      taskDate.getMonth() === calendarDate.getMonth() &&
      taskDate.getFullYear() === calendarDate.getFullYear()
    );
  }
}
