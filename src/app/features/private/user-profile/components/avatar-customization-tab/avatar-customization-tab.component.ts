import {Component, DestroyRef, inject, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserInventoryItemDto } from '../../../../shared/models/user-profile/user-profile.models';
import { UserInventoryService } from '../../../../shared/services/user-inventory-api/user-inventory-api.service';
import { ProfileViewMode } from '../../../../shared/models/user-profile/profile-view-mode.enum';
import { ItemSlotFilterComponent } from '../item-slot-filter/item-slot-filter.component';
import { InventoryItemComponent } from '../inventory-item/inventory-item.component';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-avatar-customization-tab',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzButtonModule,
    NzSpinModule,
    NzEmptyModule,
    NzPaginationModule,
    NzIconModule,
    ItemSlotFilterComponent,
    InventoryItemComponent,
  ],
  templateUrl: './avatar-customization-tab.component.html',
  styleUrl: './avatar-customization-tab.component.css',
})
export class AvatarCustomizationTabComponent implements OnInit {
  @Input() userId!: string;
  @Input() viewMode!: ProfileViewMode;

  ProfileViewMode = ProfileViewMode;
  items: UserInventoryItemDto[] = [];
  loading = false;
  currentPage = 0;
  pageSize = 6;
  totalElements = 0;
  totalPages = 0;

  currentFilter: {
    itemName?: string;
    itemSlot?: number;
    rarity?: number;
  } = {};

  protected inventoryService = inject(UserInventoryService);
  private readonly notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef)

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.inventoryService
      .getUserInventoryItems(this.userId, {
        ...this.currentFilter,
        page: this.currentPage,
        size: this.pageSize,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.items = result.content;
          this.totalElements = result.totalElements;
          this.totalPages = result.totalPages;
          this.currentPage = result.currentPage;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.notificationService.handleApiError(
            error,
            'Failed to load inventory items',
          );
        },
      });
  }

  onFilterChange(filter: {
    itemName?: string;
    itemSlot?: number;
    rarity?: number;
  }): void {
    this.currentFilter = filter;
    this.currentPage = 0;
    this.loadItems();
  }

  onPageChange(page: number): void {
    this.currentPage = page - 1;
    this.loadItems();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadItems();
  }

  onItemClick(item: UserInventoryItemDto): void {
    if (this.viewMode === ProfileViewMode.OWNER) {
      console.error(item, 'implement equipping item!');
    }
  }
}
