import {Component, inject, input, Input, WritableSignal} from '@angular/core';

import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Router } from '@angular/router';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import {ActivityListView} from '../../../../../shared/models/task-models/activity-list-view.model';

@Component({
  selector: 'app-task-filter',
  imports: [NzMenuModule, NzIconDirective],
  standalone: true,
  templateUrl: './task-filter.component.html',
  styleUrl: 'task-filter.component.css',
})
export class TaskFilterComponent {
  openMap: Record<string, boolean> = {
    status: true,
    difficulty: false,
    category: false,
  };

  @Input() difficultyId?: WritableSignal<number | null>;
  @Input() categoryId?: WritableSignal<number | null>;
  @Input() listView?:WritableSignal<ActivityListView>;
  @Input() isAlive?:WritableSignal<boolean>;


  router = inject(Router);

  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }

  activitiesSelected(): void {
    this.listView?.set(ActivityListView.Activities);
    this.categoryId?.set(null);
    this.difficultyId?.set(null);
  }

  categorySelected(category: number): void {
    this.listView?.set(ActivityListView.Activities);
    this.categoryId?.set(category);
    this.difficultyId?.set(null);

  }

  difficultySelected(difficulty: number): void {
    this.listView?.set(ActivityListView.Activities);
    this.categoryId?.set(null);
    this.difficultyId?.set(difficulty);

  }

  activeTaskSelected(): void {
    this.listView?.set(ActivityListView.Tasks);
    this.isAlive?.set(true);
  }

  inactiveTaskSelected(): void {
    this.listView?.set(ActivityListView.Tasks);
    this.isAlive?.set(false);
  }

  activeHabitSelected(): void {
    this.listView?.set(ActivityListView.Habits);
    this.isAlive?.set(true);
  }
  inactiveHabitSelected(): void {
    this.listView?.set(ActivityListView.Habits);
    this.isAlive?.set(false);
  }

  pomodoroSessionSelected() {
    this.router.navigate(['/app/tasks/pomodoro-session']);
  }
}
