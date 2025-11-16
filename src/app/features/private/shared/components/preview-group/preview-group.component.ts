import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzListModule } from 'ng-zorro-antd/list';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { GroupApiService } from '../../../../shared/services/groups-api/group-api.service';
import { Group } from '../../../../shared/models/group.model';
import { GroupPreviewMode } from '../../../../shared/models/group-preview-mode';
import { GroupMember } from '../../../../shared/models/group-member.model';
import { GroupInfoCardComponent } from '../group-info-card/group-info-card.component';
import { GroupActionsComponent } from '../group-actions/group-actions.component';
import { MembersListPeakComponent } from '../members-list-peak/members-list-peak.component';
import { GroupAdminActionsComponent } from '../group-admin-actions/group-admin-actions.component';
import { NzButtonComponent } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-preview-group',
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    NzCardModule,
    NzIconModule,
    NzListModule,
    GroupInfoCardComponent,
    GroupActionsComponent,
    MembersListPeakComponent,
    GroupAdminActionsComponent,
    NzButtonComponent,
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
  protected GroupPreviewMode = GroupPreviewMode;
  protected router = inject(Router);
  private readonly groupApi = inject(GroupApiService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('groupId');
    if (!id) return;

    this.groupId.set(id);
    this.loadGroup();
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
          this.membersList.set(group.members);
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
        },
      });
  }

  protected onActionComplete(): void {
    this.loadGroup();
  }

  protected goToManageGroupMembersPage(): void {
    const groupId = this.route.snapshot.paramMap.get('groupId');
    if (groupId) {
      this.router.navigate([`app/groups/${groupId}/members`]);
    } else {
      console.error('Group ID not found in route');
    }
  }
}
