import {Component, EventEmitter, inject, Input, Output, WritableSignal} from '@angular/core';
import {FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzColDirective} from 'ng-zorro-antd/grid';
import {NzInputDirective} from 'ng-zorro-antd/input';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzInputNumberComponent} from 'ng-zorro-antd/input-number';
import {CreatePomodoroRequest} from '../../model/create-pomodoro-request';

@Component(
{
  selector:'app-pomodoro-form',
  imports:
    [
      ReactiveFormsModule,
      NzFormItemComponent,
      NzColDirective,
      NzFormControlComponent,
      NzFormLabelComponent,
      NzInputDirective,
      NzIconDirective,
      FormsModule,
      NzInputNumberComponent
    ],
  templateUrl:'pomodoro-form.component.html',
  standalone:true,
  styleUrl:'./pomodoro-form.component.css'
})
export class PomodoroFormComponent
{
  @Input() pomodoroCreation!: WritableSignal<boolean>;
  @Output() formChanged=new EventEmitter<CreatePomodoroRequest>();


  private formBuilder=inject(NonNullableFormBuilder)


  validPomodoroForm = this.formBuilder.group({
    workCyclesNeeded: this.formBuilder.control<number|null>(null,[
      Validators.required,
      Validators.min(1),
    ]),
    workCyclesCompleted: this.formBuilder.control<number|null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
  })

  ngOnInit(){
    this.validPomodoroForm.valueChanges.subscribe(value => {
      if (this.validPomodoroForm.valid)
      {
        this.formChanged.emit(value as CreatePomodoroRequest)
      }

    })
}



}
