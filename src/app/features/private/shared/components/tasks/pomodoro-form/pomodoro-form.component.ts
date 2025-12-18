import {
  Component,
  EventEmitter,
  inject, input,
  Input,
  OnInit,
  Output,
  WritableSignal,
} from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  NzFormControlComponent,
  NzFormItemComponent,
  NzFormLabelComponent,
} from 'ng-zorro-antd/form';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { CreatePomodoroRequest } from '../../../../../shared/models/task-models/create-pomodoro-request';
import { EditPomodoroRequest } from '../../../../../shared/models/task-models/edit-pomodoro-request';
import {ActivityItemDetails, ActivityType} from '../../../../../shared/models/task-models/activity.model';

@Component({
  selector: 'app-pomodoro-form',
  imports: [
    ReactiveFormsModule,
    NzFormItemComponent,
    NzColDirective,
    NzFormControlComponent,
    NzFormLabelComponent,
    FormsModule,
    NzInputNumberComponent,
  ],
  templateUrl: 'pomodoro-form.component.html',
  standalone: true,
  styleUrl: './pomodoro-form.component.css',
})
export class PomodoroFormComponent implements OnInit {
  activity =input.required<ActivityItemDetails>()
  @Input() pomodoroCreation!: WritableSignal<boolean>;
  @Input() pomodoroEdition!: WritableSignal<boolean>;
  @Output() formChanged = new EventEmitter<CreatePomodoroRequest>();
  @Output() editFormChanged = new EventEmitter<EditPomodoroRequest>();

  private formBuilder = inject(NonNullableFormBuilder);

  validPomodoroForm = this.formBuilder.group({
    cyclesRequired: this.formBuilder.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
  });

  ngOnInit() {
    if (this.activity().pomodoro!=undefined)
    {
      this.validPomodoroForm.patchValue({
          cyclesRequired: this.activity().pomodoro?.cyclesRequired
      })
    }
    this.validPomodoroForm.valueChanges.subscribe((value) => {
      if (this.validPomodoroForm.valid) {
        if (this.pomodoroCreation()) {
          this.formChanged.emit(value as CreatePomodoroRequest);
        } else if (this.pomodoroEdition()) {
          this.editFormChanged.emit(value as EditPomodoroRequest);
        }
      }
    });
  }
}
