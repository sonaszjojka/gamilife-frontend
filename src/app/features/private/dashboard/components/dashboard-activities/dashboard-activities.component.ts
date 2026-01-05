import {Component, input} from '@angular/core';
import {ActivityItemDetails} from '../../../../shared/models/task-models/activity.model';
import {ActivityItemComponent} from '../../../shared/components/tasks/task-item/activity-item.component';
import {NzFlexDirective} from 'ng-zorro-antd/flex';
import {NzListComponent, NzListEmptyComponent, NzListHeaderComponent} from 'ng-zorro-antd/list';
import {NzDividerComponent} from 'ng-zorro-antd/divider';
import {NzSpinComponent} from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-dashboard-activities',
  templateUrl: 'dashboard-activities.component.html',
  styleUrl: 'dashboard-activities.component.css',
  imports: [
    ActivityItemComponent,
    NzFlexDirective,
    NzListComponent,
    NzListEmptyComponent,
    NzListHeaderComponent,
    NzDividerComponent,
    NzSpinComponent
  ],
  standalone: true
})

export class DashboardActivitiesComponent
{
  activities=input<ActivityItemDetails[]>([])
  isLoading = input.required<boolean>()
}
