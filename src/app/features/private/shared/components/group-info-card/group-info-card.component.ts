import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Group } from '../../../../shared/models/group.model';
import { GroupTypeTagComponent } from '../group-type-tag/group-type-tag.component';

@Component({
  selector: 'app-group-info-card',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzIconModule, GroupTypeTagComponent],
  template: `
    <nz-card class="group-card">
      <div class="group-header">
        <h1 class="group-name">{{ group().groupName }}</h1>
        <app-group-type-tag
          [typeTitle]="group().groupType.title"
        ></app-group-type-tag>
      </div>

      <div class="group-info">
        <div class="info-item">
          <span nz-icon nzType="key" class="info-icon"></span>
          <div class="info-content">
            <span class="info-label">Join Code</span>
            <span class="info-value">{{ group().joinCode }}</span>
          </div>
        </div>

        <div class="info-item">
          <span nz-icon nzType="team" class="info-icon"></span>
          <div class="info-content">
            <span class="info-label">Members</span>
            <span class="info-value">
              {{ group().membersCount || 0 }}
              <span *ngIf="group().membersLimit" class="limit">
                / {{ group().membersLimit }}
              </span>
            </span>
          </div>
        </div>

        <div class="info-item" *ngIf="group().groupCurrencySymbol">
          <span nz-icon nzType="dollar" class="info-icon"></span>
          <div class="info-content">
            <span class="info-label">Currency</span>
            <span class="info-value">{{ group().groupCurrencySymbol }}</span>
          </div>
        </div>

        <div class="info-item">
          <span nz-icon nzType="crown" class="info-icon"></span>
          <div class="info-content">
            <span class="info-label">Admin ID</span>
            <span class="info-value">{{ group().adminId }}</span>
          </div>
        </div>
      </div>

      <ng-content></ng-content>
    </nz-card>
  `,
  styles: [
    `
      .group-card {
        max-width: 600px;
        margin: 0 auto;
      }

      .group-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid #f0f0f0;
      }

      .group-name {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: #262626;
      }

      .group-info {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .info-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: #fafafa;
        border-radius: 8px;
        transition: background 0.3s;
      }

      .info-item:hover {
        background: #f5f5f5;
      }

      .info-icon {
        font-size: 20px;
        color: #1890ff;
      }

      .info-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex: 1;
      }

      .info-label {
        font-size: 12px;
        color: #8c8c8c;
        text-transform: uppercase;
        font-weight: 500;
        letter-spacing: 0.5px;
      }

      .info-value {
        font-size: 16px;
        color: #262626;
        font-weight: 500;
      }

      .limit {
        color: #8c8c8c;
        font-weight: 400;
      }
    `,
  ],
})
export class GroupInfoCardComponent {
  group = input.required<Group>();
}
