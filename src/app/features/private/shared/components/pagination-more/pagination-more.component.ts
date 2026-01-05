import {Component, Input, signal, output} from '@angular/core';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-pagination-more',
  standalone: true,
  imports: [NzPaginationModule],
  template: `
    <nz-pagination
      [nzPageIndex]="pageIndex()"
      [nzTotal]="totalItems()"
      [nzPageSize]="pageSize"
      (nzPageIndexChange)="onPageChange($event)"
    ></nz-pagination>
  `,
})
export class PaginationMoreComponent {
  @Input({ required: true }) set maxPageIndex(value: number) {
    this.totalItems.set(value * this.pageSize);
  }

   pageChange = output<number>();

  readonly pageIndex = signal(1);
  readonly totalItems = signal(0);
  readonly pageSize = 12;

  onPageChange(newPageIndex: number) {
    this.pageIndex.set(newPageIndex);
    this.pageChange.emit(newPageIndex);
  }
}
