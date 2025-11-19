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

@Component({
  selector: 'app-group-requests-page',
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    NzCardModule,
    GroupRequestsListComponent,
    NzModalModule,
  ],
  templateUrl: './group-requests-page.component.html',
  styles: [
    `
      .requests-page-container {
        padding: var(--spacing-large);
        max-width: 1200px;
        margin: 0 auto;
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
