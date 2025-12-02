import {Component, inject, Input, OnInit, signal, ViewChild} from '@angular/core';
import {GroupTask} from '../../../../shared/models/group/group-task.model';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {GroupPreviewMode} from '../../../../shared/models/group/group-preview-mode';
import {GroupTaskApiService} from '../../../../shared/services/group-task-api/group-task-api.service';
import {GroupTaskFormComponent} from '../group-task-from/group-task-form.component';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzIconDirective} from 'ng-zorro-antd/icon';

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

  private readonly groupTaskApi= inject(GroupTaskApiService);

  @ViewChild(GroupTaskFormComponent)
  groupTaskForm!: GroupTaskFormComponent;

  protected editTask(): void {
    if (this.groupTaskForm)
    {
      this.groupTaskForm.openForm();
    }
  }












  //todo add participants
  //todo delete
  //todo edit
  //todo mark complete for participants
  //todo decline
  //todo accept by admin


}
