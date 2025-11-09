import {Component,Input, WritableSignal} from '@angular/core';
import {NzButtonComponent} from 'ng-zorro-antd/button';


@Component({
  selector: 'app-task-filter',
  imports: [
    NzButtonComponent
  ],
  templateUrl: './task-filter.component.html',
  standalone: true,
  styleUrl: './task-filter.component.css'
})
export class TaskFilterComponent {
  @Input() difficultyId?: WritableSignal<number | null>;
  @Input() categoryId?: WritableSignal<number | null>;
  @Input() isGroupTask?: WritableSignal<boolean | null>;
  @Input() isCompleted?: WritableSignal<boolean | null>;

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
