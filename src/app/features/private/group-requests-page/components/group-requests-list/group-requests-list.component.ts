import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { GroupRequest } from '../../../../shared/models/group/group-request.model';
import { GroupRequestApiService } from '../../../../shared/services/group-request-api/group-request-api.service';
import { take } from 'rxjs/operators';
import { PaginationMoreComponent } from '../../../shared/components/pagination-more/pagination-more.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';

@Component({
  selector: 'app-group-requests-list',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzEmptyModule,
    PaginationMoreComponent,
    NzModalModule,
  ],
  templateUrl: './group-requests-list.component.html',
  styleUrl: './group-requests-list.component.css',
})
export class GroupRequestsListComponent {
  groupId = input.required<string>();
  requests = input<GroupRequest[]>([]);
  loading = input<boolean>(false);

  requestChanged = output<void>();

  currentPage = signal<number>(1);
  pageSize = 12;

  private readonly groupRequestApi = inject(GroupRequestApiService);
  private readonly modal = inject(NzModalService);
  private readonly notification = inject(NotificationService);

  paginatedRequests = () => {
    const requests = this.requests();
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return requests.slice(start, end);
  };

  totalPages = () => {
    const total = this.requests().length;
    return Math.ceil(total / this.pageSize);
  };

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  confirmApprove(request: GroupRequest): void {
    this.modal.confirm({
      nzTitle: 'Approve Request',
      nzContent: `Are you sure you want to approve the request from ${request.username}?`,
      nzOkText: 'Approve',
      nzOkType: 'primary',
      nzCancelText: 'Cancel',
      nzOnOk: () => this.approveRequest(request),
    });
  }

  confirmReject(request: GroupRequest): void {
    this.modal.confirm({
      nzTitle: 'Reject Request',
      nzContent: `Are you sure you want to reject the request from ${request.username}?`,
      nzOkText: 'Reject',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () => this.rejectRequest(request),
    });
  }

  private approveRequest(request: GroupRequest): void {
    this.groupRequestApi
      .approveGroupRequest(this.groupId(), request.groupRequestId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.notification.success(
            `Request from ${request.username} approved successfully`,
          );
          this.currentPage.set(1);
          this.requestChanged.emit();
        },
        error: (err) => {
          this.notification.handleApiError(err, 'Failed to approve request');
        },
      });
  }

  private rejectRequest(request: GroupRequest): void {
    this.groupRequestApi
      .rejectGroupRequest(this.groupId(), request.groupRequestId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.notification.success(
            `Request from ${request.username} rejected`,
          );
          this.currentPage.set(1);
          this.requestChanged.emit();
        },
        error: (err) => {
          this.notification.handleApiError(err, 'Failed to reject request');
        },
      });
  }
}
