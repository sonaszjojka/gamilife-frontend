import { Component, inject, OnInit, signal } from '@angular/core';
import { GroupApiService } from '../../../../shared/services/groups-api/group-api.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommunityInputSearchComponent } from '../../../shared/components/community-input-search/community-input-search.component';
import { CommonModule } from '@angular/common';
import { PaginationMoreComponent } from '../../../shared/components/pagination-more/pagination-more.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { GroupFilterParams } from '../../../../shared/models/group/group.model';
import { Group } from '../../../../shared/models/group/group.model';
import { GroupListComponent } from '../../../shared/components/group-list/group-list.component';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';

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
  ],
  templateUrl: './community-page.component.html',
  styleUrl: './community-page.component.css',
  standalone: true,
})
export class CommunityPageComponent implements OnInit {
  private groupApiService = inject(GroupApiService);
  private notification = inject(NotificationService);

  readonly value = signal('');
  groups = signal<Group[]>([]);
  totalPages = signal<number>(0);
  currentPage = signal<number>(0);
  groupName = signal<string | undefined>(undefined);
  groupTypeId = signal<number | undefined>(undefined);

  ngOnInit() {
    this.loadGroups(0, 0);
  }

  loadGroups(page: number, timeout: number) {
    const params: GroupFilterParams = {
      page: page,
      size: 12,
      groupName: this.groupName() ?? undefined,
      groupType: this.groupTypeId() ?? undefined,
    };

    this.groupApiService.getGroups(params).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.groups.set(response.content);
          this.totalPages.set(response.totalPages - 1);
          this.currentPage.set(page);
        }, timeout);
      },
      error: (err) => {
        console.error(err);
        this.notification.handleApiError(err, 'Failed to load groups');
      },
    });
  }

  onPageChange(page: number) {
    this.loadGroups(page, 350);
  }

  onInputChange(inputValue: string) {
    this.groupName.set(inputValue);
    this.loadGroups(0, 350);
  }

  onGroupTypeChange(groupTypeId: string | null) {
    this.groupTypeId.set(groupTypeId != null ? Number(groupTypeId) : undefined);
    this.loadGroups(0, 350);
  }
}
