import {Component, inject, input, ViewChild} from '@angular/core';
import {StoreItemDto} from '../../../../shared/models/store/store.model';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {StoreApiService} from '../../../../shared/services/store-api/store-api.service';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NgOptimizedImage} from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-store-item',
  templateUrl: 'store-item.component.html',
  styleUrl: 'store-item.component.css',
  imports: [
    NzCardComponent,
    NzButtonComponent,
    NgOptimizedImage
  ],
  standalone: true
})

export class StoreItemComponent{

  item=input.required<StoreItemDto>();

  private readonly storeApi = inject(StoreApiService)
  private readonly messageService=inject(NzMessageService)

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
