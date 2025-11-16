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
            <span class="info-label">Admin</span>
            <span class="info-value">{{
              group().adminUsername ?? group().adminId
            }}</span>
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
        margin-bottom: var(--spacing-large);
        padding-bottom: var(--spacing-medium);
        border-bottom: 1px solid var(--border-color-light);
      }

      .group-name {
        margin: 0;
        font-size: var(--font-size-xlarge);
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary-color);
      }

      .group-info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-medium);
      }

      .info-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-medium);
        padding: var(--spacing-medium);
      }

      .info-icon {
        font-size: var(--font-size-large);
        color: var(--third-color);
      }

      .info-content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
        flex: 1;
      }

      .info-label {
        font-size: var(--font-size-xs);
        color: var(--border-color-dark);
        text-transform: uppercase;
        font-weight: var(--font-weight-medium);
        letter-spacing: 0.5px;
      }

      .info-value {
        font-size: var(--font-size-medium);
        color: var(--text-primary-color);
        font-weight: var(--font-weight-medium);
      }

      .limit {
        color: var(--border-color-dark);
        font-weight: var(--font-weight-normal);
      }
    `,
  ],
})
export class GroupInfoCardComponent {
  group = input.required<Group>();
}
