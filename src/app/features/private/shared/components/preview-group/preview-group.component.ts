import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { GroupApiService } from '../../../../shared/services/groups-api/group-api.service';
import { GroupRequestApiService } from '../../../../shared/services/group-request-api/group-request-api.service';
import { Group } from '../../../../shared/models/group/group.model';
import { GroupPreviewMode } from '../../../../shared/models/group/group-preview-mode';
import { GroupMember } from '../../../../shared/models/group/group-member.model';
import { GroupRequest } from '../../../../shared/models/group/group-request.model';
import { GroupInfoCardComponent } from '../group-info-card/group-info-card.component';
import { GroupActionsComponent } from '../group-actions/group-actions.component';
import { MembersListPeakComponent } from '../members-list-peak/members-list-peak.component';
import { RankingListPeakComponent } from '../ranking-list-peak/ranking-list-peak.component';
import { GroupRequestsListPeakComponent } from '../group-request-list-peak/group-requests-list-peak/group-requests-list-peak.component';
import { EditGroupFormComponent } from '../edit-group-form/edit-group-form.component';
import {GroupTasksListComponent} from '../group-tasks-list/group-tasks-list.component';

@Component({
  selector: 'app-preview-group',
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    NzCardModule,
    NzIconModule,
    NzListModule,
    NzButtonModule,
    NzModalModule,
    GroupInfoCardComponent,
    GroupActionsComponent,
    MembersListPeakComponent,
    RankingListPeakComponent,
    GroupRequestsListPeakComponent,
    GroupTasksListComponent,
  ],
  templateUrl: './preview-group.component.html',
  styleUrls: ['./preview-group.component.css'],
})
export class PreviewGroupComponent implements OnInit {
  mode = signal<GroupPreviewMode>(GroupPreviewMode.PUBLIC);
  protected group = signal<Group | undefined>(undefined);
  protected groupId = signal<string | undefined>(undefined);
  protected loading = signal<boolean>(true);
  protected membersList = signal<GroupMember[]>([]);
  protected requestsList = signal<GroupRequest[]>([]);


  protected GroupPreviewMode = GroupPreviewMode;
  protected router = inject(Router);

  private readonly groupApi = inject(GroupApiService);
  private readonly requestsApi = inject(GroupRequestApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly modal = inject(NzModalService);

  @ViewChild(EditGroupFormComponent)
  editGroupForm!: EditGroupFormComponent;


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('groupId');
    if (!id) return;
    this.groupId.set(id);
    this.loadGroup();
    this.loadGroupRequests();
  }

  private loadGroup(): void {
    this.loading.set(true);

    this.groupApi
      .getGroupById(this.groupId()!, true)
      .pipe(take(1))
      .subscribe({
        next: (group) => {
          this.group.set(group);
          this.mode.set(
            group.isMember
              ? group.adminId === group.loggedUserMembershipDto?.userId
                ? GroupPreviewMode.ADMIN
                : GroupPreviewMode.MEMBER
              : GroupPreviewMode.PUBLIC,
          );
          this.membersList.set(group.membersSortedDescByTotalEarnedMoney);
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
        },
      });
  }


  private loadGroupRequests(): void {
    const groupId = this.groupId();
    if (!groupId) return;

    this.requestsApi
      .getPendingGroupRequests(groupId, 0, 5)
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.requestsList.set(result.content);
        },
        error: (err) => {
          console.error('Error loading group requests:', err);
          this.requestsList.set([]);
        },
      });
  }

  protected onActionComplete(): void {
    this.loadGroup();
    this.loadGroupRequests();
  }

  protected goToManageGroupMembersPage(): void {
    const groupId = this.route.snapshot.paramMap.get('groupId');
    if (groupId) {
      this.router.navigate([`app/groups/${groupId}/members`]);
    } else {
      console.error('Group ID not found in route');
    }
  }

  protected goToManageGroupRequestsPage(): void {
    const groupId = this.route.snapshot.paramMap.get('groupId');
    if (groupId) {
      this.router.navigate([`app/groups/${groupId}/requests`]);
    } else {
      console.error('Group ID not found in route');
    }
  }

  protected goToRankingPage(): void {
    const groupId = this.route.snapshot.paramMap.get('groupId');
    if (groupId) {
      this.router.navigate([`app/groups/${groupId}/ranking`]);
    } else {
      console.error('Group ID not found in route');
    }
  }

  protected openEditModal(): void {
    if (this.editGroupForm) {
      this.editGroupForm.open();
    }
  }

  protected confirmDelete(): void {
    this.modal.confirm({
      nzTitle: 'Delete Group',
      nzContent:
        'Are you sure you want to delete this group? This action cannot be undone.',
      nzOkText: 'Delete',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () => this.deleteGroup(),
    });
  }

  private deleteGroup(): void {
    const groupId = this.group()?.groupId;
    if (!groupId) return;

    this.groupApi
      .deleteGroup(groupId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.router.navigate(['app/groups']);
        },
        error: (err) => {
          console.error('Failed to delete group:', err);
        },
      });
  }
}
