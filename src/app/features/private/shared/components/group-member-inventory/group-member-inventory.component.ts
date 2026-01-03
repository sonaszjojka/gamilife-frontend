import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzListComponent, NzListItemComponent } from 'ng-zorro-antd/list';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { GroupMemberInventoryApiService } from '../../../../shared/services/group-member-inventory-api/group-member-inventory-api.service';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OwnedGroupItemModel } from '../../../../shared/models/group/owned-group-item.model';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzEmptyComponent } from 'ng-zorro-antd/empty';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { GroupMemberInventoryItemComponent } from '../group-member-inventory-item/group-member-inventory-item.component';
import { CommonModule } from '@angular/common';
import { GroupPreviewMode } from '../../../../shared/models/group/group-preview-mode';

@Component({
  selector: 'app-group-member-inventory',
  standalone: true,
  templateUrl: 'group-member-inventory.component.html',
  imports: [
    CommonModule,
    NzDrawerModule,
    NzButtonComponent,
    NzListItemComponent,
    NzIconDirective,
    NzSpinComponent,
    NzListComponent,
    NzEmptyComponent,
    NzPaginationComponent,
    GroupMemberInventoryItemComponent,
  ],
  styleUrl: 'group-member-inventory.component.css',
})
export class GroupMemberInventoryComponent {
  visible = signal<boolean>(false);
  isUsedUp = signal<boolean>(false);

  groupId = input.required<string>();
  memberId = input.required<string>();

  mode = input.required<GroupPreviewMode>();

  currentPage = signal<number>(1);
  totalPages = signal<number>(0);
  loading = signal<boolean>(true);

  items = signal<OwnedGroupItemModel[]>([]);

  private readonly groupMemberInventoryApi = inject(
    GroupMemberInventoryApiService,
  );
  private readonly notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  close() {
    this.visible.set(false);
  }

  show() {
    this.visible.set(true);
    this.load(1);
  }

  load(page: number) {
    this.loading.set(true);
    page--;

    this.groupMemberInventoryApi
      .getMemberInventory(
        this.groupId(),
        this.memberId(),
        this.isUsedUp(),
        page,
        10,
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.items.set(response.content);
          this.currentPage.set(page);
          this.totalPages.set(response.totalPages);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.notificationService.error('Error occurred during loading items');
        },
      });
  }

  toggleUsedUpItems() {
    this.isUsedUp.set(!this.isUsedUp());
    this.load(1);
  }

  onPageChange(page: number) {
    this.load(page);
  }
}
