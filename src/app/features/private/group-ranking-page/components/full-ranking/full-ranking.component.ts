import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { GroupMember } from '../../../../shared/models/group-member.model';

@Component({
  selector: 'app-full-ranking',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzIconModule, NzCardModule],
  templateUrl: './full-ranking.component.html',
  styleUrl: './full-ranking.component.css',
})
export class FullRankingComponent {
  members = input<GroupMember[]>([]);

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
}
