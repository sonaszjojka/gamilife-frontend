import {Component, inject, input, Input, OnInit, output, signal, ViewChild} from '@angular/core';
import {GroupTask} from '../../../../shared/models/group/group-task.model';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {GroupPreviewMode} from '../../../../shared/models/group/group-preview-mode';
import {GroupTaskApiService} from '../../../../shared/services/group-task-api/group-task-api.service';
import {GroupTaskFormComponent} from '../group-task-from/group-task-form.component';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {GroupTaskMembersManagerComponent} from '../group-task-member-manager/group-task-members-manager.component';
import {GroupMember} from '../../../../shared/models/group/group-member.model';

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


export class GroupTaskComponent {
  protected readonly GroupPreviewMode = GroupPreviewMode;


   task=input.required<GroupTask>();
   mode=input.required<GroupPreviewMode>();
   groupId=input.required<string>();
   membersList=input.required<GroupMember[]>();

  userIsParticipant=signal<boolean>(false);

  taskUpdated=output<void>();


  private readonly groupTaskApi= inject(GroupTaskApiService);


  @ViewChild(GroupTaskFormComponent)
  groupTaskForm!: GroupTaskFormComponent;
  @ViewChild(GroupTaskMembersManagerComponent)
  groupTaskMembersManager!: GroupTaskMembersManagerComponent;


  protected editTask(): void {
    if (this.groupTaskForm)
    {
      this.groupTaskForm.openForm();
    }
  }

  protected deleteTask(): void {
    this.groupTaskApi.deleteGroupTask(this.groupId(),this.task().groupTaskId).subscribe({
      next: () => {
        this.onUpdate();
      },
      error: (err) => {
        console.error('Error deleting task:', err);
      }
    })
  }

  protected onUpdate(): void {
    this.taskUpdated.emit();
  }

  protected manageParticipants(): void {


      this.groupTaskMembersManager.show();


  }
  protected complete(): void {

  }
  protected accept(): void {


  }

  protected decline(): void {

  }

  //todo add participants
  //todo mark complete for participants
  //todo decline ?
  //todo accept by admin


}
