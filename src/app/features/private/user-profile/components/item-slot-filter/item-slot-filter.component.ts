import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

import {
  RARITY_NAMES,
  RarityEnum,
} from '../../../../shared/models/gamification/rarity.enum';
import {
  EQUIPPABLE_SLOTS,
  ITEM_SLOT_NAMES,
  ItemSlotEnum,
} from '../../../../shared/models/gamification/item-slot.enum';

@Component({
  selector: 'app-item-slot-filter',
  imports: [
    CommonModule,
    FormsModule,
    NzSpaceModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzIconModule,
  ],
  standalone: true,
  templateUrl: './item-slot-filter.component.html',
  styleUrl: './item-slot-filter.component.css',
})
export class ItemSlotFilterComponent {
  @Input() showClearButton = true;
  @Output() filterChange = new EventEmitter<{
    itemName?: string;
    itemSlot?: number;
    rarity?: number;
  }>();

  searchText = '';
  selectedSlot?: number;
  selectedRarity?: number;

  equippableSlots = EQUIPPABLE_SLOTS;
  rarities = [
    RarityEnum.COMMON,
    RarityEnum.UNCOMMON,
    RarityEnum.RARE,
    RarityEnum.EPIC,
    RarityEnum.LEGENDARY,
  ];

  getSlotName(slot: ItemSlotEnum): string {
    return ITEM_SLOT_NAMES[slot];
  }

  getRarityName(rarity: RarityEnum): string {
    return RARITY_NAMES[rarity];
  }

  onSearchChange(): void {
    this.emitFilterChange();
  }

  onSlotChange(): void {
    this.emitFilterChange();
  }

  onRarityChange(): void {
    this.emitFilterChange();
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedSlot = undefined;
    this.selectedRarity = undefined;
    this.emitFilterChange();
  }

  private emitFilterChange(): void {
    this.filterChange.emit({
      itemName: this.searchText || undefined,
      itemSlot: this.selectedSlot,
      rarity: this.selectedRarity,
    });
  }
}
