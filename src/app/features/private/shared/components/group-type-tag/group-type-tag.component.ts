import { Component, Input } from '@angular/core';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-group-type-tag',
  standalone: true,
  imports: [NzTagModule, NzIconModule],
  template: `
    <nz-tag [nzColor]="color">
      <span nz-icon [nzType]="icon"></span>
      {{ typeTitle }}
    </nz-tag>
  `,
})
export class GroupTypeTagComponent {
  @Input() typeTitle!: string;

  get color(): string {
    switch (this.typeTitle) {
      case 'Open':
        return 'blue';
      case 'Request only':
        return 'orange';
      default:
        return 'red';
    }
  }

  get icon(): string {
    switch (this.typeTitle) {
      case 'Open':
        return 'global';
      case 'Request only':
        return 'user-add';
      default:
        return 'lock';
    }
  }
}
