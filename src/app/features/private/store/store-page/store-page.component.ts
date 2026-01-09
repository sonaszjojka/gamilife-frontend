import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { StoreApiService } from '../../../shared/services/store-api/store-api.service';
import {
  StoreFiltersModel,
  StoreItemDto,
} from '../../../shared/models/store/store.model';
import { PaginationMoreComponent } from '../../shared/components/pagination-more/pagination-more.component';
import { StoreItemListComponent } from '../store-item-list/store-item-list.component';
import { StoreFilterPanelComponent } from '../store-filter-panel/store-filter-panel.component';
import { NotificationService } from '../../../shared/services/notification-service/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzPageHeaderComponent } from 'ng-zorro-antd/page-header';
import { DashboardInputSearchComponent } from '../../shared/components/dashboard-input-search/dashboard-input-search.component';

@Component({
  selector: 'app-store-page',
  templateUrl: 'store-page.component.html',
  styleUrl: 'store-page.component.css',
  imports: [
    PaginationMoreComponent,
    StoreItemListComponent,
    StoreFilterPanelComponent,
    NzPageHeaderComponent,
    DashboardInputSearchComponent,
  ],

  standalone: true,
})
export class StorePageComponent implements OnInit {
  items = signal<StoreItemDto[]>([]);
  totalPages = signal<number>(0);
  currentPage = signal<number>(0);
  itemName = signal<string | undefined>(undefined);
  itemSlot = signal<number[] | undefined>(undefined);
  rarity = signal<number[] | undefined>(undefined);

  private readonly storeApi = inject(StoreApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.loadItems(1);
  }

  loadItems(page: number) {
    page--;
    const params: StoreFiltersModel = {
      page: page,
      size: 12,
      itemName: this.itemName(),
      itemSlot: this.itemSlot(),
      rarity: this.rarity(),
    };

    this.storeApi
      .getFilteredItems(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.items.set(response.content);
          this.totalPages.set(response.totalPages);
          this.currentPage.set(page);
        },
        error: () => {
          this.notificationService.error('Failed to load store items');
        },
      });
  }

  onPageChange(page: number) {
    this.loadItems(page);
  }

  onInputChange(itemName: string) {
    this.itemName.set(itemName);
    this.loadItems(1);
  }

  onItemSlotChange(itemSlotId: number[] | undefined) {
    this.itemSlot.set(itemSlotId);
    this.loadItems(1);
  }

  onItemRarityChange(rarityId: number[] | undefined) {
    this.rarity.set(rarityId);
    this.loadItems(1);
  }
}
