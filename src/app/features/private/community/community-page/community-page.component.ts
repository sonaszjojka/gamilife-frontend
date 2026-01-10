import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { GroupApiService } from '../../../shared/services/groups-api/group-api.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommunityInputSearchComponent } from '../components/community-input-search/community-input-search.component';
import { CommonModule } from '@angular/common';
import { PaginationMoreComponent } from '../../shared/components/pagination-more/pagination-more.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import {
  GroupFilterParams,
  Group,
} from '../../../shared/models/group/group.model';
import { GroupListComponent } from '../components/group-list/group-list.component';
import { NotificationService } from '../../../shared/services/notification-service/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AddGroupFormComponent } from '../components/add-group-form/add-group-form.component';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { GroupType } from '../../../shared/models/group/group-type.model';

@Component({
  selector: 'app-community-page',
  imports: [
    NzInputModule,
    NzIconModule,
    CommunityInputSearchComponent,
    CommonModule,
    PaginationMoreComponent,
    NzGridModule,
    GroupListComponent,
    NzEmptyModule,
    NzButtonModule,
    AddGroupFormComponent,
    NzPageHeaderModule,
  ],
  templateUrl: './community-page.component.html',
  styleUrl: './community-page.component.css',
  standalone: true,
})
export class CommunityPageComponent implements OnInit {
  private readonly groupApiService = inject(GroupApiService);
  private readonly notification = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly value = signal('');
  groups = signal<Group[]>([]);
  groupTypes = signal<GroupType[]>([]);
  totalPages = signal<number>(0);
  currentPage = signal<number>(0);
  groupName = signal<string | undefined>(undefined);
  groupTypeId = signal<number | undefined>(undefined);

  @ViewChild(AddGroupFormComponent) addGroupForm!: AddGroupFormComponent;
  @ViewChild(CommunityInputSearchComponent)
  inputSearch!: CommunityInputSearchComponent;

  ngOnInit() {
    this.loadGroups(0);
    this.loadGroupTypes();
  }

  private loadGroups(page: number) {
    const params: GroupFilterParams = {
      page: page,
      size: 12,
      groupName: this.groupName() ?? undefined,
      groupType: this.groupTypeId() ?? undefined,
    };

    this.groupApiService
      .getGroups(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.groups.set(response.content);
          this.totalPages.set(response.totalPages - 1);
          this.currentPage.set(page);
        },
        error: (err) => {
          this.notification.handleApiError(err, 'Failed to load groups');
        },
      });
  }

  private loadGroupTypes(): void {
    this.groupApiService
      .getGroupTypes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (types) => this.groupTypes.set(types),
      });
  }

  onPageChange(page: number) {
    this.loadGroups(page);
  }

  onInputChange(inputValue: string) {
    this.groupName.set(inputValue);
    this.loadGroups(0);
  }

  onGroupTypeChange(groupTypeId: string | null) {
    this.groupTypeId.set(groupTypeId != null ? Number(groupTypeId) : undefined);
    this.loadGroups(0);
  }

  openAddGroupModal(): void {
    this.addGroupForm.open();
  }

  onGroupCreated() {
    this.groupName.set(undefined);
    this.groupTypeId.set(undefined);
    if (this.inputSearch) {
      this.inputSearch.resetFilters();
    }
    this.loadGroups(0);
  }
}
