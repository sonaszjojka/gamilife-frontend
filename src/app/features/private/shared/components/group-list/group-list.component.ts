import { Component, input } from '@angular/core';
import { GroupCardComponent } from '../group-card/group-card.component';
import { CommonModule } from '@angular/common';
import { Group } from '../../../../shared/models/group.model';
import { NzGridModule } from 'ng-zorro-antd/grid';
@Component({
  selector: 'app-group-list',
  imports: [GroupCardComponent, CommonModule, NzGridModule],
  template: `
    <div nz-row [nzGutter]="[16, 16]">
      <div
        nz-col
        *ngFor="let group of groups()"
        [nzXs]="24"
        [nzSm]="24"
        [nzMd]="12"
        [nzLg]="8"
        [nzXl]="6"
      >
        <app-group-card [group]="group">
          <ng-content></ng-content>
        </app-group-card>
      </div>
    </div>
  `,
})
export class GroupListComponent {
  groups = input.required<Group[]>();
}
