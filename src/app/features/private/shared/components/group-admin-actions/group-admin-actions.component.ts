import { Component, inject, input, output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Group } from '../../../../shared/models/group/group.model';
import { GroupMember } from '../../../../shared/models/group/group-member.model';
import { GroupApiService } from '../../../../shared/services/groups-api/group-api.service';
import { EditGroupFormComponent } from '../edit-group-form/edit-group-form.component';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-admin-actions',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzCardModule,
    NzModalModule,
    EditGroupFormComponent,
  ],
  template: `
    <nz-card class="admin-card">
      <div class="admin-header">
        <h3 class="header-title">Admin Panel</h3>
      </div>

      <div class="admin-actions">
        <button
          nz-button
          nzType="primary"
          nzSize="large"
          nzBlock
          (click)="openEditModal()"
        >
          <span nz-icon nzType="edit"></span>
          Edit group information
        </button>

        <button
          nz-button
          nzDanger
          nzSize="large"
          nzBlock
          (click)="confirmDelete()"
        >
          <span nz-icon nzType="delete"></span>
          Delete Group
        </button>
      </div>
    </nz-card>

    <app-edit-group-form
      [group]="group()"
      [members]="members()"
      (groupUpdated)="onGroupUpdated()"
    ></app-edit-group-form>
  `,
  styles: [
    `
      .admin-card {
        max-width: 600px;
        margin: 0 auto;
      }

      .admin-header {
        padding-bottom: var(--spacing-medium);
        border-bottom: 1px solid var(--border-color-light);
        margin-bottom: var(--spacing-large);
      }

      .header-title {
        margin: 0;
        font-size: var(--font-size-xlarge);
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary-color);
      }

      .admin-actions {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-medium);
      }
    `,
  ],
})
export class GroupAdminActionsComponent {
  group = input.required<Group>();
  members = input<GroupMember[]>([]);
  actionComplete = output<void>();

  @ViewChild(EditGroupFormComponent) editGroupForm!: EditGroupFormComponent;

  private readonly groupApi = inject(GroupApiService);
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);
  private readonly router = inject(Router);

  openEditModal(): void {
    this.editGroupForm.open();
  }

  confirmDelete(): void {
    this.modal.confirm({
      nzTitle: 'Delete Group',
      nzContent:
        'Are you sure you want to delete this group? This action cannot be undone.',
      nzOkText: 'Delete',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () => this.deleteGroup(),
    });
  }

  private deleteGroup(): void {
    const groupId = this.group().groupId;
    if (!groupId) return;

    this.groupApi
      .deleteGroup(groupId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.router.navigate(['app/groups']);
        },
        error: (err) => {
          console.error('Failed to delete group:', err);
        },
      });
  }

  onGroupUpdated(): void {
    this.actionComplete.emit();
  }
}
