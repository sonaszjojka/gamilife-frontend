import {
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  EditGroupTaskDto,
  GroupTask,
} from '../../../../shared/models/group/group-task.model';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { GroupPreviewMode } from '../../../../shared/models/group/group-preview-mode';
import { GroupTaskApiService } from '../../../../shared/services/group-task-api/group-task-api.service';
import { GroupTaskFormComponent } from '../group-task-from/group-task-form.component';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { GroupTaskMembersManagerComponent } from '../group-task-member-manager/group-task-members-manager.component';
import { GroupMember } from '../../../../shared/models/group/group-member.model';
import { Group } from '../../../../shared/models/group/group.model';
import { GroupTaskMemberApiService } from '../../../../shared/services/group-task-member-api/group-task-member-api.service';
import {
  EditGroupTaskMemberDto,
  GroupTaskMemberModel,
} from '../../../../shared/models/group/group-task-member.model';
import { formatDateTime } from '../../../../../shared/util/DateFormatterUtil';
import { GroupTaskDeclineFormComponent } from '../group-task-decline-form/group-task-decline-form.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';

@Component({
  selector: 'app-group-task',
  standalone: true,
  imports: [
    NzCardComponent,
    NzButtonComponent,
    NzIconDirective,
    GroupTaskFormComponent,
    GroupTaskMembersManagerComponent,
    GroupTaskDeclineFormComponent,
  ],
  templateUrl: './group-task.component.html',
  styleUrl: './group-task.component.css',
})
export class GroupTaskComponent implements OnInit {
  protected readonly GroupPreviewMode = GroupPreviewMode;

  task = input.required<GroupTask>();
  mode = input.required<GroupPreviewMode>();
  group = input.required<Group>();
  membersList = input.required<GroupMember[]>();

  userIsParticipant = signal<GroupTaskMemberModel | null>(null);

  formatedEndDate!: string;
  formatedAcceptedDate!: string;

  taskUpdated = output<void>();
  rewardGiven = output<void>();

  private readonly groupTaskApi = inject(GroupTaskApiService);
  private readonly groupTaskMemberApi = inject(GroupTaskMemberApiService);
  private readonly modal = inject(NzModalService);
  private readonly notification = inject(NotificationService);

  ngOnInit(): void {
    this.checkUserIsParticipant();
    this.formatedEndDate = formatDateTime(this.task().taskDto.endTime);
    this.formatedAcceptedDate = formatDateTime(this.task().acceptedDate);
  }

  @ViewChild(GroupTaskFormComponent)
  groupTaskForm!: GroupTaskFormComponent;
  @ViewChild(GroupTaskMembersManagerComponent)
  groupTaskMembersManager!: GroupTaskMembersManagerComponent;
  @ViewChild(GroupTaskDeclineFormComponent)
  groupTaskDeclineForm!: GroupTaskDeclineFormComponent;

  protected editTask(): void {
    if (this.groupTaskForm) {
      this.groupTaskForm.openForm();
    }
  }

  protected deleteTask(): void {
    this.groupTaskApi
      .deleteGroupTask(this.group().groupId, this.task().groupTaskId)
      .subscribe({
        next: () => {
          this.notification.success('Task deleted successfully');
          this.onUpdate();
        },
        error: (err) => {
          console.error('Error deleting task:', err);
          this.notification.handleApiError(err, 'Failed to delete task');
        },
      });
  }

  protected manageParticipants(): void {
    this.groupTaskMembersManager.show();
  }

