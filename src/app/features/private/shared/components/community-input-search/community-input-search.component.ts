import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { GroupApiService } from '../../../../shared/services/groups-api/group-api.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { GroupFilterParams } from '../../../../shared/models/group/group.model';
import { GroupType } from '../../../../shared/models/group/group-type.model';

@Component({
  selector: 'app-community-input-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzSelectModule,
  ],
  template: `
    <div class="input-search-container">
      <nz-input-group nzSearch>
        <input
          nz-input
          [value]="value()"
          (input)="onInputChange($event)"
          placeholder="Enter group name"
        />
      </nz-input-group>

      <nz-select
        *ngIf="groupTypes().length > 0"
        [(ngModel)]="selectedGroupTypeId"
        nzAllowClear
        nzPlaceHolder="Filter by group type"
        (ngModelChange)="onGroupTypeChange($event)"
      >
        <nz-option
          *ngFor="let type of groupTypes()"
          [nzValue]="type.id"
          [nzLabel]="type.title"
        ></nz-option>
      </nz-select>
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

      nz-input-group {
        width: 400px;
      }
      nz-select {
        width: 200px;
      }
      @media (max-width: 768px) {
        .input-search-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 16px;
          height: 100px;
          flex-wrap: wrap;
        }

        nz-input-group {
          width: 400px;
          max-width: 100%;
        }

        nz-select {
          width: 200px;
          max-width: 100%;
        }
      }
    `,
  ],
})
export class CommunityInputSearchComponent implements OnInit {
  readonly groupTypes = signal<GroupType[]>([]);

  selectedGroupTypeId?: number;

  readonly value = signal('');

  protected groupApiService = inject(GroupApiService);

  @Output() inputChange = new EventEmitter<string>();
  @Output() groupTypeChange = new EventEmitter<string | null>();

  ngOnInit(): void {
    this.loadGroupTypes();
    const params: GroupFilterParams = {
      page: 0,
      size: 9,
    };

    this.groupApiService.getGroups(params);
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
    this.inputChange.emit(this.value());
  }

  onGroupTypeChange(newTypeId: string | null) {
    this.groupTypeChange.emit(newTypeId);
  }

  private loadGroupTypes(): void {
    this.groupApiService.getGroupTypes().subscribe({
      next: (types) => this.groupTypes.set(types),
    });
  }

  resetFilters(): void {
    this.value.set('');
    this.selectedGroupTypeId = undefined;
    this.inputChange.emit('');
    this.groupTypeChange.emit(null);
  }
}
