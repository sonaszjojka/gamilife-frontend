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
import {
  GroupApiService,
  GroupType,
} from '../../../community/services/groups-api/group-api.service';
import { HttpClient } from '@angular/common/http';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { GroupFilterParams } from '../../../community/services/groups-api/group-api.service';

@Component({
  selector: 'app-input-search',
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
    `,
  ],
})
export class InputSearchComponent implements OnInit {
  private readonly http = inject(HttpClient);

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
      error: (err) => console.error('Failed to load group types:', err),
    });
  }
}
