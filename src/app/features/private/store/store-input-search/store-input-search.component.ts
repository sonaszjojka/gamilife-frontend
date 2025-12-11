import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import {
  ItemSlotDto,
  RarityDto,
} from '../../../shared/models/store/store.model';
import { StoreApiService } from '../../../shared/services/store-api/store-api.service';

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
  templateUrl: 'store-input-search.component.html',
  styleUrl: 'store-input-search.component.css',
})
export class StoreInputSearchComponent {
  itemSlots = signal<ItemSlotDto[]>([]);
  rarities = signal<RarityDto[]>([]);

  selectedItemSlotId?: number;
  selectedItemRarityId?: number;

  readonly value = signal('');


  public inputChange = output<string>();
  public itemSlotChange = output<number[] | undefined>();
  public itemRarityChange = output<number[] | undefined>();


  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
    this.inputChange.emit(this.value());
  }


}
