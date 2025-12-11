import {Component, inject, OnInit, signal} from '@angular/core';
import {StoreApiService} from '../../../shared/services/store-api/store-api.service';
import {ItemSlotDto, RarityDto} from '../../../shared/models/store/store.model';

@Component({
  selector:'app-store-filter-panel',
  styleUrl:'store-filter-panel.component.css',
  templateUrl: 'store-filter-panel.component.html',
  standalone:true
})

export class StoreFilterPanelComponent implements OnInit
{

  itemSlots = signal<ItemSlotDto[]>([]);
  rarities = signal<RarityDto[]>([])

  storeApi = inject(StoreApiService)





  ngOnInit() {

    this.loadItemSlots();
    this.loadItemRarities();

  }

  private loadItemSlots(): void {
    this.storeApi.getItemSlots().subscribe({
      next: (slots) =>
      {
        console.log('Item slots response:', slots);
        this.itemSlots.set(slots.itemSlots)
      },
      error: (err) => console.error('Failed to load group item slots:', err),
    });
  }

  private loadItemRarities(): void {
    this.storeApi.getRarities().subscribe({
      next: (rarities) => this.rarities.set(rarities.itemRarities),
      error: (err) => console.error('Failed to load group item slots:', err),
    });
  }


}
