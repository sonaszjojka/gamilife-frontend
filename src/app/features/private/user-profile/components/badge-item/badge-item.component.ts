import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { UserInventoryItemDto } from '../../../../shared/models/user-profile/user-profile.models';
import { RARITY_COLORS } from '../../../../shared/models/gamification/rarity.enum';

@Component({
  selector: 'app-badge-item',
  standalone: true,
  imports: [CommonModule, NzToolTipModule, NzTagModule],
  templateUrl: './badge-item.component.html',
  styleUrl: './badge-item.component.css',
})
export class BadgeItemComponent {
  @Input() item!: UserInventoryItemDto;

  getRarityColor(): string {
    const color =
      RARITY_COLORS[this.item.item.rarity.id as keyof typeof RARITY_COLORS];
    return color || '#d9d9d9';
  }

  getImagePath(): string {
    const path = 'assets/badge.png';
    return path;
  }
}
