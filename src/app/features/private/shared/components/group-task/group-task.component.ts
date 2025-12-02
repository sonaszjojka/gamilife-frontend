import {Component, inject, Input, OnInit, output, signal, ViewChild} from '@angular/core';
import {GroupTask} from '../../../../shared/models/group/group-task.model';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {GroupPreviewMode} from '../../../../shared/models/group/group-preview-mode';
import {GroupTaskApiService} from '../../../../shared/services/group-task-api/group-task-api.service';
import {GroupTaskFormComponent} from '../group-task-from/group-task-form.component';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {
  GroupTaskMemberApiService
} from '../../../../shared/services/group-task-member-api/group-task-member-api.service';

@Component({
  selector: 'app-group-task',
  standalone: true,
  imports: [
    NzCardComponent,
    NzButtonComponent,
    NzIconDirective,
    GroupTaskFormComponent
  ],
  templateUrl: './group-task.component.html',
  styleUrl: './group-task.component.css'
})


export class GroupTaskComponent {
  @Input() task!: GroupTask;
  @Input() mode=signal<GroupPreviewMode>(GroupPreviewMode.PUBLIC);
  @Input() groupId!:string;
  taskUpdated=output<void>();

  private readonly groupTaskApi= inject(GroupTaskApiService);
 // private readonly groupTaskMemberApi= inject(GroupTaskMemberApiService);

  @ViewChild(GroupTaskFormComponent)
  groupTaskForm!: GroupTaskFormComponent;

  protected editTask(): void {
    if (this.groupTaskForm)
    {
      this.groupTaskForm.openForm();
    }
  }

  protected deleteTask(): void {
    console.log('Deleting task with ID:', this.task.groupTaskId);
    this.groupTaskApi.deleteGroupTask(this.groupId,this.task.groupTaskId).subscribe({
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

  }






  //todo add participants
  //todo mark complete for participants
  //todo decline ?
  //todo accept by admin


  protected readonly GroupPreviewMode = GroupPreviewMode;
}
