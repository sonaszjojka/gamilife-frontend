import { Component,Input, WritableSignal } from '@angular/core';

import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-task-filter',
  imports: [NzMenuModule],
  standalone: true,
  templateUrl: './task-filter.component.html',
  styleUrl:'task-filter.component.css'
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


