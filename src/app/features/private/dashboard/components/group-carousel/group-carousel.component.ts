import { Component, input, output, signal } from '@angular/core';

import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { Group } from '../../../../shared/models/group/group.model';
import { GroupCardComponent } from '../../../shared/components/group-card/group-card.component';
@Component({
  selector: 'app-group-carousel-component',
  imports: [NzCarouselModule, GroupCardComponent],
  templateUrl: 'group-carousel.component.html',
  standalone: true,
  styleUrl: 'group-carousel.component.css',
})
export class GroupCarouselComponent {
  groups = input<Group[]>([]);
  totalGroupPages = input<number>(1);
  page = signal<number>(0);
  slideChanged = output<number>();
  isLoading = input.required<boolean>();

  effect = 'scrollx';

  onSlideChange({ to }: { from: number; to: number }) {
    this.slideChanged.emit(to);
    this.page.set(to);
  }

  protected readonly Array = Array;
}
