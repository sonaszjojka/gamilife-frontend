import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Group } from '../../../../shared/models/group.model';
import { Router } from '@angular/router';
import { GroupTypeTagComponent } from '../group-type-tag/group-type-tag.component';

@Component({
  selector: 'app-group-card',
  imports: [
    CommonModule,
    NzCardModule,
    NzIconModule,
    NzTagModule,
    NzButtonModule,
    GroupTypeTagComponent,
  ],
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.css',
  standalone: true,
})
export class GroupCardComponent {
  @Input({ required: true }) group!: Group;
  private router = inject(Router);

  goToPreview() {
    this.router.navigate(['/app/community/groups/', this.group.groupId]);
  }
}