  protected complete(): void {
    if (this.userIsParticipant() != null) {
      const request: EditGroupTaskMemberDto = {
        isMarkedDone: true,
      };
      this.groupTaskMemberApi
        .editTaskMemberCompletionStatus(
          this.group().groupId,
          this.task().groupTaskId,
          this.userIsParticipant()!.groupTaskMemberId,
          request,
        )
        .subscribe({
          next: (response) => {
            this.notification.success('Task marked as complete');
            this.userIsParticipant.set({
              isMarkedDone: response.isMarkedDone,
              groupTaskMemberId: response.groupTaskMemberId,
              groupMemberId: response.groupMemberId,
            });

            const participant = this.task().groupTaskMembers.find(
              (currentMember) =>
                currentMember.groupTaskMemberId == response.groupTaskMemberId,
            );
            participant!.isMarkedDone = response.isMarkedDone;
          },
          error: (err) => {
            console.error('Error marking task as complete:', err);
            this.notification.handleApiError(
              err,
              'Failed to mark task as complete',
            );
          },
        });
    }
  }

  protected removeCompletion(): void {
    if (this.userIsParticipant() != null) {
      const request: EditGroupTaskMemberDto = {
        isMarkedDone: false,
      };
      this.groupTaskMemberApi
        .editTaskMemberCompletionStatus(
          this.group().groupId,
          this.task().groupTaskId,
          this.userIsParticipant()!.groupTaskMemberId,
          request,
        )
        .subscribe({
          next: (response) => {
            this.notification.success('Task completion removed');
            this.userIsParticipant.set({
              isMarkedDone: response.isMarkedDone,
              groupTaskMemberId: response.groupTaskMemberId,
              groupMemberId: response.groupMemberId,
            });

            const participant = this.task().groupTaskMembers.find(
              (currentMember) =>
                currentMember.groupTaskMemberId == response.groupTaskMemberId,
            );
            participant!.isMarkedDone = response.isMarkedDone;
          },
          error: (err) => {
            console.error('Error removing completion:', err);
            this.notification.handleApiError(
              err,
              'Failed to remove completion',
            );
          },
        });
    }
  }

  protected acceptTask(): void {
    const request: EditGroupTaskDto = {
      title: this.task().taskDto.title,
      description: this.task().taskDto.description,
      startTime: this.task().taskDto.startTime,
      endTime: this.task().taskDto.endTime,
      categoryId: this.task().taskDto.category.id,
      difficultyId: this.task().taskDto.difficulty.id,
      completedAt: this.task().taskDto.completedAt,
      reward: this.task().reward,
      isAccepted: true,
      declineMessage: null,
    };
    this.groupTaskApi
      .editGroupTask(this.group().groupId, this.task().groupTaskId, request)
      .subscribe({
        next: () => {
          this.notification.success('Task accepted and rewards distributed');
          this.onRewardGiven();
        },
        error: (err) => {
          console.error('Error accepting task:', err);
          this.notification.handleApiError(err, 'Failed to accept task');
        },
      });
  }

  protected decline(): void {
    this.groupTaskDeclineForm.openForm();
  }

  protected onUpdate(): void {
    this.taskUpdated.emit();
  }
  protected onRewardGiven(): void {
    this.rewardGiven.emit();
  }

  public checkUserIsParticipant(): void {
    const participant = this.task().groupTaskMembers.find(
      (currentMember) =>
        currentMember.groupMemberId ===
        this.group().loggedUserMembershipDto!.groupMemberId,
    );
    this.userIsParticipant.set(participant ?? null);
  }

  public checkIfTaskIsCompletedByUser(): boolean {
    return this.userIsParticipant()!.isMarkedDone;
  }

  protected getParticipantUsername(participantId: string): string {
    return this.membersList().find(
      (member) => member.groupMemberId == participantId,
    )!.username;
  }

  protected confirmDelete(): void {
    this.modal.confirm({
      nzTitle: 'Delete Task',
      nzContent:
        'Are you sure you want to delete this task? This action cannot be undone.',
      nzOkText: 'Delete',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () => this.deleteTask(),
    });
  }

  protected confirmAccept(): void {
    this.modal.confirm({
      nzTitle: 'Accept Task',
      nzContent:
        'Are you sure you want to accept this task? This action cannot be undone.',
      nzOkText: 'Accept',
      nzCancelText: 'Cancel',
      nzOnOk: () => this.acceptTask(),
    });
  }
}
