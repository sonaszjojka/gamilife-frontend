import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { GroupRequestApiService } from '../../../../shared/services/group-request-api/group-request-api.service';
import { GroupRequest } from '../../../../shared/models/group-request.model';
import { GroupRequestsListComponent } from '../group-requests-list/group-requests-list.component';
import { take } from 'rxjs/operators';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-group-requests-page',
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    NzCardModule,
    GroupRequestsListComponent,
    NzModalModule,
    NzIconModule,
  ],
  templateUrl: './group-requests-page.component.html',
  styles: [
    `
      .page-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--spacing-large);
        font-family: var(--main-font);
      }

      .page-header {
        margin-bottom: var(--spacing-large);
      }

      .page-title {
        font-size: 32px;
        font-weight: var(--font-weight-bold);
        color: var(--text-primary-color);
        margin: var(--spacing-medium) 0 var(--spacing-xs) 0;
        display: flex;
        align-items: center;
        gap: var(--spacing-small);
      }

      @media (max-width: 768px) {
        .page-container {
          padding: var(--spacing-medium);
        }

        .page-title {
          font-size: 24px;
        }
      }

      ::ng-deep .ranking-card .ant-card-body {
        padding: var(--spacing-large);
      }

      td:last-child {
        text-align: center;
      }

      ::ng-deep .ant-table-thead > tr > th:last-child {
        text-align: center;
      }
    `,
  ],
})
export class GroupRequestsPageComponent implements OnInit {
  private readonly groupRequestApi = inject(GroupRequestApiService);
  private readonly route = inject(ActivatedRoute);

  groupId = signal<string>('');
  groupName = signal<string>('');
  requests = signal<GroupRequest[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('groupId');
    if (!id) return;

    this.groupId.set(id);
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading.set(true);

    this.groupRequestApi
      .getPendingGroupRequests(this.groupId(), 0, 100)
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.requests.set(result.content || []);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load requests:', err);
          this.loading.set(false);
        },
      });
  }
}
