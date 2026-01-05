import {Component, effect, input, OnChanges, OnInit, output, signal} from '@angular/core';

import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import {Group} from '../../../../shared/models/group/group.model';
import {NzFlexDirective} from 'ng-zorro-antd/flex';
import {GroupCardComponent} from '../../../shared/components/group-card/group-card.component';
import {NzListHeaderComponent} from 'ng-zorro-antd/list';
import {NzSpinComponent} from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-group-carousel-component',
  imports: [NzCarouselModule, NzFlexDirective, GroupCardComponent, NzListHeaderComponent, NzSpinComponent],
  templateUrl:'group-carousel.component.html',
  standalone: true,
  styleUrl:'group-carousel.component.css'
})
export class GroupCarouselComponent {

  groups = input<Group[]>([])
  totalGroupPages= input<number>(1)
  page=signal<number>(0)
  slideChanged = output<number>()
  isLoading = input.required<boolean>()


  effect = 'scrollx';

  onSlideChange({ to }: { from: number; to: number }) {
    this.slideChanged.emit(to)
    this.page.set(to)
  }

  protected readonly Array = Array;
}
