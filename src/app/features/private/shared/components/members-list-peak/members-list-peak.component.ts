import { Component, input } from '@angular/core';
import { GroupMember } from '../../../../shared/models/group-member.model';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-members-list-peak',
  standalone: true,
  imports: [CommonModule, NzListModule, NzIconModule],
  template: `
    <nz-list
      [nzDataSource]="displayMembers()"
      nzBordered
      [nzHeader]="headerTemplate"
    >
      <ng-template #headerTemplate>
        <div class="list-header">
          <h2 class="header-title">Members</h2>
        </div>
      </ng-template>

      <nz-list-item *ngFor="let member of displayMembers()">
        <div class="member-item">
          <span class="username">{{ member.username }}</span>
          <div class="earned">
            <span nz-icon nzType="dollar" class="icon"></span>
            <span class="amount">{{
              member.totalEarnedMoney ?? 0 | number: '1.2-2'
            }}</span>
          </div>
        </div>
      </nz-list-item>
    </nz-list>
  `,
  styles: [
    `
      .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: var(--spacing-medium);
        border-bottom: 1px solid var(--border-color-light);
      }

      .header-title {
        margin: 0;
        font-size: var(--font-size-xlarge);
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary-color);
      }

      .member-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .username {
        font-weight: var(--font-weight-medium);
        color: var(--text-primary-color);
      }

      .earned {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        color: var(--color-success);
        font-weight: var(--font-weight-medium);
      }

      .icon {
        font-size: var(--font-size-small);
      }

      ::ng-deep .ant-list-bordered {
        border-radius: var(--border-radius-medium);
        border: 1px solid var(--border-color-light);
      }

      ::ng-deep .ant-list-header {
        padding: var(--spacing-medium);
        background: transparent;
        border-bottom: none;
      }
    `,
  ],
})
export class MembersListPeakComponent {
  membersList = input<GroupMember[]>([]);

  protected displayMembers() {
    return this.membersList().slice(0, 5);
  }
}
