import { Component, input, output } from '@angular/core';
import { ActivityItemDetails } from '../../../../shared/models/task-models/activity.model';
import { ActivityItemComponent } from '../../../shared/components/tasks/task-item/activity-item.component';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { NzListComponent, NzListEmptyComponent } from 'ng-zorro-antd/list';

@Component({
  selector: 'app-dashboard-activities',
  templateUrl: 'dashboard-activities.component.html',
  styleUrl: 'dashboard-activities.component.css',
  imports: [
    ActivityItemComponent,
    NzFlexDirective,
    NzListComponent,
    NzListEmptyComponent,
  ],
  standalone: true,
})
export class DashboardActivitiesComponent {
  activities = input<ActivityItemDetails[]>([]);
  isLoading = input.required<boolean>();
  removeActivity = output<string>();

  removeFromList(activityId: string) {
    this.removeActivity.emit(activityId);
  }
}
