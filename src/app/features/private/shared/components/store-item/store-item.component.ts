import {Component, inject, input} from '@angular/core';
import {StoreItemDto} from '../../../../shared/models/store/store.model';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {StoreApiService} from '../../../../shared/services/store-api/store-api.service';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NgOptimizedImage, NgStyle} from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import {RARITY_COLORS, RarityEnum} from '../../../../shared/models/gamification/rarity.enum';

@Component({
  selector: 'app-store-item',
  templateUrl: 'store-item.component.html',
  styleUrl: 'store-item.component.css',
  imports: [
    NzCardComponent,
    NzButtonComponent,
    NgOptimizedImage,
    NgStyle
  ],
  standalone: true
})

export class StoreItemComponent{

  item=input.required<StoreItemDto>();

  private readonly storeApi = inject(StoreApiService)
  private readonly messageService=inject(NzMessageService)

  get borderColor() {
    return RARITY_COLORS[this.item().rarity.id as RarityEnum];
  }

  onPurchase()
  {
    this.storeApi.purchaseItem(this.item().id).subscribe(
      {
        next:()=>
        {
          this.messageService.success('Successfully bought an item');

        },
        error:(err)=>
        {
          this.messageService.error('Could not buy and item');
        }
      }
    )

  }

}
