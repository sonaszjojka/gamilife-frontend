import { Component, inject, Input, WritableSignal } from '@angular/core';

import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Router } from '@angular/router';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { ActivityListView } from '../../../../shared/models/task/activity-list-view.model';

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
  @Input() listView?: WritableSignal<ActivityListView>;
  @Input() isAlive?: WritableSignal<boolean>;

  router = inject(Router);

  activitiesSelected(): void {
    this.listView?.set(ActivityListView.Activities);
    this.categoryId?.set(null);
    this.difficultyId?.set(null);
    this.isAlive?.set(true);
  }

  categorySelected(
    category: number,
    viewType: 'Activities' | 'Tasks' | 'Habits',
  ): void {
    if (viewType === 'Activities')
      this.listView?.set(ActivityListView.Activities);
    if (viewType === 'Tasks') this.listView?.set(ActivityListView.Tasks);
    if (viewType === 'Habits') this.listView?.set(ActivityListView.Habits);

    this.categoryId?.set(category);
    this.difficultyId?.set(null);
    this.isAlive?.set(true);
  }

  difficultySelected(
    difficulty: number,
    viewType: 'Activities' | 'Tasks' | 'Habits',
  ): void {
    if (viewType === 'Activities')
      this.listView?.set(ActivityListView.Activities);
    if (viewType === 'Tasks') this.listView?.set(ActivityListView.Tasks);
    if (viewType === 'Habits') this.listView?.set(ActivityListView.Habits);
    this.difficultyId?.set(difficulty);
    this.categoryId?.set(null);
    this.isAlive?.set(true);
  }

  activeTaskSelected(): void {
    this.listView?.set(ActivityListView.Tasks);
    this.isAlive?.set(true);
    this.difficultyId?.set(null);
    this.categoryId?.set(null);
  }

  inactiveTaskSelected(): void {
    this.listView?.set(ActivityListView.Tasks);
    this.isAlive?.set(false);
    this.difficultyId?.set(null);
    this.categoryId?.set(null);
  }

  activeHabitSelected(): void {
    this.listView?.set(ActivityListView.Habits);
    this.isAlive?.set(true);
    this.difficultyId?.set(null);
    this.categoryId?.set(null);
  }
  inactiveHabitSelected(): void {
    this.listView?.set(ActivityListView.Habits);
    this.isAlive?.set(false);
    this.difficultyId?.set(null);
    this.categoryId?.set(null);
  }

  pomodoroSessionSelected() {
    this.router.navigate(['/app/tasks/pomodoro-session']);
  }
}
