import { Component,Input, WritableSignal } from '@angular/core';

import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-task-filter',
  imports: [NzMenuModule],
  standalone: true,
  template: `
    <ul nz-menu nzMode="inline" style="width: 240px;">
      <li
        nz-submenu
        [(nzOpen)]="openMap['status']"
        (nzOpenChange)="openHandler('status')"
        nzTitle="Tasks"
        nzIcon="check-square"
      >
        <ul>
            <ul>
              <li nz-menu-item (click)="activeTaskSelected()">Active Tasks</li>
              <li nz-menu-item (click)="inactiveTaskSelected()">Journey History</li>
            </ul>
        </ul>
      </li>
      <li
        nz-submenu
        [(nzOpen)]="openMap['difficulty']"
        (nzOpenChange)="openHandler('difficulty')"
        nzTitle="Difficulty"
        nzIcon="fire"
      >

      <ul>
          <li nz-menu-item (click)="difficultySelected(1)">Easy</li>
          <li nz-menu-item (click)="difficultySelected(2)">Medium</li>
          <li nz-menu-item (click)="difficultySelected(3)">Hard</li>
        </ul>
      </li>
      <li
        nz-submenu
        [(nzOpen)]="openMap['category']"
        (nzOpenChange)="openHandler('category')"
        nzTitle="Category"
        nzIcon="product"
      >
        <ul>
          <li nz-menu-item (click)="categorySelected(1)">Work</li>
          <li nz-menu-item (click)="categorySelected(2)">Personal</li>
          <li nz-menu-item (click)="categorySelected(3)">Health</li>
        </ul>
      </li>
    </ul>
  `
})
export class TaskFilterComponent {

  openMap: { [name: string]: boolean } = {
    status: true,
    difficulty: false,
    category: false
  };

  @Input() difficultyId?: WritableSignal<number | null>;
  @Input() categoryId?: WritableSignal<number | null>;
  @Input() isGroupTask?: WritableSignal<boolean | null>;
  @Input() isCompleted?: WritableSignal<boolean | null>;

  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }

    categorySelected(category:number): void
  {
    this.categoryId?.set(category);
    this.difficultyId?.set(null);
    this.isGroupTask?.set(null);
    this.isCompleted?.set(false)
  }

  difficultySelected(difficulty:number):void
  {
    this.categoryId?.set(null);
    this.difficultyId?.set(difficulty);
    this.isGroupTask?.set(null);
    this.isCompleted?.set(false)

  }

  groupTaskSelected ():void
  {
    this.categoryId?.set(null);
    this.difficultyId?.set(null);
    this.isGroupTask?.set(true);
    this.isCompleted?.set(false)

  }

  activeTaskSelected ():void
  {
    this.categoryId?.set(null);
    this.difficultyId?.set(null);
    this.isGroupTask?.set(null);
    this.isCompleted?.set(false)

  }

  inactiveTaskSelected ():void
  {
    this.categoryId?.set(null);
    this.difficultyId?.set(null);
    this.isGroupTask?.set(null);
    this.isCompleted?.set(true)

  }
}


