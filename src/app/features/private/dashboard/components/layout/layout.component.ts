import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {TaskListComponent} from '../../../../shared/tasks/component/task-list/task-list.component';
@Component({
  selector: 'app-layout',
  imports: [RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {


}
