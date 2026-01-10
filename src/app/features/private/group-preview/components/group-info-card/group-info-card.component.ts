import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Group } from '../../../../shared/models/group/group.model';
import { GroupTypeTagComponent } from '../../../shared/components/group-type-tag/group-type-tag.component';
import { GroupPreviewMode } from '../../../../shared/models/group/group-preview-mode';

@Component({
  selector: 'app-group-info-card',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzIconModule, GroupTypeTagComponent],
  template: `
    <div class="list-container">
      <nz-card class="group-card">
        <div class="group-header">
          <h1 class="group-name">{{ group().groupName }}</h1>
          <app-group-type-tag
            [typeTitle]="group().groupType.title"
          ></app-group-type-tag>
        </div>

        <div class="info-container">
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

          @if (mode() !== GroupPreviewMode.PUBLIC) {
            <div class="info-item">
              <span nz-icon nzType="dollar" class="info-icon"></span>
              <div class="info-content">
                <span class="info-label">Currency</span>
                <span class="info-value"
                  >{{ group().loggedUserMembershipDto?.groupMoney }}
                  {{ group().groupCurrencySymbol }}</span
                >
              </div>
            </div>
          }

          <div class="info-item">
            <span nz-icon nzType="crown" class="info-icon"></span>
            <div class="info-content">
              <span class="info-label">Admin</span>
              <span class="info-value">{{
                group().adminUsername ?? group().adminId
              }}</span>
            </div>
          </div>
          <div class="info-item">
            <span nz-icon nzType="field-time" class="info-icon"></span>
            <div class="info-content">
              <span class="info-label">Time Zone</span>
              <span class="info-value">{{ group().groupTimeZone }}</span>
            </div>
          </div>
        </div>

        <ng-content></ng-content>
      </nz-card>
    </div>
  `,
  styles: [
    `
      .list-container {
        display: flex;
        flex-direction: column;
        border-radius: var(--border-radius-xl);
      }

      .group-card {
        max-width: 600px;
        margin: 0 auto;
        width: 100%;
        box-shadow: var(--box-shadow-md);
        border-radius: var(--border-radius-xl);
        overflow: hidden;
      }

      ::ng-deep .group-card .ant-card-body {
        padding: 0;
      }

      .group-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-medium);
        border-bottom: 1px solid var(--border-color-light);
      }

      .group-name {
        margin: 0;
        font-size: var(--font-size-xlarge);
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary-color);
      }

      .info-container {
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .info-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-medium);
        padding: var(--spacing-medium);
      }

      .info-item:last-child {
        border-bottom: none;
      }

      .info-icon {
        font-size: var(--font-size-large);
        color: var(--third-color);
        flex-shrink: 0;
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
  mode = input.required<GroupPreviewMode>();
  protected readonly GroupPreviewMode = GroupPreviewMode;
}
