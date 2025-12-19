import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  input,
  Output,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators,} from '@angular/forms';
import {NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent,} from 'ng-zorro-antd/form';
import {NzColDirective} from 'ng-zorro-antd/grid';
import {NzAutosizeDirective, NzInputDirective} from 'ng-zorro-antd/input';
import {IndividualTaskService} from '../../../../../shared/services/tasks/individual-task.service';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {TaskRequest} from '../../../../../shared/models/task-models/task-request';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzTimePickerComponent} from 'ng-zorro-antd/time-picker';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {PomodoroFormComponent} from '../pomodoro-form/pomodoro-form.component';
import {HabitFormComponent} from '../habit-form/habit-form.component';
import {HabitTaskService} from '../../../../../shared/services/tasks/habit-api.service';
import {ActivityItemDetails, ActivityType} from '../../../../../shared/models/task-models/activity.model';
import {NzInputNumberComponent} from 'ng-zorro-antd/input-number';
import {HabitRequest} from '../../../../../shared/models/task-models/habit-request.model';
import {PomodoroSessionFormModal} from '../pomodoro-form-modal/pomodoro-session-form-modal';

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
    HabitFormComponent,
    NzInputNumberComponent,
    PomodoroSessionFormModal,
  ],
  templateUrl: './task-form.component.html',
  standalone: true,
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent {
  isDisabled = input<boolean>(true)
  type=input.required<ActivityType>()
  activity= input<ActivityItemDetails>()
  @Input() creationMode?: WritableSignal<boolean | null>;
  @Input() editionMode?: WritableSignal<boolean | null>;
  @Output() activityFormSubmitted = new EventEmitter<void>();
  @Output() activityDeleted = new EventEmitter<void>();

  private formBuilder = inject(NonNullableFormBuilder);
  private taskService = inject(IndividualTaskService);
  private habitApi = inject(HabitTaskService)

  @ViewChild(PomodoroSessionFormModal)
  protected pomodoroModal= new PomodoroSessionFormModal


  validActivityForm = this.formBuilder.group({
    title: this.formBuilder.control('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(300),
    ]),

    deadlineDate: this.formBuilder.control<Date | undefined>(undefined, []),
    deadlineHour: this.formBuilder.control<Date | undefined>(undefined, []),
    categoryId: this.formBuilder.control<number>(0, [Validators.required]),
    difficultyId: this.formBuilder.control<number>(0, [Validators.required]),
    description: this.formBuilder.control('', [Validators.required]),
    cycleLength: this.formBuilder.control<number>(0)

  });

  categories = [
    {categoryId: 1, categoryName: 'Work'},
    {categoryId: 2, categoryName: 'Personal'},
    {categoryId: 3, categoryName: 'Health'},
  ];

  difiiculties = [
    {difficultyId: 1, difficultyName: 'Easy'},
    {difficultyId: 2, difficultyName: 'Medium'},
    {difficultyId: 3, difficultyName: 'Hard'},
  ];


  constructor() {
    effect(() => {
      const activity = this.activity?.();
      const isEditing = this.editionMode?.();
      const isCreating = this.creationMode?.();

      if(activity?.type==ActivityType.HABIT&&isEditing)
      {
        this.validActivityForm.patchValue({
          title: activity.title || '',
          categoryId: activity.categoryId,
          difficultyId: activity.difficultyId,
          description: activity.description || '',
          cycleLength: activity.cycleLength
        });
      }
      else if (activity?.type == ActivityType.TASK && isEditing) {
        const endDate = activity.deadlineDate ? new Date(activity.deadlineDate) : undefined;
        let endHour: Date | undefined = undefined;
        if (activity.deadlineTime) {
          const [hours, minutes, seconds] = activity.deadlineTime.split(':').map(Number);
          endHour = new Date();
          endHour.setHours(hours, minutes, seconds || 0, 0);
        }

        this.validActivityForm.patchValue({
          title: activity.title || '',
          deadlineDate: endDate,
          deadlineHour: endHour,
          categoryId: activity.categoryId,
          difficultyId: activity.difficultyId,
          description: activity.description || '',
        });
      } else if (isCreating) {
        this.validActivityForm.reset();
      }
    });
  }

  onClose() {
    this.editionMode?.set(false);
    this.creationMode?.set(false);
    this.validActivityForm.reset();
  }

  onSubmit() {
    if (this.validActivityForm.invalid) {
      Object.values(this.validActivityForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }
    if (this.type() == ActivityType.TASK && this.validActivityForm.value.deadlineDate == undefined ) {
      Object.values(this.validActivityForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    if (this.type() == ActivityType.HABIT && (this.validActivityForm.value.cycleLength == undefined || this.validActivityForm.value.cycleLength <= 0)) {
      Object.values(this.validActivityForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }


    const formValue = this.validActivityForm.getRawValue();

    if (this.type() == ActivityType.TASK) {
      let request;
      if (formValue.deadlineHour != undefined) {
        formValue.deadlineHour!.setHours(formValue.deadlineHour!.getHours(), formValue.deadlineHour!.getMinutes(), 0, 0)
         request= {
          title: formValue.title,
          deadlineDate: formValue.deadlineDate!.toISOString().slice(0, 10),
          deadlineTime: formValue.deadlineHour!.toISOString().slice(11, 19),
          categoryId: formValue.categoryId,
          difficultyId: formValue.difficultyId,
          description: formValue.description,
        };
      }
      else {
        request = {
          title: formValue.title,
          deadlineDate: formValue.deadlineDate!.toISOString().slice(0, 10),
          deadlineTime: null,
          categoryId: formValue.categoryId,
          difficultyId: formValue.difficultyId,
          description: formValue.description,
        }
      }


        if (this.creationMode?.()) {
          this.taskService.createTask(request).subscribe({
            next: () => {
              this.validActivityForm.reset();
              this.activityFormSubmitted.emit();
            },
            error: (error) => {
              console.error('Error creating task:', error);
              this.activityFormSubmitted.emit();
            },
          });

        } else if (this.editionMode?.()) {
          const activity = this.activity?.();
          if (activity == null) {
            return;
          }
          this.taskService.editTask(this.activity()!.id, request).subscribe({
            next: () => {
              this.validActivityForm.reset();
              this.activityFormSubmitted.emit();
            },
            error: (error) => {
              console.error('Error editing task:', error);
              this.activityFormSubmitted.emit();
            },
          });
        }
      }
    else if (this.type()==ActivityType.HABIT)
    {
      const request: HabitRequest = {
        title: formValue.title,
        cycleLength:formValue.cycleLength,
        categoryId: formValue.categoryId,
        difficultyId: formValue.difficultyId,
        description: formValue.description,
      };

      if (this.creationMode!())
      {
        this.habitApi.createHabitTask(request).subscribe({
          next:()=>{
            this.activityFormSubmitted.emit();
          },
          error:(err)=>{console.log(err)}
          });
      }
      else
      {

          this.habitApi.editHabitTask(this.activity()!.id,request).subscribe({
            next:()=>{
              this.activityFormSubmitted.emit()
            },
            error:(err)=>{console.error(err)}
          })

      }

    }

  }

  onDelete() {
    if (this.activity()?.type==ActivityType.TASK)
    {

    this.taskService.deleteTask(this.activity()!.id).subscribe({
      next: () => {
        this.validActivityForm.reset();
        this.activityDeleted.emit();
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.activityFormSubmitted.emit();
      },
    });
    }
    else
    {
      this.habitApi.deleteHabit(this.activity()!.id).subscribe( {
        next:(response)=>{
          this.activityFormSubmitted.emit();
        },
        error:(err)=>{console.error(err)}
    }
      )
    }

  }

  onPomodoroCreation() {
    this.pomodoroModal.activity =this.activity()!
    this.pomodoroModal.showModal()
  }
  protected readonly ActivityType = ActivityType;
}
