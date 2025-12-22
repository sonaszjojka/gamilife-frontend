import {Component, EventEmitter, inject, input, Input, OnInit, Output, signal,} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {NzCardModule} from 'ng-zorro-antd/card';
import {IndividualTaskService} from '../../../../../shared/services/tasks/individual-task.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {TaskRequest} from '../../../../../shared/models/task-models/task-request';
import {PomodoroTaskProgressComponent} from '../pomodoro-task-progress/pomodoro-task-progress.component';
import {HabitTaskService} from '../../../../../shared/services/tasks/habit-api.service';
import {
  ActivityItemDetails,
  ActivityStatus,
  ActivityType
} from '../../../../../shared/models/task-models/activity.model';
import {GroupTaskDeclineFormComponent} from "../../group-task-decline-form/group-task-decline-form.component";
import {GroupTaskFormComponent} from "../../group-task-from/group-task-form.component";
import {GroupTaskMembersManagerComponent} from "../../group-task-member-manager/group-task-members-manager.component";
import {HabitRequest} from '../../../../../shared/models/task-models/habit-request.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
    imports: [
        CommonModule,
        NzCardModule,
        FormsModule,
        ReactiveFormsModule,
        DatePipe,
        NzIconDirective,
        NzButtonComponent,
        PomodoroTaskProgressComponent,
        GroupTaskDeclineFormComponent,
        GroupTaskFormComponent,
        GroupTaskMembersManagerComponent,
    ],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css',
})
export class TaskItemComponent implements OnInit {
  @Input() activity!: ActivityItemDetails;
  isCompleted = signal(false);

  @Output() taskUpdated = new EventEmitter<string>();
  @Output() editTask = new EventEmitter<{activity:ActivityItemDetails,viewMode:boolean}>();

  isInSession = input<boolean>(false);
  inPomodoroList = input<boolean>(false);
  @Output() moveToCurrentSession = new EventEmitter<ActivityItemDetails>();
  @Output() removeFromCurrentSession = new EventEmitter<ActivityItemDetails>();

  taskService = inject(IndividualTaskService);
  habitService = inject(HabitTaskService);

  ngOnInit(): void {
    //todo Change
    this.isCompleted.set(this.activity.status != ActivityStatus.DEADLINE_MISSED);
  }

  completeTask(event:MouseEvent): void {
    event.stopPropagation();
    this.isCompleted.set(true);
    const request: TaskRequest = {
      title: this.activity.title,
      deadlineDate: this.activity.deadlineDate,
      deadlineTime: this.activity.deadlineTime,
      categoryId: this.activity.categoryId,
      difficultyId: this.activity.difficultyId,
      completed: true,
      description: this.activity.description,
    };
    this.taskService.editTask(this.activity.id, request).subscribe({
      next: (response) => {
        this.activity.completedAt = response.completedAt;
        this.taskUpdated.emit(this.activity.id);
      },
      error: (error) => {
        console.error('Error:', error);
        this.isCompleted.set(false);
      },
    });
  }


  completeHabitCycle(event:MouseEvent): void {
    event.stopPropagation()
    if (this.activity.type == ActivityType.HABIT) {

      const request: HabitRequest = {
        title: this.activity.title,
        categoryId: this.activity.categoryId,
        difficultyId: this.activity.difficultyId,
        description: this.activity.description,
        cycleLength: this.activity.cycleLength!,
        iterationCompleted: true,

      }
      this.habitService.editHabitTask(this.activity.id, request).subscribe({
        next: () => {
          this.taskUpdated.emit(this.activity.id);
        },
        error: (error) => {
          console.error('Error:', error);
          this.isCompleted.set(false);
        },
      });
    }
  }
  onTaskEdit(event:MouseEvent) {
    event.stopPropagation()
    this.editTask.emit({activity:this.activity,viewMode:false});
  }
  onTaskView(event:MouseEvent)
  {
    event.stopPropagation()
    this.editTask.emit({activity:this.activity,viewMode:true})
  }

    addTaskToPomodoroSession() {
      this.moveToCurrentSession.emit(this.activity);
    }

    removeTaskFromPomodoroSession() {
      this.removeFromCurrentSession.emit(this.activity);
    }



  protected readonly ActivityType = ActivityType;

}
