import { Component, DestroyRef, inject, input, signal } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { StoreApiService } from '../../../../shared/services/store-api/store-api.service';
import { StoreItemDetailsDto } from '../../../../shared/models/store/store.model';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import {
  RARITY_COLORS,
  RarityEnum,
} from '../../../../shared/models/gamification/rarity.enum';
import { NgOptimizedImage } from '@angular/common';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-store-item-details',
  imports: [
    NzButtonModule,
    NzModalModule,
    NzIconModule,
    NzSpinComponent,
    NgOptimizedImage,
  ],
  standalone: true,
  templateUrl: 'store-item-details.component.html',
  styleUrl: 'store-item-details.component.css',
})
export class StoreItemDetailsComponent {
  itemId = input.required<string>();
  isVisible = signal<boolean>(false);
  loading = signal<boolean>(true);

  protected itemDetails!: StoreItemDetailsDto;
  protected rarity!: RarityEnum;

  private readonly storeService = inject(StoreApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  handleOk(): void {
    this.loading.set(true);
    this.isVisible.set(false);
  }

  handleCancel(): void {
    this.loading.set(true);
    this.isVisible.set(false);
  }

  get rarityColor() {
    return RARITY_COLORS[this.rarity];
  }

  show() {
    this.isVisible.set(true);
    this.storeService
      .getItemDetails(this.itemId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (content) => {
          this.itemDetails = content;
          this.rarity = this.itemDetails.rarity.id as RarityEnum;
          this.loading.set(false);
        },
        error: (error) => {
          this.loading.set(false);
          this.isVisible.set(false);
          this.notificationService.handleApiError(
            error,
            'Failed to load item details',
          );
        },
      });
  }
}
