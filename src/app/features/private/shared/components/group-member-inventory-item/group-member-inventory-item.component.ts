import {Component, input} from '@angular/core';
import {OwnedGroupItemModel} from '../../../../shared/models/group/owned-group-item.model';
import {NzCardComponent} from 'ng-zorro-antd/card';

@Component({
  selector: 'app-group-member-inventory-item',
  standalone: true,
  templateUrl: 'group-member-inventory-item.component.html',
  imports: [
    NzCardComponent
  ],
  styleUrl: 'group-member-inventory-item.component.css'
})

export class GroupMemberInventoryItemComponent
{

  item = input.required<OwnedGroupItemModel>()



}
