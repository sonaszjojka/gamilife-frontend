import { Component, input, output } from '@angular/core';
import { ActivityItemDetails } from '../../../../shared/models/task/activity.model';
import { ActivityItemComponent } from '../../../shared/task-item/activity-item.component';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { NzListComponent, NzListEmptyComponent } from 'ng-zorro-antd/list';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-page-activities',
  templateUrl: 'dashboard-activities.component.html',
  styleUrl: 'dashboard-activities.component.css',
  imports: [
    ActivityItemComponent,
    NzFlexDirective,
    NzListComponent,
    NzListEmptyComponent,
    NzButtonModule,
    NzIconModule,
    RouterLink,
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
