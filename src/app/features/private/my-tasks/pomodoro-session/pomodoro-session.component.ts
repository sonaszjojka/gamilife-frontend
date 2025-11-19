import {Component, HostListener, inject, ViewChild} from '@angular/core';
import {Task} from '../../../shared/models/task-models/task.model';
import {IndividualTaskService, Page} from '../../../shared/services/tasks/individual-task.service';
import {TaskItemComponent} from '../../shared/components/tasks/task-item/task-item.component';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {PomodoroSessionModal} from '../../shared/components/tasks/pomodoro-session-modal/pomodoro-session-modal';
import {NzWaveDirective} from 'ng-zorro-antd/core/wave';
import {PomodoroFormComponent} from '../../shared/components/tasks/pomodoro-form/pomodoro-form.component';

@Component({
  selector: 'app-pomodoro-session',
  imports: [
    TaskItemComponent,
    NzButtonComponent,
    CdkDrag,
    CdkDropList,
    PomodoroSessionModal,
    NzWaveDirective,
    PomodoroFormComponent
  ],
  templateUrl: './pomodoro-session.component.html',
  standalone: true,
  styleUrl: './pomodoro-session.component.css'
})
export class PomodoroSessionComponent {
  @ViewChild(PomodoroSessionModal)
  pomodoroSessionModal!:PomodoroSessionModal

  loading=false;
  loadingMore=false;

  allUsersTasks:Task[]=[];
  currentSessionPomodoroTasks:Task[]=[];
  usersPomodoroTasks:Task[]=[];
  usersNotPomodoroTasks:Task[]=[];

  currentPage = 0;
  pageSize = 8;
  totalPages = 0;
  hasMore = true;

  taskService=inject(IndividualTaskService)

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const threshold = 200;
    const position = window.scrollY + window.innerHeight;
    const height = document.documentElement.scrollHeight;

    if (position > height - threshold && !this.loading && !this.loadingMore && this.hasMore) {
      this.loadMoreTasks();
    }
  }


  ngOnInit()
  {
    this.taskService.getUserTasks(this.currentPage,this.pageSize,null,null,false,false).subscribe
    ({next:(response:Page<Task>)=>{
        this.allUsersTasks=response.content;
        this.dispatchTasks();
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.hasMore = !response.last;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.loading = false;
      }

    })

  }

  loadMoreTasks():void
  {
    if(!this.hasMore||this.loadingMore) return

    this.loadingMore=true;
    const nextPage = this.currentPage+1;

    this.taskService.getUserTasks(nextPage,this.pageSize,null,null,false,false).subscribe
    ({next:(response:Page<Task>)=>{
        this.allUsersTasks=[...this.allUsersTasks,  ...response.content];
        this.dispatchTasks();
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.hasMore = !response.last;
        this.loadingMore  = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.loadingMore = false;
      }

    })

  }



 dispatchTasks()
 {

   let tasksNotInSession:Task[]
   tasksNotInSession = this.allUsersTasks.filter(t=> !this.currentSessionPomodoroTasks.includes(t))

   this.usersPomodoroTasks = tasksNotInSession.filter(t => t.pomodoroId != null);
   this.usersNotPomodoroTasks = tasksNotInSession.filter(t => t.pomodoroId == null);
 }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.currentSessionPomodoroTasks, event.previousIndex, event.currentIndex);
  }


 moveTaskToCurrentSession(task:Task)
 {
   if (!task) return;

   if (task.pomodoroId==null)
   {
     this.pomodoroSessionModal.task=task
     this.pomodoroSessionModal.showModal()

   }

    if (task.pomodoroId!=null)
    {
      this.currentSessionPomodoroTasks.push(<Task>this.usersPomodoroTasks.find(t => t.taskId == task.taskId));
      this.usersPomodoroTasks= this.usersPomodoroTasks.filter(t=> t.taskId!=task.taskId);

    }

 }

 removeFromCurrentSession(task:Task)
 {

   this.usersPomodoroTasks.push(<Task>this.currentSessionPomodoroTasks.find(t => t.taskId == task.taskId));
   this.currentSessionPomodoroTasks= this.currentSessionPomodoroTasks.filter(t=> t.taskId!=task.taskId);
 }


 moveModalPomodoroToSession(task:Task)
 {
   this.currentSessionPomodoroTasks.push(<Task>this.usersNotPomodoroTasks.find(t => t.taskId == task.taskId));
   this.usersNotPomodoroTasks= this.usersNotPomodoroTasks.filter(t=> t.taskId!=task.taskId);
 }

 onTaskUpdated()
 {

 }


}
