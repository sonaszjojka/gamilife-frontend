import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  input,
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
import { PomodoroRequest } from '../../../shared/models/task-models/pomodoro-request';
import { ActivityItemDetails } from '../../../shared/models/task-models/activity.model';
import { NotificationService } from '../../../shared/services/notification-service/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  activity = input.required<ActivityItemDetails>();
  @Input() pomodoroCreation!: WritableSignal<boolean>;
  @Input() pomodoroEdition!: WritableSignal<boolean>;
  @Output() formChanged = new EventEmitter<PomodoroRequest>();

  private formBuilder = inject(NonNullableFormBuilder);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  validPomodoroForm = this.formBuilder.group({
    cyclesRequired: this.formBuilder.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
  });

  ngOnInit() {
    this.validPomodoroForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (value) => {
          if (this.validPomodoroForm.valid) {
            this.formChanged.emit(value as PomodoroRequest);
          }
        },
        () => {
          this.notificationService.error(
            'Error occurred changing required cycles',
          );
        },
      );
    if (this.activity().pomodoro) {
      this.validPomodoroForm.patchValue({
        cyclesRequired: this.activity().pomodoro?.cyclesRequired,
      });
    }
  }
}
