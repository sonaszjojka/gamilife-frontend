import {
  Component,
  inject,
  OnInit, output,

  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import {ItemSlotDto, RarityDto} from '../../../../shared/models/store/store.model';
import {StoreApiService} from '../../../../shared/services/store-api/store-api.service';

@Component({
  selector: 'app-store-input-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzSelectModule,
  ],
templateUrl:'store-input-search.component.html',
styleUrl:'store-input-search.component.css'
})
export class StoreInputSearchComponent implements OnInit {
   itemSlots = signal<ItemSlotDto[]>([]);
   rarities = signal<RarityDto[]>([])

   selectedItemSlotId?: number;
   selectedItemRarityId?:number;

  readonly value = signal('');

  protected storeApi = inject(StoreApiService);

  public inputChange = output<string>();
  public itemSlotChange = output<number|undefined>();
  public itemRarityChange = output<number|undefined>();

  ngOnInit(): void {
    this.loadItemSlots();
    this.loadItemRarities()
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
    this.inputChange.emit(this.value());
  }

  onItemSlotChange(newSlotId: number | undefined) {
    this.itemSlotChange.emit(newSlotId);
  }

  onItemRarityChange(newTypeId: number | undefined) {
    this.itemRarityChange.emit(newTypeId);
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

  resetFilters(): void {
    this.value.set('');
    this.inputChange.emit('');
    this.itemSlotChange.emit(undefined);
    this.itemRarityChange.emit(undefined);
  }
}
