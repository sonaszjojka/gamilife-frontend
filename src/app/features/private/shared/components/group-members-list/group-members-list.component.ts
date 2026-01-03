import {
  Component,
  DestroyRef,
  inject,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalService } from 'ng-zorro-antd/modal';
import { GroupMember } from '../../../../shared/models/group/group-member.model';
import { GroupMemberApiService } from '../../../../shared/services/group-member-api/group-member-api.service';
import { EditGroupMemberFormComponent } from '../edit-group-member-form/edit-group-member-form.component';
import { PaginationMoreComponent } from '../pagination-more/pagination-more.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-group-members-list',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzToolTipModule,
    EditGroupMemberFormComponent,
    PaginationMoreComponent,
  ],
  templateUrl: './group-members-list.component.html',
  styleUrl: './group-members-list.component.css',
})
export class GroupMembersListComponent {
  groupId = input.required<string>();
  members = input<GroupMember[]>([]);
  adminId = input<string | null>(null);
  isAdmin = input<boolean>(false);
  loading = input<boolean>(false);

  memberChanged = output<void>();

  @ViewChild(EditGroupMemberFormComponent)
  editForm!: EditGroupMemberFormComponent;

  selectedMember = signal<GroupMember | null>(null);
  currentPage = signal<number>(1);
  pageSize = 12;

  private readonly groupMemberApi = inject(GroupMemberApiService);
  private readonly modal = inject(NzModalService);
  private readonly router = inject(Router);
  private destroyRef = inject(DestroyRef);

  paginatedMembers = () => {
    const members = this.members();
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return members.slice(start, end);
  };

  totalPages = () => {
    const total = this.members().length;
    return Math.ceil(total / this.pageSize);
  };

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  viewProfile(member: GroupMember): void {
    this.router.navigate(['/app/community/users', member.userId]);
  }

  openEditModal(member: GroupMember): void {
    this.selectedMember.set(member);
    this.editForm.open(member);
  }

  confirmRemove(member: GroupMember): void {
    this.modal.confirm({
      nzTitle: 'Remove Member',
      nzContent: `Are you sure you want to remove ${member.username} from the group?`,
      nzOkText: 'Remove',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () => this.removeMember(member),
    });
  }

  private removeMember(member: GroupMember): void {
    this.groupMemberApi
      .removeGroupMember(this.groupId(), member.groupMemberId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.currentPage.set(1);
          this.memberChanged.emit();
        },
      });
  }

  onMemberUpdated(): void {
    this.memberChanged.emit();
  }
}
