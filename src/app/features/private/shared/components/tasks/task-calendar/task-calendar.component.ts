import {Component, inject, input, Input, OnInit, output, signal} from '@angular/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import {ActivityItemDetails} from '../../../../../shared/models/task-models/activity.model';
import {IndividualTaskService} from '../../../../../shared/services/tasks/individual-task.service';

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
export class TaskCalendarComponent implements OnInit{
 taskCalendarList:ActivityItemDetails[]=[] ;
 deadlineSelected= output<string|null>();
 currentlySelectedDate=signal<Date|null>(null);
 private taskService = inject(IndividualTaskService)

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


  onDateSelect($event: Date) {
   if ($event.toISOString()==this.currentlySelectedDate()?.toISOString())
   {
     this.deadlineSelected.emit(null)
     this.currentlySelectedDate.set(null)
   }
   else {
     this.currentlySelectedDate.set($event)
     this.deadlineSelected.emit($event.toISOString().slice(0, 10))
   }

  }
}
