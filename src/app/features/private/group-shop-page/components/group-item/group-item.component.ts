import {Component, DestroyRef, inject, input, output, ViewChild} from '@angular/core';
import {GroupItemModel} from '../../../../shared/models/group/group-item.model';
import {GroupPreviewMode} from '../../../../shared/models/group/group-preview-mode';
import {GroupItemFormComponent} from '../group-item-form/group-item-form.component';
import {GroupItemApiService} from '../../../../shared/services/group-item-api/group-item-api.service';
import {NotificationService} from '../../../../shared/services/notification-service/notification.service';
import {Group} from '../../../../shared/models/group/group.model';
import {GroupShopModel} from '../../../../shared/models/group/group-shop.model';
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {
  GroupMemberInventoryApiService
} from '../../../../shared/services/group-member-inventory-api/group-member-inventory-api.service';
import {OwnedGroupItemRequestModel} from '../../../../shared/models/group/owned-group-item.model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {NzButtonComponent} from 'ng-zorro-antd/button';

@Component({
  selector: 'app-group-item',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.css'],
  standalone: true,
  imports: [
    GroupItemFormComponent,
    NzCardComponent,
    NzIconDirective,
    NzCardMetaComponent,
    NzTagComponent,
    NzButtonComponent
  ]
})

export class GroupItemComponent {

  listChanged=output<void>()

  item = input.required<GroupItemModel>();
  group = input.required<Group>();
  viewMode = input.required<GroupPreviewMode>();
  groupShop=input.required<GroupShopModel>();
  private destroyRef = inject(DestroyRef)
  private readonly groupItemApi =inject(GroupItemApiService)
  private readonly ownedGroupItemApi = inject(GroupMemberInventoryApiService)
  private readonly notificationService = inject(NotificationService)

  @ViewChild(GroupItemFormComponent)
  itemFormComponent!:GroupItemFormComponent

  onEdit(){
    this.itemFormComponent.openForm()
  }

  onDelete(){

    this.groupItemApi.deleteGroupItem(this.group().groupId,this.item().id).subscribe({
      next:()=>{
        this.notificationService.success("Item deleted successfully")
        this.listChanged.emit()
      },
      error:()=>{
        this.notificationService.error("Failed to delete item")
      }
    })


  }

  onPurchase(){
    const request : OwnedGroupItemRequestModel=
      {
        groupItemId: this.item().id
      }
    this.ownedGroupItemApi.purchaseGroupItem(this.group().groupId, this.group().loggedUserMembershipDto!.groupMemberId,request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        {
          next:()=>
          {
                this.notificationService.success("Successfully purchased item")
          },
          error:()=>
          {
            this.notificationService.error("Error occurred on purchasing item")
          }
        }

      )
  }

  onFormSubmitted($event: void) {

    this.listChanged.emit()
  }

  protected readonly GroupPreviewMode = GroupPreviewMode;
}
