import { Component, inject, OnInit, signal } from '@angular/core';
import { StoreApiService } from '../../../shared/services/store-api/store-api.service';
import {
  StoreFiltersModel,
  StoreItemDto,
} from '../../../shared/models/store/store.model';
import { StoreInputSearchComponent } from '../store-input-search/store-input-search.component';
import { PaginationMoreComponent } from '../../shared/components/pagination-more/pagination-more.component';
import { StoreItemListComponent } from '../store-item-list/store-item-list.component';
import {StoreFilterPanelComponent} from '../store-filter-panel/store-filter-panel.component';

@Component({
  selector: 'app-store-page',
  templateUrl: 'store-page.component.html',
  styleUrl: 'store-page.component.css',
  imports: [
    StoreInputSearchComponent,
    PaginationMoreComponent,
    StoreItemListComponent,
    StoreFilterPanelComponent,
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

  ngOnInit() {
    this.loadItems(0);
  }

  loadItems(page: number) {
    const params: StoreFiltersModel = {
      page: page,
      size: 12,
      itemName: this.itemName(),
      itemSlot: this.itemSlot(),
      rarity: this.rarity(),
    };

    this.storeApi.getFilteredItems(params).subscribe({
      next: (response) => {
        this.items.set(response.content);
        this.totalPages.set(response.totalPages - 1);
        this.currentPage.set(page);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onPageChange(page: number) {
    this.loadItems(page);
  }
  onInputChange(itemName: string) {
    this.itemName.set(itemName);
    this.loadItems(0);
  }
  onItemSlotChange(itemSlotId: number[] | undefined) {
    this.itemSlot.set(itemSlotId);
    this.loadItems(0);
  }
  onItemRarityChange(rarityId: number[] | undefined) {
    this.rarity.set(rarityId);
    this.loadItems(0);
  }
}
