import {
  Component, inject, Input, effect, WritableSignal, Output, EventEmitter, signal} from '@angular/core';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzColDirective} from 'ng-zorro-antd/grid';
import {NzAutosizeDirective, NzInputDirective} from 'ng-zorro-antd/input';
import {Task} from '../../../../../shared/models/task-models/task.model';
import {IndividualTaskService} from '../../../../../shared/services/tasks/individual-task.service';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {EditTaskRequest} from '../../../../../shared/models/task-models/edit-task-request';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzTimePickerComponent} from 'ng-zorro-antd/time-picker';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {PomodoroFormComponent} from '../pomodoro-form/pomodoro-form.component';
import {CreatePomodoroRequest} from '../../../../../shared/models/task-models/create-pomodoro-request';
import {PomodoroTaskService} from '../../../../../shared/services/tasks/pomodoro-task.service';
import {EditPomodoroRequest} from '../../../../../shared/models/task-models/edit-pomodoro-request';
import {CreateHabitRequest} from '../../../../../shared/models/task-models/create-habit-request';
import {EditHabitRequest} from '../../../../../shared/models/task-models/edit-habit-request';
import {HabitFormComponent} from '../habit-form/habit-form.component';
import {HabitTaskService} from '../../../../../shared/services/tasks/habit-task.service';
import {daysAsDuration} from '../../../../../../shared/util/DateFormatterUtil';

