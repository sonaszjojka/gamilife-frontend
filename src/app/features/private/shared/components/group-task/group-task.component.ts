import {Component, inject, input, OnInit, output, signal, ViewChild} from '@angular/core';
import {EditGroupTaskDto, GroupTask} from '../../../../shared/models/group/group-task.model';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {GroupPreviewMode} from '../../../../shared/models/group/group-preview-mode';
import {GroupTaskApiService} from '../../../../shared/services/group-task-api/group-task-api.service';
import {GroupTaskFormComponent} from '../group-task-from/group-task-form.component';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {GroupTaskMembersManagerComponent} from '../group-task-member-manager/group-task-members-manager.component';
import {EditGroupMemberDto, GroupMember} from '../../../../shared/models/group/group-member.model';
import {Group} from '../../../../shared/models/group/group.model';
import {
  GroupTaskMemberApiService
} from '../../../../shared/services/group-task-member-api/group-task-member-api.service';
import {EditGroupTaskMemberDto, GroupTaskMemberModel} from '../../../../shared/models/group/group-task-member.model';
import {GroupMemberApiService} from '../../../../shared/services/group-member-api/group-member-api.service';

@Component({
  selector: 'app-group-task',
  standalone: true,
  imports: [
    NzCardComponent,
    NzButtonComponent,
    NzIconDirective,
    GroupTaskFormComponent,
    GroupTaskMembersManagerComponent
  ],
  templateUrl: './group-task.component.html',
  styleUrl: './group-task.component.css'
})


export class GroupTaskComponent implements OnInit {
  protected readonly GroupPreviewMode = GroupPreviewMode;


   task=input.required<GroupTask>();
   mode=input.required<GroupPreviewMode>();
   group=input.required<Group>();
   membersList=input.required<GroupMember[]>();

  userIsParticipant=signal<GroupTaskMemberModel|null>(null);


  taskUpdated=output<void>();


  private readonly groupTaskApi= inject(GroupTaskApiService);
  private readonly groupTaskMemberApi= inject(GroupTaskMemberApiService);
  private readonly groupMemberApi= inject(GroupMemberApiService);

  ngOnInit(): void {
    this.checkUserIsParticipant();
  }


  @ViewChild(GroupTaskFormComponent)
  groupTaskForm!: GroupTaskFormComponent;
  @ViewChild(GroupTaskMembersManagerComponent)
  groupTaskMembersManager!: GroupTaskMembersManagerComponent;


  protected editTask(): void {
    console.log(this.userIsParticipant());
    if (this.groupTaskForm)
    {
      this.groupTaskForm.openForm();
    }
  }

  protected deleteTask(): void {
    this.groupTaskApi.deleteGroupTask(this.group().groupId,this.task().groupTaskId).subscribe({
      next: () => {
        this.onUpdate();
      },
      error: (err) => {
        console.error('Error deleting task:', err);
      }
    })
  }



  protected manageParticipants(): void {
      this.groupTaskMembersManager.show();
  }

  protected complete(): void {
    if (this.userIsParticipant()!=null) {
      let request : EditGroupTaskMemberDto = {
        isMarkedDone: true
      }

      this.groupTaskMemberApi.editTaskMemberCompletionStatus(this.group().groupId,
        this.task().groupTaskId,
        this.userIsParticipant()!.groupTaskMemberId,
        request)
        .subscribe({
          next: (response) => {
            this.userIsParticipant.set({isMarkedDone: response.isMarkedDone,
              groupTaskMemberId:response.groupTaskMemberId,
              groupMemberId:response.groupMemberId});
            console.log(response);
          },
          error: (err) => {
            console.error('Error marking task as complete:', err);
          }
        })
    }

  }

  protected removeCompletion(): void {
    if (this.userIsParticipant()!=null)
    {
    let request:EditGroupTaskMemberDto={
      isMarkedDone:false
    }
    this.groupTaskMemberApi.editTaskMemberCompletionStatus(this.group().groupId,
      this.task().groupTaskId,
      this.userIsParticipant()!.groupTaskMemberId,
      request).subscribe(
      {
        next: (response) => {
          this.userIsParticipant.set({isMarkedDone: response.isMarkedDone,
            groupTaskMemberId:response.groupTaskMemberId,
            groupMemberId:response.groupMemberId});
        },
        error: (err) => {
          console.error('Error marking task as complete:', err);
        }
      }
    )
    }

  }

//toDo after task refactor change into one request
  protected accept(): void {
    let  request : EditGroupTaskDto ={
      title:this.task().taskDto.title,
      description:this.task().taskDto.description,
      startTime: this.task().taskDto.startTime,
      endTime:this.task().taskDto.endTime,
      categoryId:this.task().taskDto.category,
      difficultyId:this.task().taskDto.difficulty,
      completedAt:this.task().taskDto.completedAt,
      reward: this.task().reward,
      isAccepted: true,
      declineMessage: this.task().declineMessage
    }
    this.groupTaskApi.editGroupTask(this.group().groupId,this.task().groupTaskId,request).subscribe({
      next: () => {
        for (let member of this.task().groupTaskMembers)
        {
          if (member.isMarkedDone)
          {
            let groupMember= this.membersList().find(
              groupMember=>groupMember.groupMemberId==member.groupMemberId)

            if (groupMember!=null) {
              let request: EditGroupMemberDto = {
                groupMoney: groupMember.groupMoney! + this.task().reward,
                totalEarnedMoney:groupMember.totalEarnedMoney!+this.task().reward
              }
              this.groupMemberApi.editGroupMember(this.group().groupId,member.groupMemberId,request).subscribe()
            }
          }
        }
      },
      error: (err) => {
        console.error('Error accepting task:', err);
      }
    });


  }

  protected decline(): void {



  }

  protected onUpdate(): void {
    this.taskUpdated.emit();
  }

  public checkUserIsParticipant(): void {

    let participant = this.task().groupTaskMembers.find((currentMember) =>
      currentMember.groupMemberId === this.group().loggedUserMembershipDto!.groupMemberId
    );
    this.userIsParticipant.set(participant ?? null);

  }

  public checkIfTaskIsCompletedByUser(): boolean {
    return this.userIsParticipant()!.isMarkedDone;
  }




}
