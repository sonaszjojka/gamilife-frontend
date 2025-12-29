import {Component, inject, input, output, ViewChild} from '@angular/core';
import {GroupItemModel} from '../../../../shared/models/group/group-item.model';
import {GroupPreviewMode} from '../../../../shared/models/group/group-preview-mode';
import {GroupItemFormComponent} from '../group-item-form/group-item-form.component';
import {GroupItemApiService} from '../../../../shared/services/group-item-api/group-item-api.service';
import {NotificationService} from '../../../../shared/services/notification-service/notification.service';
import {Group} from '../../../../shared/models/group/group.model';
import {GroupShopModel} from '../../../../shared/models/group/group-shop.model';

@Component({
  selector: 'app-group-item',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.scss'],
  standalone: true,
  imports: [
    GroupItemFormComponent
  ]
})

export class GroupItemComponent {

  listChanged=output<void>()

  item = input.required<GroupItemModel>();
  group = input.required<Group>();
  viewMode = input.required<GroupPreviewMode>();
  groupShop=input.required<GroupShopModel>();

  groupItemApi =inject(GroupItemApiService)
  notificationService = inject(NotificationService)

  @ViewChild(GroupItemFormComponent)
  itemFormComponent!:GroupItemFormComponent




  onEdit(){
    this.itemFormComponent.openForm()
  }

  onDelete(){

    this.groupItemApi.deleteGroupItem(this.group().groupId,this.groupShop().id,this.item().id).subscribe({
      next:()=>{
        this.notificationService.success("Item deleted successfully")
        this.listChanged.emit()
      },
      error:(error)=>{
        console.log(error)
        this.notificationService.error("Failed to delete item")
      }
    })


  }

  onPurchase(){



  }

  onFormSubmitted($event: void) {

    this.listChanged.emit()
  }

}
