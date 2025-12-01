import {Component, Input, OnInit, Signal, signal} from '@angular/core';
import {GroupTask} from '../../../../shared/models/group/group-task.model';
import {GroupPreviewMode} from '../../../../shared/models/group/group-preview-mode';






@Component({
  selector: 'app-group-task-list',
  standalone: true,
  templateUrl: './group-task-list.component.html',
  styleUrls: ['./group-task-list.component.css'],
})
export class GroupTaskListComponent implements OnInit {

  @Input() mode! :Signal<GroupPreviewMode>;
  protected groupTasksList=signal<GroupTask[]>([]);
  loading = signal<boolean>(true);

  ngOnInit() {


  }

}
