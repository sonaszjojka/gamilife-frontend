import { Component, input, output } from '@angular/core';
import { GroupMember } from '../../../../shared/models/group-member.model';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-members-list-peak',
  standalone: true,
  imports: [CommonModule, NzListModule, NzIconModule, NzButtonModule],
  template: `
    <div class="list-container">
      <div class="list-header">
        <h3 class="header-title">
          <span
            nz-icon
            nzType="team"
            nzTheme="outline"
            class="header-icon"
          ></span>
          Members
        </h3>
        @if (showManageButton()) {
          <button
            nz-button
            nzType="link"
            nzSize="small"
            (click)="manageMembers.emit()"
          >
            Manage
            <span nz-icon nzType="right" nzTheme="outline"></span>
          </button>
        }
      </div>

      <nz-list>
        @for (member of displayMembers(); track member.userId) {
          <nz-list-item>
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
        } @empty {
          <nz-list-item>
            <div class="empty-state">
              <span
                nz-icon
                nzType="team"
                nzTheme="outline"
                class="empty-icon"
              ></span>
              <p>No members yet</p>
            </div>
          </nz-list-item>
        }
      </nz-list>
    </div>
  `,
  styleUrl: './members-list-peak.component.css',
})
export class MembersListPeakComponent {
  membersList = input<GroupMember[]>([]);
  showManageButton = input<boolean>(false);
  manageMembers = output<void>();

  protected displayMembers() {
    return this.membersList().slice(0, 5);
  }
}
