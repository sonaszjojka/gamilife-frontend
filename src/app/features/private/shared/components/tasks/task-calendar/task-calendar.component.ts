import {Component, inject, input, Input, OnInit, output, signal} from '@angular/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import {ActivityItemDetails, ActivityTypeColors} from '../../../../../shared/models/task-models/activity.model';
import {UserTaskApiService} from '../../../../../shared/services/tasks/user-task-api.service';
import {DatePipe, NgStyle} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-task-calendar',
  imports: [
    NzBadgeModule,
    NzCalendarModule,
    NzButtonComponent,
    NzIconDirective,
    DatePipe,
    FormsModule,
    NgStyle
  ],
  templateUrl: './task-calendar.component.html',
  standalone: true,
  styleUrl: './task-calendar.component.css',
})
export class TaskCalendarComponent implements OnInit{
  activeViewDate: Date = new Date();
 taskCalendarList:ActivityItemDetails[]=[] ;
 deadlineSelected= output<string|null>();
 currentlySelectedDate=signal<Date|null>(null);
 private taskService = inject(UserTaskApiService)

ngOnInit() {

   this.taskService.getAllActivities(0,1000,null, null,null,null,null).subscribe({
     next:(response)=> {this.taskCalendarList=response.content},
     error:(err)=>console.error(err)
     }
   )
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
   if (calendarDate.toISOString()==this.currentlySelectedDate()?.toISOString())
   {
     this.deadlineSelected.emit(null)
     this.currentlySelectedDate.set(null)
   }
   else {
     this.currentlySelectedDate.set(calendarDate)
     this.deadlineSelected.emit(calendarDate.toISOString().slice(0, 10))
   }

  }

  changeMonth(direction: number) {
    const newDate = new Date(this.activeViewDate);
    newDate.setMonth(newDate.getMonth() + direction);
    this.activeViewDate = newDate;
  }

  protected readonly activityColors = ActivityTypeColors;
}
