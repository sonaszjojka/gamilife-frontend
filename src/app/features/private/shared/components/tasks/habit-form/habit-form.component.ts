import {
  Component,
  EventEmitter,
  inject,
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

@Component({
  selector: 'app-habit-form',
  imports: [
    ReactiveFormsModule,
    NzFormItemComponent,
    NzColDirective,
    NzFormControlComponent,
    NzFormLabelComponent,
    FormsModule,
    NzInputNumberComponent,
  ],
  templateUrl: 'habit-form.component.html',
  standalone: true,
  styleUrl: './habit-form.component.css',
})
export class HabitFormComponent implements OnInit {
  @Input() habitCreation!: WritableSignal<boolean>;
  @Input() habitEdition!: WritableSignal<boolean>;
  @Output() formChanged = new EventEmitter<number>();
  @Output() editFormChanged = new EventEmitter<number>();

  private formBuilder = inject(NonNullableFormBuilder);

  validHabitForm = this.formBuilder.group({
    cycleLength: this.formBuilder.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
  });

  ngOnInit() {
    this.validHabitForm.valueChanges.subscribe((value) => {
      if (this.validHabitForm.valid) {
        if (this.habitCreation()) {
          this.formChanged.emit(value.cycleLength!);
        } else if (this.habitEdition()) {
          this.editFormChanged.emit(value.cycleLength!);
        }
      }
    });
  }
}
