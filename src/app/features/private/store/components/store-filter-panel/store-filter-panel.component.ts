import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { StoreApiService } from '../../../../shared/services/store-api/store-api.service';
import {
  ItemSlotDto,
  RarityDto,
} from '../../../../shared/models/store/store.model';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzDividerComponent } from 'ng-zorro-antd/divider';

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
  imports: [FormsModule, NzDividerComponent],
})
export class StoreFilterPanelComponent implements OnInit {
  itemSlots = signal<SelectableItemSlotDto[]>([]);
  rarities = signal<SelectableRarityDto[]>([]);

  public itemSlotChange = output<number[] | undefined>();
  public itemRarityChange = output<number[] | undefined>();

  private readonly storeApi = inject(StoreApiService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.loadItemSlots();
    this.loadItemRarities();
  }

  private loadItemSlots(): void {
    this.storeApi
      .getItemSlots()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (slots) => {
          const selectableSlots = slots.itemSlots.map((slot) => ({
            ...slot,
            selected: false,
          }));
          this.itemSlots.set(selectableSlots);
        },
      });
  }

  private loadItemRarities(): void {
    this.storeApi
      .getRarities()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rarities) => {
          const selectableRarities = rarities.itemRarities.map((rarity) => ({
            ...rarity,
            selected: false,
          }));
          this.rarities.set(selectableRarities);
        },
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
