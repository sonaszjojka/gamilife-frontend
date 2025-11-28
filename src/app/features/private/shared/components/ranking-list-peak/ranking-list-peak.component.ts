import { Component, input, output } from '@angular/core';
import { GroupMember } from '../../../../shared/models/group/group-member.model';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ranking-list-peak',
  standalone: true,
  imports: [CommonModule, NzListModule, NzIconModule, NzButtonModule],
  templateUrl: './ranking-list-peak.component.html',
  styleUrl: './ranking-list-peak.component.css',
})
export class RankingListPeakComponent {
  membersList = input<GroupMember[]>([]);
  viewFullRanking = output<void>();

  protected displayMembers() {
    return this.membersList().slice(0, 5);
  }
}
