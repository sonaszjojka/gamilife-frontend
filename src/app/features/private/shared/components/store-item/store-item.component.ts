import {Component, input, OnInit} from '@angular/core';
import {StoreItemDto} from '../../../../shared/models/store/store.model';
import {NzCardComponent} from 'ng-zorro-antd/card';

@Component({
  selector: 'app-store-item',
  templateUrl: 'store-item.component.html',
  styleUrl: 'store-item.component.css',
  imports: [
    NzCardComponent
  ],
  standalone: true
})

export class StoreItemComponent implements OnInit{

  item=input<StoreItemDto>();
  ngOnInit() {
    console.log(this.item())
  }

}
