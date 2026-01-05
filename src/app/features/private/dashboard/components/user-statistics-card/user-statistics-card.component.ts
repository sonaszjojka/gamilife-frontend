import { Component, input } from '@angular/core';
import { UserStatisticsModel } from '../../../../shared/models/user-profile/user-statistics.model';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzIconDirective } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-user-statistic-card',
  standalone: true,
  templateUrl: 'user-statistics-card.component.html',
  styleUrl: 'user-statistics-card.component.css',
  imports: [
    NzRowDirective,
    NzColDirective,
    NzCardComponent,
    NzDividerComponent,
    NzSpinComponent,
    NzIconDirective,
  ],
})
export class UserStatisticsCardComponent {
  statistics = input<UserStatisticsModel[]>([]);
  isLoading = input.required<boolean>();
}
