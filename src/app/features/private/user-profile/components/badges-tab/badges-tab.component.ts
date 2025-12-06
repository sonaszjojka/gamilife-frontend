import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { BadgeItemComponent } from '../badge-item/badge-item.component';
import { UserInventoryItemDto } from '../../../../shared/models/user-profile/user-profile.models';
import { UserInventoryService } from '../../../../shared/services/user-inventory-api/user-inventory-api.service';
import { ItemSlotEnum } from '../../../../shared/models/gamification/item-slot.enum';

@Component({
  selector: 'app-badges-tab',
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    BadgeItemComponent,
    NzEmptyModule,
    NzPaginationModule,
  ],
  templateUrl: './badges-tab.component.html',
  styleUrl: './badges-tab.component.css',
})
export class BadgesTabComponent implements OnInit {
  @Input() userId!: string;

  badges: UserInventoryItemDto[] = [];
  loading = false;
  currentPage = 0;
  pageSize = 12;
  totalElements = 0;
  totalPages = 0;

  protected inventoryService = inject(UserInventoryService);

  ngOnInit(): void {
    this.loadBadges();
  }

  loadBadges(): void {
    this.loading = true;
    this.inventoryService
      .getUserInventoryItems(this.userId, {
        itemSlot: ItemSlotEnum.BADGE,
        page: this.currentPage,
        size: this.pageSize,
      })
      .subscribe({
        next: (result) => {
          this.badges = result.content;
          this.totalElements = result.totalElements;
          this.totalPages = result.totalPages;
          this.currentPage = result.currentPage;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading badges:', error);
          this.loading = false;
        },
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page - 1;
    this.loadBadges();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadBadges();
  }

  trackByBadgeId(index: number, item: UserInventoryItemDto): string {
    return item.id;
  }
}
