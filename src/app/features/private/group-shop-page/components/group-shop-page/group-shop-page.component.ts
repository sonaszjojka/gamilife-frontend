import {Component, DestroyRef, inject, input, OnChanges, OnInit, output, signal, ViewChild} from '@angular/core';
import {Group} from '../../../../shared/models/group/group.model';
import {GroupItemModel} from '../../../../shared/models/group/group-item.model';
import {GroupShopApiService} from '../../../../shared/services/group-shop-api/group-shop-api.service';
import {PaginationMoreComponent} from '../../../shared/components/pagination-more/pagination-more.component';
import {GroupPreviewMode} from '../../../../shared/models/group/group-preview-mode';
import {NzSpinComponent} from 'ng-zorro-antd/spin';
import {GroupItemComponent} from '../group-item/group-item.component';
import {NotificationService} from '../../../../shared/services/notification-service/notification.service';
import {GroupItemFormComponent} from '../group-item-form/group-item-form.component';
import {GroupShopModel, GroupShopRequestModel} from '../../../../shared/models/group/group-shop.model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NzFloatButtonComponent} from 'ng-zorro-antd/float-button';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {GroupShopFormComponent} from '../group-shop-form/group-shop-form.component';
import {NzModalService} from "ng-zorro-antd/modal";
import {
  GroupMemberInventoryComponent
} from '../../../shared/components/group-member-inventory/group-member-inventory.component';
import {
  GroupMemberInventoryItemComponent
} from '../../../shared/components/group-member-inventory-item/group-member-inventory-item.component';


@Component({
  selector: 'app-group-shop-page',
  templateUrl: './group-shop-page.component.html',
  styleUrls: ['./group-shop-page.component.css'],
  standalone: true,
  imports: [
    PaginationMoreComponent,
    NzSpinComponent,
    GroupItemComponent,
    GroupItemFormComponent,
    NzFloatButtonComponent,
    NzButtonComponent,
    NzIconDirective,
    GroupShopFormComponent,
    GroupMemberInventoryComponent
  ]
})



export class GroupShopPageComponent implements OnInit {
  group=input.required<Group>();
  viewMode = input.required<GroupPreviewMode>();

  totalPages = signal<number>(0);
  currentPage = signal<number>(0);
  loading = signal<boolean>(true);

  deactivated = output<void>()
  private destroyRef = inject(DestroyRef);
  protected readonly GroupPreviewMode = GroupPreviewMode;



  @ViewChild(GroupItemFormComponent)
  itemFormComponent!:GroupItemFormComponent

  @ViewChild(GroupShopFormComponent)
  shopFormComponent!:GroupShopFormComponent

  @ViewChild(GroupMemberInventoryComponent)
  userInventory!: GroupMemberInventoryComponent

  private readonly modal = inject(NzModalService);

  shop!: GroupShopModel
  groupItems: GroupItemModel[] = [];

  groupShopApi=inject(GroupShopApiService);
  notificationService=inject(NotificationService);

ngOnInit() {
    this.load(1);
}

  load(page:number)
  {

    page--;
    this.loading.set(true);
    this.groupShopApi.getGroupShopItems(this.group().groupId,page,12)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (response) => {
        this.shop = response;
        this.groupItems=this.shop.page.content;
        this.totalPages.set(response.page.totalPages );
        this.currentPage.set(page);
        this.loading.set(false);

      },
      error: () => {
        this.notificationService.error(
          'Failed to load group shop items',
        );
        this.loading.set(false);
      },
    });
  }

  onPageChange($event: number) {

    this.load($event);

  }

  onItemCreation(){
      this.itemFormComponent.openForm()
  }
  onGroupShopEdit(){
      this.shopFormComponent.openForm()
  }
  onShopDeactivation()
  {
      const request : GroupShopRequestModel=
          {
            isActive:false
          }
    this.modal.confirm({
      nzTitle: 'Deactivate Group Shop',
      nzContent:
          'Do you want to deactivate shop for this group',
      nzOkText: 'Yes',
      nzCancelText: 'NO',

      nzOnOk:()=> this.groupShopApi.changeGroupShopStatus(this.group().groupId, request)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(
              {
                next: () => {
                  this.deactivated.emit()
                },
                error: () => {
                  this.notificationService.error("Error occurred during deactivating shop")
                }
              }
          ),
    })
  }

  protected restoreShop(): void {
    let request: GroupShopRequestModel={isActive:true}
    this.modal.confirm({
      nzTitle: 'Restore Group Shop',
      nzContent:
          'Do you want to restore shop for this group',
      nzOkText: 'Yes',
      nzCancelText: 'NO',
      nzOnOk: () => this.groupShopApi.changeGroupShopStatus(this.group()!.groupId,request ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
          {
            next: (response) => {
                this.shop.isActive=response.isActive
                this.load(1);
            },
            error: () => {
              this.notificationService.error("Error occurred during shop restore")
            }
          }
      ),
    });
  }

  onShopChanged($event: void) {
    this.load(this.currentPage()+1);
  }

  showInventory()
  {
    this.userInventory.show()
  }
}
