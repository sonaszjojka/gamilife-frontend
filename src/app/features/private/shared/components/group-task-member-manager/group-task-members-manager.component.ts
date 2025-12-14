import {
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { GroupTask } from '../../../../shared/models/group/group-task.model';
import { GroupTaskMemberApiService } from '../../../../shared/services/group-task-member-api/group-task-member-api.service';
import { GroupMember } from '../../../../shared/models/group/group-member.model';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CommonModule } from '@angular/common';
import {
  NzListComponent,
  NzListItemComponent,
  NzListItemMetaComponent,
} from 'ng-zorro-antd/list';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { GroupTaskMemberModel } from '../../../../shared/models/group/group-task-member.model';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';

@Component({
  selector: 'app-group-task-members-manager',
  templateUrl: './group-task-members-manager.component.html',
  styleUrls: ['./group-task-members-manager.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzListComponent,
    NzListItemComponent,
    NzListItemMetaComponent,
    NzButtonComponent,
    NzIconDirective,
  ],
})
export class GroupTaskMembersManagerComponent implements OnInit {
  task = input.required<GroupTask>();
  membersList = input.required<GroupMember[]>();
  groupId = input.required<string>();
  isVisible = signal<boolean>(false);
  notAssignedMembers = signal<GroupMember[]>([]);
  assignedMembers = signal<GroupMember[]>([]);

  private readonly groupTaskMemberApi = inject(GroupTaskMemberApiService);
  private readonly notification = inject(NotificationService);

  changed = output<void>();

  protected addMemberToTask(memberId: string): void {
    const request = {
      groupMemberId: memberId,
    };
    this.groupTaskMemberApi
      .assignMemberToTask(this.groupId(), this.task().groupTaskId, request)
      .subscribe({
        next: (response) => {
          const assignedMember: GroupTaskMemberModel = {
            groupTaskMemberId: response.groupTaskMemberId,
            groupMemberId: response.groupMemberId,
            isMarkedDone: response.isMarkedDone,
          };
          this.notAssignedMembers.set(
            this.notAssignedMembers().filter(
              (member) => member.groupMemberId != memberId,
            ),
          );

          this.assignedMembers.set([
            ...this.assignedMembers(),
            this.membersList().find(
              (member) => member.groupMemberId === memberId,
            )!,
          ]);

          this.task().groupTaskMembers.push(assignedMember);
          this.notification.success('Member assigned to task successfully');
          this.changed.emit();
        },
        error: (err) => {
          console.error('Error assigning member:', err);
          this.notification.handleApiError(
            err,
            'Failed to assign member to task',
          );
        },
      });
  }

  protected removeMemberFromTask(memberId: string): void {
    const taskMemberId = this.task().groupTaskMembers!.find(
      (taskMember) => taskMember.groupMemberId === memberId,
    )!.groupTaskMemberId!;

    this.groupTaskMemberApi
      .removeMemberFromTask(
        this.groupId(),
        this.task().groupTaskId,
        taskMemberId,
      )
      .subscribe({
        next: () => {
          this.assignedMembers.set(
            this.assignedMembers().filter(
              (member) => member.groupMemberId != memberId,
            ),
          );

          this.notAssignedMembers.set([
            ...this.notAssignedMembers(),
            this.membersList().find(
              (member) => member.groupMemberId === memberId,
            )!,
          ]);

          this.task().groupTaskMembers = this.task().groupTaskMembers.filter(
            (taskMember) => taskMember.groupMemberId != memberId,
          );
          this.notification.success('Member removed from task successfully');
          this.changed.emit();
        },
        error: (err) => {
          console.error('Error removing member:', err);
          this.notification.handleApiError(
            err,
            'Failed to remove member from task',
          );
        },
      });
  }

  ngOnInit(): void {
    this.notAssignedMembers.set(
      this.membersList().filter(
        (member) =>
          member.groupMemberId !=
          this.task().groupTaskMembers.find(
            (taskMember) => taskMember.groupMemberId === member.groupMemberId,
          )?.groupMemberId,
      ),
    );
    this.assignedMembers.set(
      this.membersList().filter(
        (member) =>
          this.task().groupTaskMembers.find(
            (taskMember) => taskMember.groupMemberId === member.groupMemberId,
          )?.groupMemberId === member.groupMemberId,
      ),
    );
  }

  protected getTitle(): string {
    return `Manage Members for Task: ${this.task().taskDto.title}`;
  }

  public show(): void {
    this.isVisible.set(true);
  }
  public onClose(): void {
    this.isVisible.set(false);
  }
}
