import { Component, inject, signal, OnInit, output } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GroupApiService } from '../../../../shared/services/groups-api/group-api.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { GroupType } from '../../../../shared/models/group-type.model';

@Component({
  selector: 'app-add-group-form',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-group-form.component.html',
  styleUrl: './add-group-form.component.css',
})
export class AddGroupFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  protected groupApiService = inject(GroupApiService);

  groupCreated = output<void>();

  protected validateForm = this.fb.group({
    groupName: this.fb.control('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]),
    groupCurrencySymbol: this.fb.control('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(1),
    ]),
    groupTypeId: this.fb.control('', [Validators.required]),
    membersLimit: this.fb.control('', [
      Validators.required,
      Validators.min(2),
      Validators.max(100),
    ]),
  });

  isVisible = signal(false);
  readonly groupTypes = signal<GroupType[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadGroupTypes();
  }

  private loadGroupTypes(): void {
    this.groupApiService.getGroupTypes().subscribe({
      next: (types) => this.groupTypes.set(types),
      error: (err) => console.error('Failed to load group types:', err),
    });
  }

  open(): void {
    this.isVisible.set(true);
  }

  handleCreate(): void {
    if (this.validateForm.valid) {
      this.isLoading.set(true);
      const formValue = this.validateForm.getRawValue();

      this.groupApiService.createGroup(formValue).subscribe({
        next: () => {
          this.isVisible.set(false);
          this.validateForm.reset();
          this.isLoading.set(false);
          this.groupCreated.emit();
        },
        error: (err) => {
          console.error('Failed to create group:', err);
          this.isLoading.set(false);
        },
      });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
    }
  }

  handleCancel(): void {
    this.isVisible.set(false);
    this.validateForm.reset();
  }
}
