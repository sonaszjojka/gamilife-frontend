import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { GroupApiService } from '../../../shared/services/groups-api/group-api.service';
import { GroupMember } from '../../../shared/models/group/group-member.model';
import { FullRankingComponent } from '../components/full-ranking/full-ranking.component';
import { NotificationService } from '../../../shared/services/notification-service/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BackButtonComponent } from '../../shared/components/back-button/back-button-component';

@Component({
  selector: 'app-group-ranking',
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    FullRankingComponent,
    BackButtonComponent,
  ],
  templateUrl: './group-ranking-page.component.html',
  styleUrl: './group-ranking-page.component.css',
})
export class GroupRankingPageComponent implements OnInit {
  protected members = signal<GroupMember[]>([]);
  protected loading = signal<boolean>(true);
  protected groupName = signal<string | undefined>(undefined);

  private readonly groupApi = inject(GroupApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const groupId = this.route.snapshot.paramMap.get('groupId');
    if (!groupId) {
      this.router.navigate(['/app/community']);
      return;
    }

    this.loadGroupData(groupId);
  }

  private loadGroupData(groupId: string): void {
    this.loading.set(true);

    this.groupApi
      .getGroupById(groupId, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (group) => {
          this.groupName.set(group.groupName);
          this.members.set(group.membersSortedDescByTotalEarnedMoney);
          this.loading.set(false);
        },
        error: (err) => {
          this.notification.handleApiError(err, 'Failed to load group ranking');
          this.loading.set(false);
        },
      });
  }

  protected goBack(): void {
    const groupId = this.route.snapshot.paramMap.get('groupId');
    if (groupId) {
      this.router.navigate([`/app/community/groups/${groupId}`]);
    } else {
      this.router.navigate(['/app/community/groups']);
    }
  }
}
