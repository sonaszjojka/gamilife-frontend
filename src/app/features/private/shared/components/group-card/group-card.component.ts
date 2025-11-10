import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Group } from '../../../community/services/groups-api/group-api.service';

@Component({
  selector: 'app-group-card',
  imports: [
    CommonModule,
    NzCardModule,
    NzIconModule,
    NzTagModule,
    NzButtonModule,
  ],
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.css',
  standalone: true,
})
export class GroupCardComponent {
  @Input({ required: true }) group!: Group;
}
