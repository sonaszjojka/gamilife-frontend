import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { GroupMember } from '../../../../shared/models/group/group-member.model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-full-ranking',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzIconModule,
    NzCardModule,
    NzButtonModule,
    NzToolTipModule,
  ],
  templateUrl: './full-ranking.component.html',
  styleUrl: './full-ranking.component.css',
})
export class FullRankingComponent {
  members = input<GroupMember[]>([]);

  private readonly router = inject(Router);

  podiumMembers = () => {
    return this.members().slice(0, 3);
  };

  getMembers = () => {
    return this.members();
  };

  getRankForMember(member: GroupMember): number {
    return this.members().findIndex((m) => m.userId === member.userId) + 1;
  }

  getInitials(username: string): string {
    return username ? username.charAt(0).toUpperCase() : '';
  }

  viewProfile(member: GroupMember): void {
    this.router.navigate(['/app/community/users', member.userId]);
  }
}
