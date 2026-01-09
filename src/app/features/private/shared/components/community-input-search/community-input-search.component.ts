import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { GroupApiService } from '../../../../shared/services/groups-api/group-api.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { GroupFilterParams } from '../../../../shared/models/group/group.model';
import { GroupType } from '../../../../shared/models/group/group-type.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
export class CommunityInputSearchComponent implements OnInit {
  readonly groupTypes = signal<GroupType[]>([]);

  selectedGroupTypeId?: number;

  @ViewChild(DashboardInputSearchComponent)
  inputSearch!: DashboardInputSearchComponent;

  private readonly groupApiService = inject(GroupApiService);
  private readonly destroyRef = inject(DestroyRef);

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

  onInputChange(value: string): void {
    this.inputChange.emit(value);
  }

  onGroupTypeChange(newTypeId: string | null) {
    this.groupTypeChange.emit(newTypeId);
  }

  private loadGroupTypes(): void {
    this.groupApiService
      .getGroupTypes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (types) => this.groupTypes.set(types),
      });
  }

  resetFilters(): void {
    this.selectedGroupTypeId = undefined;
    this.inputChange.emit('');
    this.groupTypeChange.emit(null);
  }
}
