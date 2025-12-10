import {Component, inject, input, signal} from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import {StoreApiService} from '../../../shared/services/store-api/store-api.service';
import {StoreItemDetailsDto} from '../../../shared/models/store/store.model';
import {NzSpinComponent} from 'ng-zorro-antd/spin';
import {RARITY_COLORS, RarityEnum} from '../../../shared/models/gamification/rarity.enum';
import {NgOptimizedImage, NgStyle} from '@angular/common';

@Component({
  selector: 'app-store-item-details',
  imports: [NzButtonModule, NzModalModule, NzSpinComponent, NgStyle, NgOptimizedImage],
  standalone: true,
  templateUrl: 'store-item-details.component.html',
  styleUrl:'store-item-details.component.css'
})
export class StoreItemDetailsComponent {

  itemId = input.required<string>()
  isVisible=signal<boolean>(false)
  loading= signal<boolean>(true)

  protected itemDetails!:StoreItemDetailsDto
  protected rarity!:RarityEnum

  private readonly storeService=inject(StoreApiService)


  handleOk(): void {
    this.loading.set(true)
    this.isVisible.set(false)

  }

  handleCancel(): void {
    this.loading.set(true)
    this.isVisible.set(false)

  }

  get rarityColor()
  {
    return RARITY_COLORS[this.rarity]

  }

  show()
  {
    this.isVisible.set(true);
    this.storeService.getItemDetails(this.itemId()).subscribe(
      {
        next:(content)=>
        {
          this.itemDetails= content
          this.rarity= this.itemDetails.rarity.id as RarityEnum
          this.loading.set(false)

        },
        error:(err)=>{
          console.log(err)
          this.loading.set(false)
          this.isVisible.set(false)
        }
      }
    )
  }

}
