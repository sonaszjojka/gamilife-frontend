import {
  Component,
  EventEmitter,
  input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { GroupType } from '../../../../shared/models/group/group-type.model';
import { DashboardInputSearchComponent } from '../dashboard-input-search/dashboard-input-search.component';

@Component({
  selector: 'app-community-input-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzSelectModule,
    DashboardInputSearchComponent,
  ],
  template: `
    <div class="input-search-container">
      <app-dashboard-input-search
        placeholder="Enter group name"
        width="300px"
        (inputChange)="onInputChange($event)"
      >
      </app-dashboard-input-search>

      @if (groupTypes().length > 0) {
        <nz-select
          [(ngModel)]="selectedGroupTypeId"
          nzAllowClear
          nzPlaceHolder="Group type"
          (ngModelChange)="onGroupTypeChange($event)"
        >
          @for (type of groupTypes(); track type.id) {
            <nz-option [nzValue]="type.id" [nzLabel]="type.title"></nz-option>
          }
        </nz-select>
      }
    </div>
  `,
  styles: [
    `
      .input-search-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 100px;
        gap: var(--spacing-medium);
      }

      nz-select {
        width: 140px;
      }
    `,
  ],
})
export class CommunityInputSearchComponent {
  groupTypes = input.required<GroupType[]>();

  selectedGroupTypeId?: number;

  @ViewChild(DashboardInputSearchComponent)
  inputSearch!: DashboardInputSearchComponent;

  @Output() inputChange = new EventEmitter<string>();
  @Output() groupTypeChange = new EventEmitter<string | null>();

  onInputChange(value: string): void {
    this.inputChange.emit(value);
  }

  onGroupTypeChange(newTypeId: string | null) {
    this.groupTypeChange.emit(newTypeId);
  }

  resetFilters(): void {
    this.selectedGroupTypeId = undefined;
    this.inputChange.emit('');
    this.groupTypeChange.emit(null);
  }
}
