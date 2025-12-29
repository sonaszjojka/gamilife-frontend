import {Component, inject, input, OnInit, signal, ViewChild} from '@angular/core';
import {Group} from '../../../../shared/models/group/group.model';
import {GroupItemModel} from '../../../../shared/models/group/group-item.model';
import {GroupShopApiService} from '../../../../shared/services/group-shop-api/group-shop-api.service';
import {PaginationMoreComponent} from '../../../shared/components/pagination-more/pagination-more.component';
import {GroupPreviewMode} from '../../../../shared/models/group/group-preview-mode';
import {NzSpinComponent} from 'ng-zorro-antd/spin';
import {GroupItemComponent} from '../group-item/group-item.component';
import {NotificationService} from '../../../../shared/services/notification-service/notification.service';
import {GroupItemFormComponent} from '../group-item-form/group-item-form.component';
import {GroupShopModel} from '../../../../shared/models/group/group-shop.model';


@Component({
  selector: 'app-group-shop-page',
  templateUrl: './group-shop-page.component.html',
  styleUrls: ['./group-shop-page.component.scss'],
  standalone: true,
  imports: [
    PaginationMoreComponent,
    NzSpinComponent,
    GroupItemComponent,
    GroupItemFormComponent
  ]
})



export class GroupShopPageComponent implements OnInit {

  group=input.required<Group>();
  viewMode = input.required<GroupPreviewMode>();
  groupShop=signal<GroupShopModel >(null!);
  totalPages = signal<number>(0);
  currentPage = signal<number>(0);
  loading = signal<boolean>(true);



  @ViewChild(GroupItemFormComponent)
  itemFormComponent!:GroupItemFormComponent


  groupItems: GroupItemModel[] = [];

  groupShopApi=inject(GroupShopApiService);
  notificationService=inject(NotificationService);

  ngOnInit() {
    this.load(0)
  }

  load(page:number)
  {
/*
    this.loading.set(true);
    this.groupShopApi.getGroupShopItems(this.group.id,page,12).subscribe({
      next: (response) => {
        this.groupItems = response.content;
        this.totalPages.set(response.totalPages - 1);
        this.currentPage.set(page);
        this.loading.set(false);
      },
      error: (error) => {
        this.notificationService.error(
          'Failed to load group shop items',
        );
        this.loading.set(false);
      },
    });

 */
  }

  onPageChange($event: number) {

    this.load($event);

  }

  onTaskCreation(){

  }

  onFormSubmitted($event: void) {

    this.load(this.currentPage());
  }

}
