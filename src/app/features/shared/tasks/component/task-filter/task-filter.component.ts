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
}
