import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { GroupApiService } from '../../../../shared/services/groups-api/group-api.service';
import { GroupMember } from '../../../../shared/models/group-member.model';
import { GroupMembersListComponent } from '../../../shared/components/group-members-list/group-members-list.component';
import { take } from 'rxjs/operators';
import { SendGroupInvitationFormComponent } from '../send-group-invitation-form/send-group-invitation-form.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-group-members-page',
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    GroupMembersListComponent,
    SendGroupInvitationFormComponent,
  ],
  templateUrl: './group-members-page.component.html',
  styles: [
    `
      .members-page-container {
        padding: var(--spacing-large);
        max-width: 1200px;
        margin: 0 auto;
      }

      .invite-btn-container {
        display: flex;
        justify-content: flex-end;
        margin-bottom: var(--spacing-medium);
      }
    `,
  ],
})
export class GroupMembersPageComponent implements OnInit {
  private readonly groupApi = inject(GroupApiService);
  private readonly route = inject(ActivatedRoute);

  @ViewChild(SendGroupInvitationFormComponent)
  invitationForm!: SendGroupInvitationFormComponent;

  groupId = signal<string>('');
  groupName = signal<string>('');
  members = signal<GroupMember[]>([]);
  adminId = signal<string | null>(null);
  isAdmin = signal<boolean>(false);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('groupId');
    if (!id) return;

    this.groupId.set(id);
    this.loadMembers();
  }

  loadMembers(): void {
    this.loading.set(true);

    this.groupApi
      .getGroupById(this.groupId(), true)
      .pipe(take(1))
      .subscribe({
        next: (group) => {
          this.groupName.set(group.groupName);
          this.members.set(group.members);
          this.adminId.set(group.adminId);
          this.isAdmin.set(
            group.adminId === group.loggedUserMembershipDto?.userId,
          );
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load members:', err);
          this.loading.set(false);
        },
      });
  }

  openInvitationModal(): void {
    this.invitationForm.open();
  }
}
