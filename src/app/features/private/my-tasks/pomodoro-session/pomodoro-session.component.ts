import {Component, HostListener, inject, ViewChild} from '@angular/core';
import {Task} from '../../../shared/models/task-models/task.model';
import {IndividualTaskService, Page} from '../../../shared/services/tasks/individual-task.service';
import {TaskItemComponent} from '../../shared/components/tasks/task-item/task-item.component';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {PomodoroSessionFormModal} from '../../shared/components/tasks/pomodoro-form-modal/pomodoro-session-form-modal';
import {NzWaveDirective} from 'ng-zorro-antd/core/wave';
import {PomodoroFormComponent} from '../../shared/components/tasks/pomodoro-form/pomodoro-form.component';
import {
  PomodoroSessionAcceptTaskModalComponent
} from '../../shared/components/tasks/pomodoro-session-accept-task-modal/pomodoro-session-accept-task-modal.component';
import {NzTimeRangePipe} from 'ng-zorro-antd/core/pipe';
import {PomodoroTaskService} from '../../../shared/services/tasks/pomodoro-task.service';
import {EditPomodoroRequest} from '../../../shared/models/task-models/edit-pomodoro-request';
import {EditTaskRequest} from '../../../shared/models/task-models/edit-task-request';
import {
  PomodoroSessionBreakModalComponent
} from '../../shared/components/tasks/pomodoro-session-break-modal/pomodoro-session-break-modal.component';

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
    NzTimeRangePipe,
    PomodoroSessionBreakModalComponent
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
  @ViewChild(PomodoroSessionBreakModalComponent)
  pomodoroSessionBreakModal!: PomodoroSessionBreakModalComponent

  loading=false;
  loadingMore=false;

  allUsersTasks:Task[]=[];
  currentSessionPomodoroTasks:Task[]=[];
  usersPomodoroTasks:Task[]=[];
  usersNotPomodoroTasks:Task[]=[];

  timer: any;
  remainingTime = 0;
  isSessionActive = false;
  isBreakActive= false
  private sessionDuration = 10;
  private breakDuration = 10 ;

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

   this.usersPomodoroTasks = tasksNotInSession.filter(t => t.pomodoro?.pomodoroId != null);
   this.usersNotPomodoroTasks = tasksNotInSession.filter(t => t.pomodoro?.pomodoroId == null);
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
      if (this.isBreakActive) {

        this.handleBreakEnd();
        return;
      } else {
        this.addWorkCycleToTaskOnTop();
        this.startBreak();
        return;
      }
    }

    if (!this.isBreakActive && this.currentSessionPomodoroTasks.length == 0) {
      this.stopTimer();
      this.remainingTime = 0;
      this.isSessionActive = false;
      return;
    }

    if(this.currentSessionPomodoroTasks.length==0)
    {
      this.stopTimer();
      this.remainingTime = 0;
      this.isSessionActive = false;
      this.isBreakActive = false;
      return;
    }

    this.remainingTime--;
    this.timer = setTimeout(() => this.startCountdown(), 1000);
  }

  private startBreak(): void {
    this.stopTimer();
    this.isBreakActive = true;
    this.remainingTime = this.breakDuration;
    this.pomodoroSessionBreakModal.showBreakStartModal();
    this.isSessionActive = true;
    this.startCountdown();
  }

  private handleBreakEnd(): void {
    this.stopTimer();
    this.isBreakActive = false;
    this.remainingTime = 0;
    this.pomodoroSessionBreakModal.showBreakEndModal();
  }

  continueSession(): void {
    this.remainingTime = this.sessionDuration;
    this.isSessionActive = true;
    this.startCountdown();
  }

  endSession(): void {
    this.stopTimer();
    this.remainingTime = 0;
    this.isSessionActive = false;
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
    this.isBreakActive = false;
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
    this.currentSessionPomodoroTasks[0].pomodoro!.workCyclesCompleted=this.currentSessionPomodoroTasks[0].pomodoro!.workCyclesCompleted!+1;
    const request:EditPomodoroRequest = {
      workCyclesCompleted : this.currentSessionPomodoroTasks[0].pomodoro!.workCyclesCompleted,
      workCyclesNeeded : this.currentSessionPomodoroTasks[0].pomodoro!.workCyclesNeeded,
  }
  this.pomodoroService.editPomodoro(
    this.currentSessionPomodoroTasks[0].pomodoro!.pomodoroId!,
    request).subscribe(

  );

    if (this.currentSessionPomodoroTasks[0].pomodoro!.workCyclesCompleted==this.currentSessionPomodoroTasks[0].pomodoro!.workCyclesNeeded)
    {
      this.pomodoroSessionAcceptTaskModal.task=this.currentSessionPomodoroTasks[0];
      this.pomodoroSessionAcceptTaskModal.showModal();
    }
  }



  removeFromPanel(task:Task)
  {
    let request:EditTaskRequest={
      title:task.title,
      description:task.description,
      difficultyId:task.difficultyId,
      categoryId:task.categoryId,
      startTime:task.startTime,
      endTime:task.endTime,
      completedAt:new Date(Date.now()).toISOString()
    }

    this.taskService.editTask(task.taskId,request).subscribe()

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
    if (task.pomodoro?.pomodoroId==null)
    {
      this.pomodoroSessionFormModal.task=task
      this.pomodoroSessionFormModal.showModal()
    }

    if (task.pomodoro!=null)
    {

      if (task.pomodoro.workCyclesCompleted!>=task.pomodoro.workCyclesNeeded!)
      {
        this.pomodoroSessionFormModal.task=task
        this.pomodoroSessionFormModal.showModal()

      }
      else
      {

        this.currentSessionPomodoroTasks.push(<Task>this.usersPomodoroTasks.find(t => t.taskId == task.taskId));
        this.usersPomodoroTasks= this.usersPomodoroTasks.filter(t=> t.taskId!=task.taskId);
      }

    }

  }
  moveModalPomodoroToSession(task:Task)
  {
    if (<Task>this.usersNotPomodoroTasks.find(t => t.taskId == task.taskId))
    {
      this.currentSessionPomodoroTasks.push(<Task>this.usersNotPomodoroTasks.find(t => t.taskId == task.taskId));
      this.usersNotPomodoroTasks= this.usersNotPomodoroTasks.filter(t=> t.taskId!=task.taskId);
    }
    else
    {
      this.currentSessionPomodoroTasks.push(<Task>this.usersPomodoroTasks.find(t => t.taskId == task.taskId));
      this.usersPomodoroTasks= this.usersPomodoroTasks.filter(t=> t.taskId!=task.taskId);
    }

  }






}