@Component({
  selector: 'app-task-form',
  imports: [
    NzButtonComponent,
    ReactiveFormsModule,
    NzFormItemComponent,
    NzColDirective,
    NzFormControlComponent,
    NzFormLabelComponent,
    NzInputDirective,
    NzSelectComponent,
    NzOptionComponent,
    NzDatePickerComponent,
    NzTimePickerComponent,
    NzIconDirective,
    PomodoroFormComponent,
    NzAutosizeDirective,
    HabitFormComponent
  ],
  templateUrl: './task-form.component.html',
  standalone: true,
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {

  pomodoroCreation=signal<boolean>(false)
  pomodoroEdition = signal<boolean>(false)
  habitCreation=signal<boolean>(false)
  habitEdition=signal<boolean>(false)
  @Input() task!: WritableSignal<Task | null>;
  @Input() creationMode?: WritableSignal<boolean|null>
  @Input() editionMode?: WritableSignal<boolean|null>;
  @Output() taskFormSubmitted = new EventEmitter<void>();
  @Output() taskDeleted=new EventEmitter<void>()
  pomodoroRequest?:CreatePomodoroRequest;
  pomodoroEditRequest?:EditPomodoroRequest;
  habitRequest?:CreateHabitRequest;
  habitEditRequest?:EditHabitRequest;

  habitCreateDurationDays?:number;
  habitEditDurationDays?:number;

  private formBuilder = inject(NonNullableFormBuilder);
  private taskService = inject(IndividualTaskService)
  private pomodoroService=inject(PomodoroTaskService)
  private habitService=inject(HabitTaskService)

  validTaskForm = this.formBuilder.group({
    title: this.formBuilder.control('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(300)
    ]),
    startTimeDate: this.formBuilder.control<Date|null>(null, [
      Validators.required
    ]),
    startTimeHour: this.formBuilder.control<Date|null>(null, [
      Validators.required
    ]),
    endTimeDate: this.formBuilder.control<Date|null>(null,[
      Validators.required
      ]),
    endTimeHour:this.formBuilder.control<Date|null>(null,[
      Validators.required
    ]),
    categoryId: this.formBuilder.control<number>(0, [
      Validators.required
    ]),
    difficultyId: this.formBuilder.control<number>(0, [
      Validators.required
    ]),
    completedAt: this.formBuilder.control(''),
    description: this.formBuilder.control('', [
      Validators.required
    ])
  });

  categories = [
    {categoryId: 1, categoryName: 'Work'},
    {categoryId: 2, categoryName: 'Personal'},
    {categoryId: 3, categoryName: 'Health'}
  ];

  difiiculties = [
    {difficultyId: 1, difficultyName: 'Easy'},
    {difficultyId: 2, difficultyName: 'Medium'},
    {difficultyId: 3, difficultyName: 'Hard'}
  ];

  constructor() {
    effect(() => {
      const task = this.task?.();
      const isEditing = this.editionMode?.();
      const isCreating = this.creationMode?.();

      if (task && isEditing) {
        const startDate = task.startTime ? new Date(task.startTime) : null;
        const endDate = task.endTime?new Date(task.endTime):null;
        this.validTaskForm.patchValue({
          title: task.title || '',
          startTimeDate: startDate,
          startTimeHour: startDate,
          endTimeDate: endDate,
          endTimeHour:endDate,
          categoryId: task.categoryId ,
          difficultyId: task.difficultyId ,
          completedAt: task.completedAt || '',
          description: task.description || ''
        });
      } else if (isCreating) {
        this.validTaskForm.reset();
      }
    });
  }

  onClose() {
    this.editionMode?.set(false);
    this.creationMode?.set(false);
    this.validTaskForm.reset();
  }

  onSubmit() {
    if (this.validTaskForm.invalid) {
      Object.values(this.validTaskForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    const formValue = this.validTaskForm.getRawValue();
    let mergedStartTime = '';
    const startTimeDate = formValue.startTimeDate;
    const startTimeHour = formValue.startTimeHour;

    startTimeDate!.setHours(startTimeHour!.getHours()+1,startTimeHour!.getMinutes(),startTimeHour!.getSeconds());
    mergedStartTime=startTimeDate!.toISOString();

    let mergedEndTime='';
    const endTimeDate = formValue.endTimeDate;
    const endTimeHour=formValue.endTimeHour;

    endTimeDate!.setHours(endTimeHour!.getHours()+1,endTimeHour!.getMinutes(),endTimeHour!.getSeconds())
    mergedEndTime=endTimeDate!.toISOString()

//ToDo make two different classes for task requests or change name of edit task request
    const request: EditTaskRequest = {
      title: formValue.title,
      startTime: mergedStartTime,
      endTime: mergedEndTime,
      categoryId: formValue.categoryId,
      difficultyId: formValue.difficultyId,
      completedAt: formValue.completedAt,
      description: formValue.description
    }

    if (this.creationMode?.()) {
      this.taskService.createTask(request).subscribe({
        next: (response) => {
          this.validTaskForm.reset();
          this.taskFormSubmitted.emit();
        },
        error: (error) => {
          console.error('Error creating task:', error);
          this.taskFormSubmitted.emit();
        }
      });
    } else if (this.editionMode?.()) {
      const task = this.task?.();
      if (task == null) {
        return;
      }
      if (this.pomodoroRequest && this.pomodoroCreation()) {
        this.pomodoroService.createPomodoro(task.taskId, this.pomodoroRequest).subscribe({
          next: (response) => {
            task.pomodoro = {
              pomodoroId: response.pomodoroId,
              workCyclesNeeded: response.workCyclesNeeded,
              workCyclesCompleted: response.workCyclesCompleted,
              createdAt: response.createdAt
            };
          }
        });
      }
      else if (this.pomodoroEditRequest && this.pomodoroEdition()) {
        this.pomodoroService.editPomodoro(task.pomodoro?.pomodoroId!, this.pomodoroEditRequest).subscribe({
          next: (response) => {
            task.pomodoro!.workCyclesNeeded = response.workCyclesNeeded;
            task.pomodoro!.workCyclesCompleted = response.workCyclesCompleted;
            task.pomodoro!.createdAt = response.createdAt;
          }
        });
      }

      if (this.habitRequest && this.habitCreation()) {
        this.habitRequest.cycleLength=daysAsDuration(this.habitCreateDurationDays!);

        this.habitService.createHabitTask(task.taskId, this.habitRequest).subscribe({
          next: (response) => {
            task.taskHabit = {
              habitId: response.habitId,
              cycleLength: response.cycleLength,
              currentStreak: response.currentStreak,
              longestStreak: response.longestStreak,
              acceptedDate:response.acceptedDate,
            };
            console.log(task.taskHabit.habitId);
            //ToDo decide if we need to set task.endTime from here or use already existing one
          }
        });
      }

      else if (this.habitEditRequest && this.habitEdition()) {
        this.habitEditRequest.cycleLength=daysAsDuration(this.habitEditDurationDays!);
        this.habitService.editHabitTask(task.taskHabit?.habitId!, task.taskId,this.habitEditRequest).subscribe({
          next: (response) => {
            task.taskHabit!.cycleLength = response.cycleLength;
            task.taskHabit!.currentStreak = response.currentStreak;
            task.taskHabit!.longestStreak = response.longestStreak;
            task.taskHabit!.acceptedDate = response.acceptedDate;}

        });
      }

      this.taskService.editTask(task.taskId, request).subscribe({
        next: (response) => {
          this.validTaskForm.reset();
          this.taskFormSubmitted.emit();
        },
        error: (error) => {
          console.error('Error editing task:', error);
          this.taskFormSubmitted.emit();
        }
      });
    }
  }

  onDelete() {
    this.taskService.deleteTask(this.task()!.taskId).subscribe({
      next:()=>{
        this.validTaskForm.reset();
        this.taskDeleted.emit();
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.taskFormSubmitted.emit();
      }
    })

  }



 onPomodoroCreation()
 {
   this.pomodoroCreation.update(value => !value)
 }

 onPomodoroEdition()
 {
   this.pomodoroEdition.update(value => !value)
 }

 onPomodoroFormChange(pomodoroRequest:CreatePomodoroRequest)
 {
   if (pomodoroRequest!=null) this.pomodoroRequest=pomodoroRequest
 }

 onPomodoroEditFormChange(pomodoroEditRequest:EditPomodoroRequest)
 {
   if (pomodoroEditRequest!=null)this.pomodoroEditRequest=pomodoroEditRequest;
 }


  onHabitCreation() {
      this.habitCreation.update(value => !value)
    this.habitRequest={
      cycleLength: '',
      currentStreak: 0,
      longestStreak: 0,
      acceptedDate: null
    }
  }

  onHabitEdition() {
    this.habitEdition.update(value => !value)

  }

  onHabitFormChange(habitCreateDurationInDays:number)
  {
    if (habitCreateDurationInDays!=null) this.habitCreateDurationDays=habitCreateDurationInDays
  }

  onHabitEditFormChange(habitEditDurationInDays:number)
  {
    if (habitEditDurationInDays!=null)this.habitEditDurationDays=habitEditDurationInDays;
  }
}
