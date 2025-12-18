import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { GroupApiService } from '../../../../shared/services/groups-api/group-api.service';
import { CommunityInputSearchComponent } from '../../../shared/components/community-input-search/community-input-search.component';
import { PaginationMoreComponent } from '../../../shared/components/pagination-more/pagination-more.component';
import { GroupFilterParams } from '../../../../shared/models/group/group.model';
import { Group } from '../../../../shared/models/group/group.model';
import { GroupListComponent } from '../../../shared/components/group-list/group-list.component';
import { AddGroupFormComponent } from '../add-group-form/add-group-form.component';

@Component({
  selector: 'app-my-groups-page',
  imports: [
    CommonModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzGridModule,
    CommunityInputSearchComponent,
    PaginationMoreComponent,
    GroupListComponent,
    AddGroupFormComponent,
  ],
  templateUrl: './my-groups-page.component.html',
  styleUrl: './my-groups-page.component.css',
  standalone: true,
})
export class MyGroupsPageComponent implements OnInit {
  private groupApiService = inject(GroupApiService);

  groups = signal<Group[]>([]);
  totalPages = signal<number>(0);
  currentPage = signal<number>(0);
  groupName = signal<string | undefined>(undefined);
  groupTypeId = signal<number | undefined>(undefined);
  @ViewChild(AddGroupFormComponent) addGroupForm!: AddGroupFormComponent;
  @ViewChild(CommunityInputSearchComponent)
  inputSearch!: CommunityInputSearchComponent;
  ngOnInit() {
    this.loadMyGroups(0, 0);
  }

  loadMyGroups(page: number, timeout: number) {
    const params: GroupFilterParams = {
      page: page,
      size: 12,
      groupName: this.groupName() ?? undefined,
      groupType: this.groupTypeId() ?? undefined,
    };

    this.groupApiService
      .getAllGroupsByUserIdWhereUserIsMember(params)
      .subscribe({
        next: (response) => {
          setTimeout(() => {
            this.groups.set(response.content);
            this.totalPages.set(response.totalPages - 1);
            this.currentPage.set(page);
          }, timeout);
        },
      });
  }

  openAddGroupModal(): void {
    this.addGroupForm.open();
  }

  onGroupCreated() {
    this.groupName.set(undefined);
    this.groupTypeId.set(undefined);
    this.inputSearch.resetFilters();
    this.loadMyGroups(0, 0);
  }

  onPageChange(page: number) {
    this.loadMyGroups(page, 350);
  }

  onInputChange(inputValue: string) {
    this.groupName.set(inputValue);
    this.loadMyGroups(0, 350);
  }

  onGroupTypeChange(groupTypeId: string | null) {
    this.groupTypeId.set(groupTypeId != null ? Number(groupTypeId) : undefined);
    this.loadMyGroups(0, 350);
  }
}
