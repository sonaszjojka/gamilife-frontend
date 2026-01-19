import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-back-button',
  standalone: true,
  template: `
    <button nz-button nzType="link" nzSize="default" (click)="onBack()">
      <span nz-icon nzType="arrow-left"></span>
    </button>
  `,

  imports: [NzButtonComponent, NzIconDirective],
})
export class BackButtonComponent {
  private navigation = inject(Location);

  onBack(): void {
    this.navigation.back();
  }
}
