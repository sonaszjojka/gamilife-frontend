import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { StoreItemDto } from '../../../../shared/models/store/store.model';
import { StoreItemComponent } from '../store-item/store-item.component';
@Component({
  selector: 'app-store-item-list',
  standalone: true,
  imports: [CommonModule, NzGridModule, StoreItemComponent],
  template: `
    <div nz-row [nzGutter]="[16, 16]" nzJustify="start">
      @for (item of items(); track item.id) {
        <div
          nz-col
          [nzXs]="24"
          [nzSm]="24"
          [nzMd]="12"
          [nzLg]="8"
          [nzXl]="6"
          [nzXXl]="4"
          class="store-col"
        >
          <app-store-item [item]="item">
            <ng-content></ng-content>
          </app-store-item>
        </div>
      }
    </div>
  `,
})
export class StoreItemListComponent {
  items = input.required<StoreItemDto[]>();
}
