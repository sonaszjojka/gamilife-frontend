import {Component, EventEmitter, inject, input, Input, OnInit, Output, signal,} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {NzCardModule} from 'ng-zorro-antd/card';
import {IndividualTaskService} from '../../../../../shared/services/tasks/individual-task.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {TaskRequest} from '../../../../../shared/models/task-models/task-request';
import {PomodoroTaskProgressComponent} from '../pomodoro-task-progress/pomodoro-task-progress.component';
import {durationToDays} from '../../../../../../shared/util/DateFormatterUtil';
import {HabitTaskService} from '../../../../../shared/services/tasks/habit-api.service';
import {EditHabitRequest} from '../../../../../shared/models/task-models/edit-habit-request';
import {ActivityItemDetails, ActivityStatus} from '../../../../../shared/models/task-models/activity.model';
import {GroupTaskDeclineFormComponent} from "../../group-task-decline-form/group-task-decline-form.component";
import {GroupTaskFormComponent} from "../../group-task-from/group-task-form.component";
import {GroupTaskMembersManagerComponent} from "../../group-task-member-manager/group-task-members-manager.component";

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
  @Output() editTask = new EventEmitter<ActivityItemDetails>();

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
/*
  completeTask(): void {
    this.isCompleted.set(true);
    const request: EditTaskRequest = {
      title: this.activity.title,
      startTime: this.activity.startTime,
      endTime: this.activity.endDate,
      categoryId: this.activity.categoryId,
      difficultyId: this.activity.difficultyId,
      completedAt: new Date(Date.now()).toISOString(),
      description: this.activity.description,
    };
    this.taskService.editTask(this.activity.taskId, request).subscribe({
      next: (response) => {
        this.activity.completedAt = response.completedAt;
        this.taskUpdated.emit(this.activity.taskId);
      },
      error: (error) => {
        console.error('Error:', error);
        this.isCompleted.set(false);
      },
    });
  }

  completeHabitCycle(): void {
    if (this.activity.taskHabit !== null)
      this.activity.endDatew = this.addCycleLengthToEndTime(
        this.activity.endDatew!,
        this.activity.taskHabit.cycleLength,
      );
    const request: EditTaskRequest = {
      title: this.activity.title,
      startTime: this.activity.startTime,
      endTime: this.activity.endDatew,
      categoryId: this.activity.categoryId,
      difficultyId: this.activity.difficultyId,
      completedAt: this.activity.completedAt,
      description: this.activity.description,
    };
    this.taskService.editTask(this.activity.taskId, request).subscribe({
      next: () => {
        this.activity.taskHabit!.currentStreak++;
        if (
          this.activity.taskHabit!.longestStreak <
          this.activity.taskHabit!.currentStreak
        ) {
          this.activity.taskHabit!.longestStreak =
            this.activity.taskHabit!.currentStreak;
        }

        const request: EditHabitRequest = {
          currentStreak: this.activity.taskHabit!.currentStreak,
          longestStreak: this.activity.taskHabit!.longestStreak,
          cycleLength: this.activity.taskHabit!.cycleLength,
          acceptedDate: this.activity.taskHabit!.acceptedDate,
        };
        this.habitService
          .editHabitTask(
            this.activity.taskHabit!.habitId,
            this.activity.taskId,
            request,
          )
          .subscribe({
            next: () => {
              this.taskUpdated.emit(this.activity.taskId);
            },
          });
      },
      error: (error) => {
        console.error('Error:', error);
        this.isCompleted.set(false);
      },
    });
  }
  completeHabit(): void {
    const acceptedDate = new Date(Date.now());

    acceptedDate.setHours(
      acceptedDate.getHours() + 1,
      acceptedDate.getMinutes(),
      acceptedDate.getSeconds(),
      acceptedDate.getMilliseconds(),
    );
    const request: EditHabitRequest = {
      currentStreak: this.activity.taskHabit!.currentStreak,
      longestStreak: this.activity.taskHabit!.longestStreak,
      cycleLength: this.activity.taskHabit!.cycleLength,
      acceptedDate: acceptedDate.toISOString(),
    };
    this.habitService
      .editHabitTask(this.activity.taskHabit!.habitId, this.activity.taskId, request)
      .subscribe({
        next: () => {
          this.completeTask();
          this.taskUpdated.emit(this.activity.taskId);
        },
      });
  }
*/
  onTaskEdit() {
    this.editTask.emit(this.activity);
  }
/*
  isInactive(): boolean {
    return (
      !!this.activity.completedAt ||
      new Date(this.activity.endDatew!) < new Date(Date.now())
    );
  }

  addTaskToPomodoroSession() {
    this.moveToCurrentSession.emit(this.activity);
  }

  removeTaskFromPomodoroSession() {
    this.removeFromCurrentSession.emit(this.activity);
  }
  addCycleLengthToEndTime(endTime: string, cycleLength: string): string {
    const endDate = new Date(endTime);
    const cycleLengthInDays = durationToDays(cycleLength);
    endDate.setDate(endDate.getDate() + cycleLengthInDays);
    return endDate.toISOString();
  }
*/

}
