import { Component, DestroyRef, inject, input, output } from '@angular/core';
import {
  OwnedGroupItemModel,
  OwnedGroupItemRequestModel,
} from '../../../../shared/models/group/owned-group-item.model';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { GroupMemberInventoryApiService } from '../../../../shared/services/group-member-inventory-api/group-member-inventory-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';
import { GroupPreviewMode } from '../../../../shared/models/group/group-preview-mode';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-group-member-inventory-item',
  standalone: true,
  templateUrl: 'group-member-inventory-item.component.html',
  imports: [NzCardComponent, NzTagComponent, DatePipe],
  styleUrl: 'group-member-inventory-item.component.css',
})
export class GroupMemberInventoryItemComponent {
  item = input.required<OwnedGroupItemModel>();
  groupId = input.required<string>();
  memberId = input.required<string>();
  mode = input.required<GroupPreviewMode>();
  actionPerformed = output<void>();

  private readonly inventoryApi = inject(GroupMemberInventoryApiService);
  private readonly notificationApi = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  useItem() {
    const request: OwnedGroupItemRequestModel = { isUsedUp: true };
    this.inventoryApi
      .useMemberItem(this.groupId(), this.memberId(), this.item().id, request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.item().usedAt = response.usedAt;
          this.notificationApi.success('Item used successfully');
          this.actionPerformed.emit();
        },
        error: () => {
          this.notificationApi.error('Error occurred while using this item');
        },
      });
  }

  deleteItem() {
    this.inventoryApi
      .deleteMemberInventoryItem(
        this.groupId(),
        this.memberId(),
        this.item().id,
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationApi.success(
            'Successfully deleted item from inventory',
          );
          this.actionPerformed.emit();
        },
        error: () => {
          this.notificationApi.error(
            'Error occurred during inventory item delete',
          );
        },
      });
  }

  protected readonly GroupPreviewMode = GroupPreviewMode;
}
