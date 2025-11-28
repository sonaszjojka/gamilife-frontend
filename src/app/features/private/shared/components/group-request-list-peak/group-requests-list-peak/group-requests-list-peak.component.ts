import { Component, input, output } from '@angular/core';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { GroupRequest } from '../../../../../shared/models/group/group-request.model';
import { formatRelativeDate } from '../../../../../../shared/util/DateFormatterUtil';

@Component({
  selector: 'app-group-requests-list-peak',
  standalone: true,
  imports: [CommonModule, NzListModule, NzIconModule, NzButtonModule],
  template: `
    <div class="list-container">
      <div class="list-header">
        <h3 class="header-title">
          <span
            nz-icon
            nzType="inbox"
            nzTheme="outline"
            class="header-icon"
          ></span>
          Group Requests
        </h3>
        @if (showManageButton()) {
          <button
            nz-button
            nzType="link"
            nzSize="small"
            (click)="manageRequests.emit()"
          >
            Manage
            <span nz-icon nzType="right" nzTheme="outline"></span>
          </button>
        }
      </div>

      <nz-list>
        @for (request of displayRequests(); track request.groupRequestId) {
          <nz-list-item>
            <div class="request-item">
              <div class="user-info">
                <span class="username">{{ request.username }}</span>
                <span class="request-date"
                  >Sent: {{ formatDate(request.createdAt) }}</span
                >
              </div>
              <div class="status">
                <span
                  class="status-badge"
                  [class.status-pending]="
                    request.groupRequestStatus.groupRequestStatusId === 1
                  "
                  [class.status-approved]="
                    request.groupRequestStatus.groupRequestStatusId === 2
                  "
                  [class.status-rejected]="
                    request.groupRequestStatus.groupRequestStatusId === 3
                  "
                >
                  {{ request.groupRequestStatus.title }}
                </span>
              </div>
            </div>
          </nz-list-item>
        } @empty {
          <nz-list-item>
            <div class="empty-state">
              <span
                nz-icon
                nzType="inbox"
                nzTheme="outline"
                class="empty-icon"
              ></span>
              <p>No pending requests</p>
            </div>
          </nz-list-item>
        }
      </nz-list>
    </div>
  `,
  styleUrl: './group-requests-list-peak.component.css',
})
export class GroupRequestsListPeakComponent {
  requestsList = input<GroupRequest[]>([]);
  showManageButton = input<boolean>(false);
  manageRequests = output<void>();

  protected displayRequests() {
    return this.requestsList().slice(0, 5);
  }

  formatDate(dateString: string): string {
    console.log('my date: ', dateString);
    return formatRelativeDate(dateString);
  }
}
