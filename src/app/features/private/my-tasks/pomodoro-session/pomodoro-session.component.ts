import {Component, HostListener, inject, ViewChild} from '@angular/core';
import {Task} from '../../../shared/models/task-models/task.model';
import {IndividualTaskService, Page} from '../../../shared/services/tasks/individual-task.service';
import {TaskItemComponent} from '../../shared/components/tasks/task-item/task-item.component';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {PomodoroSessionFormModal} from '../../shared/components/tasks/pomodoro-session-modal/pomodoro-session-form-modal';
import {NzWaveDirective} from 'ng-zorro-antd/core/wave';
import {PomodoroFormComponent} from '../../shared/components/tasks/pomodoro-form/pomodoro-form.component';
import {
  PomodoroSessionAcceptTaskModalComponent
} from '../../shared/components/tasks/pomodoro-session-accept-task-modal/pomodoro-session-accept-task-modal.component';
import {NzTimeRangePipe} from 'ng-zorro-antd/core/pipe';
import {PomodoroTaskService} from '../../../shared/services/tasks/pomodoro-task.service';
import {EditPomodoroRequest} from '../../../shared/models/task-models/edit-pomodoro-request';

@Component({
  selector: 'app-pomodoro-session',
  imports: [
    TaskItemComponent,
    NzButtonComponent,
    CdkDrag,
    CdkDropList,
    PomodoroSessionFormModal,
    NzWaveDirective,
    PomodoroFormComponent,
    PomodoroSessionAcceptTaskModalComponent,
    NzTimeRangePipe
  ],
  templateUrl: './pomodoro-session.component.html',
  standalone: true,
  styleUrl: './pomodoro-session.component.css'
})
export class PomodoroSessionComponent {
  @ViewChild(PomodoroSessionFormModal)
  pomodoroSessionFormModal!:PomodoroSessionFormModal
  @ViewChild(PomodoroSessionAcceptTaskModalComponent)
  pomodoroSessionAcceptTaskModal!:PomodoroSessionAcceptTaskModalComponent

  loading=false;
  loadingMore=false;

  allUsersTasks:Task[]=[];
  currentSessionPomodoroTasks:Task[]=[];
  usersPomodoroTasks:Task[]=[];
  usersNotPomodoroTasks:Task[]=[];

  timer: any;
  remainingTime = 0;
  isSessionActive = false;
  isBrakeActive= false
  private sessionDuration = 25*60;
  private breakDuration = 5 * 60;

  currentPage = 0;
  pageSize = 50;
  totalPages = 0;
  hasMore = true;

  taskService=inject(IndividualTaskService)
  pomodoroService=inject(PomodoroTaskService)

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


  onSessionStarted(): void {
    if (!this.currentSessionPomodoroTasks[0]) return;

    if (this.isSessionActive) {
      this.stopTimer();
    } else {
      if (this.remainingTime === 0) {
        this.remainingTime = this.sessionDuration;
      }
      this.isSessionActive = true;
      this.startCountdown();
    }
  }

  private startCountdown(): void {
    if (this.remainingTime <= 0) {
      this.addWorkCycleToTaskOnTop();
      this.stopTimer();
      return;
    }
    if (this.currentSessionPomodoroTasks.length==0) {
      this.stopTimer()
      this.remainingTime = 0;
      this.isSessionActive=false;
      return;
    }
    this.remainingTime--;
    this.timer = setTimeout(() => this.startCountdown(), 1000);
  }

  private stopTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.isSessionActive = false;
  }

  resetTimer(): void {
    this.stopTimer();
    this.remainingTime = 0;
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  addWorkCycleToTaskOnTop()
  {
    this.currentSessionPomodoroTasks[0].workCyclesCompleted=this.currentSessionPomodoroTasks[0].workCyclesCompleted!+1;
    const request:EditPomodoroRequest = {
      workCyclesCompleted : this.currentSessionPomodoroTasks[0].workCyclesCompleted,
      workCyclesNeeded : this.currentSessionPomodoroTasks[0].workCyclesNeeded,
  }
  this.pomodoroService.editPomodoro(
    this.currentSessionPomodoroTasks[0].pomodoroId!,
    request).subscribe(

  );

    if (this.currentSessionPomodoroTasks[0].workCyclesCompleted==this.currentSessionPomodoroTasks[0].workCyclesNeeded)
    {
      this.pomodoroSessionAcceptTaskModal.task=this.currentSessionPomodoroTasks[0];
      this.pomodoroSessionAcceptTaskModal.showModal();
    }
  }

  onTaskUpdated(taskId:string):void
  {
    const changedTask = this.allUsersTasks.find(t=>t.taskId==taskId)!;
    const isTaskNoneActive:Boolean = (changedTask.completedAt!=null||new Date(changedTask.endTime!)<new Date(Date.now()))

    if (isTaskNoneActive )
    {
      this.allUsersTasks.filter(t=>t.taskId!=taskId)
    }

  }

  removeFromPanel(task:Task)
  {
    this.currentSessionPomodoroTasks= this.currentSessionPomodoroTasks.filter(t=>t.taskId!=task.taskId);
    this.allUsersTasks= this.allUsersTasks.filter(t=>t.taskId!=task.taskId);
  }

  removeFromCurrentSession(task:Task)
  {

    this.usersPomodoroTasks.push(<Task>this.currentSessionPomodoroTasks.find(t => t.taskId == task.taskId));
    this.currentSessionPomodoroTasks= this.currentSessionPomodoroTasks.filter(t=> t.taskId!=task.taskId);
  }


  moveTaskToCurrentSession(task:Task)
  {
    if (!task) return;

    if (task.pomodoroId==null)
    {
      this.pomodoroSessionFormModal.task=task
      this.pomodoroSessionFormModal.showModal()

    }

    if (task.pomodoroId!=null)
    {
      this.currentSessionPomodoroTasks.push(<Task>this.usersPomodoroTasks.find(t => t.taskId == task.taskId));
      this.usersPomodoroTasks= this.usersPomodoroTasks.filter(t=> t.taskId!=task.taskId);

    }

  }
  moveModalPomodoroToSession(task:Task)
  {
    this.currentSessionPomodoroTasks.push(<Task>this.usersNotPomodoroTasks.find(t => t.taskId == task.taskId));
    this.usersNotPomodoroTasks= this.usersNotPomodoroTasks.filter(t=> t.taskId!=task.taskId);
  }





}
