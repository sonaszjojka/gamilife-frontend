// store-filter-panel.component.ts

import { Component, inject, OnInit, output, signal } from '@angular/core';
import { StoreApiService } from '../../../shared/services/store-api/store-api.service';
import {
  ItemSlotDto,
  RarityDto,
} from '../../../shared/models/store/store.model';
import { FormsModule } from '@angular/forms'; // <-- Dodaj import FormsModule

interface SelectableItemSlotDto extends ItemSlotDto {
  selected?: boolean;
}
interface SelectableRarityDto extends RarityDto {
  selected?: boolean;
}

@Component({
  selector: 'app-store-filter-panel',
  styleUrl: 'store-filter-panel.component.css',
  templateUrl: 'store-filter-panel.component.html',
  standalone: true,
  imports: [FormsModule],
})
export class StoreFilterPanelComponent implements OnInit {
  itemSlots = signal<SelectableItemSlotDto[]>([]);
  rarities = signal<SelectableRarityDto[]>([]);

  public itemSlotChange = output<number[] | undefined>();
  public itemRarityChange = output<number[] | undefined>();

  storeApi = inject(StoreApiService);

  ngOnInit() {
    this.loadItemSlots();
    this.loadItemRarities();
  }

  private loadItemSlots(): void {
    this.storeApi.getItemSlots().subscribe({
      next: (slots) => {
        console.log('Item slots response:', slots);
        const selectableSlots = slots.itemSlots.map((slot) => ({
          ...slot,
          selected: false,
        }));
        this.itemSlots.set(selectableSlots);
      },
      error: (err) => console.error('Failed to load item slots:', err),
    });
  }

  private loadItemRarities(): void {
    this.storeApi.getRarities().subscribe({
      next: (rarities) => {
        const selectableRarities = rarities.itemRarities.map((rarity) => ({
          ...rarity,
          selected: false,
        }));
        this.rarities.set(selectableRarities);
      },
      error: (err) => console.error('Failed to load item rarities:', err),
    });
  }

  public onItemSlotChange(): void {
    const selectedIds = this.itemSlots()
      .filter((slot) => slot.selected)
      .map((slot) => slot.id);
    this.itemSlotChange.emit(selectedIds.length > 0 ? selectedIds : undefined);
  }

  public onItemRarityChange(): void {
    const selectedIds = this.rarities()
      .filter((rarity) => rarity.selected)
      .map((rarity) => rarity.id);
    this.itemRarityChange.emit(
      selectedIds.length > 0 ? selectedIds : undefined,
    );
  }
}
