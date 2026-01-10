import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import {
  ActivityItemDetails,
  ActivityTypeColors,
} from '../../../../shared/models/task-models/activity.model';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserActivitiesApiService } from '../../../../shared/services/tasks/user-activities-api.service';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-task-calendar',
  imports: [
    NzBadgeModule,
    NzCalendarModule,
    NzButtonComponent,
    NzIconDirective,
    DatePipe,
    FormsModule,
  ],
  templateUrl: './task-calendar.component.html',
  standalone: true,
  styleUrl: './task-calendar.component.css',
})
export class TaskCalendarComponent implements OnInit {
  activeViewDate: Date = new Date();
  taskCalendarList: ActivityItemDetails[] = [];
  deadlineSelected = output<string | null>();
  currentlySelectedDate = signal<Date | null>(null);
  private readonly activityService = inject(UserActivitiesApiService);
  private readonly notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);
  ngOnInit() {
    this.loadActivities();
  }

  loadActivities() {
    this.activityService
      .getAllActivities(
        0,
        null,
        null,
        this.getFirstDayOfMonth(this.activeViewDate).toISOString().slice(0, 10),
        this.getLastDayOfMonth(this.activeViewDate).toISOString().slice(0, 10),
        null,
        null,
        null,
        null,
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.taskCalendarList = response.content;
        },
        error: (err) => {
          this.notificationService.error(
            'Could not load activities into calendar',
          );
          console.error(err);
        },
      });
  }

  isSameDay(activityDeadline: string | Date, calendarDate: Date): boolean {
    const activityDate = new Date(activityDeadline);
    return (
      activityDate.getDate() === calendarDate.getDate() &&
      activityDate.getMonth() === calendarDate.getMonth() &&
      activityDate.getFullYear() === calendarDate.getFullYear()
    );
  }

  onDateSelect(calendarDate: Date) {
    if (
      calendarDate.toISOString() == this.currentlySelectedDate()?.toISOString()
    ) {
      this.deadlineSelected.emit(null);
      this.currentlySelectedDate.set(null);
    } else {
      this.currentlySelectedDate.set(calendarDate);
      this.deadlineSelected.emit(calendarDate.toISOString().slice(0, 10));
    }
  }

  changeMonth(direction: number) {
    const newDate = new Date(this.activeViewDate);
    newDate.setMonth(newDate.getMonth() + direction);
    this.activeViewDate = newDate;
    this.loadActivities();
  }

  getLastDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  getFirstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  protected readonly activityColors = ActivityTypeColors;
}
