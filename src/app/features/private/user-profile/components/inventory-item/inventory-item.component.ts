import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserInventoryItemDto } from '../../../../shared/models/user-profile/user-profile.models';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { RARITY_COLORS } from '../../../../shared/models/gamification/rarity.enum';
import { CommonModule } from '@angular/common';
import {
  ITEM_SLOT_NAMES,
  ItemSlotEnum,
} from '../../../../shared/models/gamification/item-slot.enum';

@Component({
  selector: 'app-inventory-item',
  imports: [NzCardModule, NzTagModule, NzBadgeModule, CommonModule],
  templateUrl: './inventory-item.component.html',
  styleUrl: './inventory-item.component.css',
})
export class InventoryItemComponent {
  @Input() item!: UserInventoryItemDto;
  @Output() itemClick = new EventEmitter<UserInventoryItemDto>();

  getRarityColor(): string {
    return RARITY_COLORS[
      this.item.item.rarity.id as keyof typeof RARITY_COLORS
    ];
  }

  onItemClick(): void {
    this.itemClick.emit(this.item);
  }

  protected getImagePath(): string {
    const itemSlot: ItemSlotEnum = this.item.item.itemSlot.id;
    const fileName = ITEM_SLOT_NAMES[itemSlot].toLocaleLowerCase();
    return `assets/${fileName}.png`;
  }
}
