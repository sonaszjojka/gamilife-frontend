// group-actions.component.ts
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
import { Group } from '../../../../shared/models/group.model';
import { GroupApiService } from '../../../../shared/services/groups-api/group-api.service';
import { GroupPreviewMode } from '../../../../shared/models/group-preview-mode';
import { take } from 'rxjs/operators';
import { GroupMemberApiService } from '../../../../shared/services/group-member-api.service';

@Component({
  selector: 'app-group-actions',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzIconModule],
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
        margin-top: 24px;
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
  private readonly groupApi = inject(GroupApiService);
  private readonly groupMemberApi = inject(GroupMemberApiService);

  protected buttonText = computed(() => {
    const g = this.group();
    const m = this.mode();

    if (m === GroupPreviewMode.MEMBER) {
      return 'Leave Group';
    }

    if (!g) return 'Join Group';

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

    if (m === GroupPreviewMode.MEMBER) {
      return false;
    }

    if (!g) return true;

    if (g.membersLimit && g.membersCount >= g.membersLimit) {
      return true;
    }

    if (g.isMember || g.hasActiveGroupRequest) {
      return true;
    }

    if (g.groupType.title === 'Closed') {
      return true;
    }

    return false;
  });

  protected buttonType = computed(() => {
    return this.mode() === GroupPreviewMode.MEMBER ? 'default' : 'primary';
  });

  protected buttonIcon = computed(() => {
    return this.mode() === GroupPreviewMode.MEMBER ? 'logout' : 'plus-circle';
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

    if (m === GroupPreviewMode.MEMBER) {
      this.leaveGroup(g);
    } else {
      this.joinOrRequestGroup(g);
    }
  }

  private joinOrRequestGroup(group: Group): void {
    if (!group.groupId) return;

    if (group.groupType.title === 'Open') {
      this.groupApi
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
      this.groupApi
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
    if (!group.groupId || !group.groupMemberIdForLoggedUser) return;

    this.groupMemberApi
      .leaveGroup(group.groupId, group.groupMemberIdForLoggedUser)
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
