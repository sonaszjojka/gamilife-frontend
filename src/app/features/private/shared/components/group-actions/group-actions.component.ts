import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { Group } from '../../../../shared/models/group.model';
import { GroupPreviewMode } from '../../../../shared/models/group-preview-mode';
import { take } from 'rxjs/operators';
import { GroupMemberApiService } from '../../../../shared/services/group-member-api/group-member-api.service';
import { Router } from '@angular/router';
import { GroupRequestApiService } from '../../../../shared/services/group-request-api/group-request-api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-group-actions',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzIconModule, NzModalModule],
  template: `
    <div class="action-section">
      <button
        nz-button
        [nzType]="buttonType()"
        nzSize="large"
        nzBlock
        (click)="onButtonClick()"
        [disabled]="buttonDisabled()"
        [nzLoading]="loading()"
      >
        <span nz-icon [nzType]="buttonIcon()"></span>
        {{ buttonText() }}
      </button>

      <p *ngIf="showLimitWarning()" class="limit-warning">
        Group has reached the member limit
      </p>
    </div>
  `,
  styles: [
    `
      .action-section {
        margin: 10px 12px;
      }

      .limit-warning {
        margin-top: 12px;
        text-align: center;
        color: #ff4d4f;
        font-size: 14px;
      }
    `,
  ],
})
export class GroupActionsComponent {
  group = input.required<Group>();
  mode = input<GroupPreviewMode>(GroupPreviewMode.PUBLIC);

  actionComplete = output<void>();

  protected loading = signal<boolean>(false);
  private readonly memberApi = inject(GroupMemberApiService);
  private readonly groupMemberApi = inject(GroupMemberApiService);
  private readonly requestsApi = inject(GroupRequestApiService);
  private readonly modal = inject(NzModalService);
  private router = inject(Router);

  protected buttonText = computed(() => {
    const g = this.group();
    const m = this.mode();

    if (m === GroupPreviewMode.MEMBER || m === GroupPreviewMode.ADMIN) {
      return 'Leave Group';
    }

    if (!g) return 'Join Group';

    if (g.groupType.title === 'Open' && !g.isMember) return 'Join Group';

    if (g.membersLimit && g.membersCount >= g.membersLimit) {
      return 'Group Full';
    }

    if (g.isMember) {
      return 'You are a Member';
    }

    if (g.hasActiveGroupRequest) {
      return 'Request Sent';
    }

    if (g.groupType.title === 'Request only') {
      return 'Send Request';
    }

    if (g.groupType.title === 'Closed') {
      return 'Invitation Only';
    }

    return 'Join Group';
  });

  protected buttonDisabled = computed(() => {
    const g = this.group();
    const m = this.mode();

    if (m === GroupPreviewMode.MEMBER || m === GroupPreviewMode.ADMIN) {
      return false;
    }

    if (!g) return true;

    if (g.membersLimit && g.membersCount >= g.membersLimit) {
      return true;
    }

    if (
      g.isMember ||
      (g.hasActiveGroupRequest && g.groupType.title !== 'Open')
    ) {
      return true;
    }

    if (g.groupType.title === 'Closed') {
      return true;
    }

    return false;
  });

  protected buttonType = computed(() => {
    return this.mode() === GroupPreviewMode.MEMBER ||
      this.mode() === GroupPreviewMode.ADMIN
      ? 'default'
      : 'primary';
  });

  protected buttonIcon = computed(() => {
    return this.mode() === GroupPreviewMode.MEMBER ||
      this.mode() === GroupPreviewMode.ADMIN
      ? 'logout'
      : 'plus-circle';
  });

  protected showLimitWarning = computed(() => {
    const g = this.group();
    return g && g.membersLimit && g.membersCount >= g.membersLimit;
  });

  onButtonClick(): void {
    const g = this.group();
    const m = this.mode();

    if (!g || !g.groupId) return;

    this.loading.set(true);

    if (m === GroupPreviewMode.MEMBER || m === GroupPreviewMode.ADMIN) {
      this.leaveGroup(g);
    } else {
      this.joinOrRequestGroup(g);
    }
  }

  private joinOrRequestGroup(group: Group): void {
    if (!group.groupId) return;

    if (group.groupType.title === 'Open') {
      this.memberApi
        .joinGroup(group.groupId)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.loading.set(false);
            this.actionComplete.emit();
          },
          error: (err) => {
            console.error(err);
            this.loading.set(false);
          },
        });
    } else {
      this.requestsApi
        .sendRequest(group.groupId)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.loading.set(false);
            this.actionComplete.emit();
          },
          error: (err) => {
            console.error(err);
            this.loading.set(false);
          },
        });
    }
  }

  private leaveGroup(group: Group): void {
    if (
      !group.groupId ||
      !group.loggedUserMembershipDto ||
      !group.loggedUserMembershipDto.groupMemberId
    )
      return;

    this.groupMemberApi
      .leaveGroup(group.groupId, group.loggedUserMembershipDto.groupMemberId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.actionComplete.emit();
          this.router.navigate(['/app/community']);
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);

          const errorObj = JSON.parse(err.error);

          if (errorObj.code === '3001') {
            this.showAdminCannotLeaveModal();
          }
        },
      });
  }

  private showAdminCannotLeaveModal(): void {
    this.modal.warning({
      nzTitle: 'Cannot Leave Group',
      nzContent:
        'As the group administrator, you cannot leave the group without first transferring admin rights to another member. Please assign a new administrator before leaving.',
      nzOkText: 'OK',
      nzCentered: true,
      nzClosable: true,
      nzMaskClosable: true,
    });
  }
}
