import { Component, input } from '@angular/core';
import { GroupCardComponent } from '../../../shared/components/group-card/group-card.component';
import { CommonModule } from '@angular/common';
import { Group } from '../../../../shared/models/group/group.model';
import { NzGridModule } from 'ng-zorro-antd/grid';
@Component({
  selector: 'app-group-list',
  imports: [GroupCardComponent, CommonModule, NzGridModule],
  template: `
    <div nz-row class="div-groups-list-container" [nzGutter]="[16, 16]">
      @for (group of groups(); track group.groupId) {
        <div
          nz-col
          [nzXs]="24"
          [nzSm]="24"
          [nzMd]="12"
          [nzLg]="8"
          [nzXl]="6"
          [nzXXl]="3"
        >
          <app-group-card [group]="group">
            <ng-content></ng-content>
          </app-group-card>
        </div>
      }
    </div>
  `,
  styles: `
    .div-groups-list-container {
      padding: 0 var(--spacing-large);
    }
  `,
  standalone: true,
})
export class GroupListComponent {
  groups = input.required<Group[]>();
}
