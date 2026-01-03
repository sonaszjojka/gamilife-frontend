import { Component, inject, input, output } from '@angular/core';

import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import {
  NzFormControlComponent,
  NzFormDirective,
  NzFormItemComponent,
  NzFormLabelComponent,
} from 'ng-zorro-antd/form';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import {
  GroupItemModel,
  GroupItemRequestModel,
} from '../../../../shared/models/group/group-item.model';
import { GroupItemApiService } from '../../../../shared/services/group-item-api/group-item-api.service';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'app-group-item-form',
  templateUrl: './group-item-form.component.html',
  imports: [
    CommonModule,
    NzModalModule,
    ReactiveFormsModule,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzInputDirective,
    NzFormDirective,
    NzCheckboxModule,
  ],
  standalone: true,
})
export class GroupItemFormComponent {
  formSubmitted = output<void>();
  private fb = inject(NonNullableFormBuilder);
  item = input<GroupItemModel | null>(null);
  groupId = input.required<string>();
  isVisible = false;

  private readonly groupItemApi = inject(GroupItemApiService);
  private readonly notification = inject(NotificationService);

  protected validateForm = this.fb.group({
    name: this.fb.control<string>('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(30),
    ]),
    price: this.fb.control<number>(1, [
      Validators.required,
      Validators.min(1),
      Validators.max(9999),
    ]),
    isActive: this.fb.control<boolean>(false, [Validators.required]),
  });

  openForm(): void {
    const item = this.item();
    if (item != null) {
      this.validateForm.patchValue({
        name: item.name,
        price: item.price,
        isActive: item.isActive,
      });
    }
    this.isVisible = true;
  }

  handleCreate(): void {
    if (this.validateForm.valid) {
      const createRequest: GroupItemRequestModel = {
        name: this.validateForm.value.name,
        price: this.validateForm.value.price,
        isActive: this.validateForm.value.isActive,
      };

      this.groupItemApi
        .createGroupItem(this.groupId(), createRequest)
        .subscribe({
          next: () => {
            this.notification.success('Item created successfully');
            this.formSubmitted.emit();
          },
          error: (error) => {
            this.notification.handleApiError(error, 'Failed to create Item');
          },
        });
    }
  }

  handleSubmit(): void {
    if (this.validateForm.valid) {
      if (this.item() == null) {
        this.handleCreate();
      } else {
        this.handleEdit();
      }
      this.isVisible = false;
      this.validateForm.reset();
    } else {
      this.notification.showValidationError();
      Object.values(this.validateForm.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.validateForm.reset();
  }

  getTitle(): string {
    if (this.item() == null) {
      return 'Create Item';
    } else {
      return 'Edit Item';
    }
  }

  handleEdit(): void {
    if (this.validateForm.valid) {
      const editRequest: GroupItemRequestModel = {
        name: this.validateForm.value.name,
        price: this.validateForm.value.price,
        isActive: this.validateForm.value.isActive,
      };

      this.groupItemApi
        .editGroupItem(this.groupId(), editRequest, this.item()!.id)
        .subscribe({
          next: () => {
            this.notification.success('Item data updated successfully');
            this.formSubmitted.emit();
          },
          error: (error) => {
            this.notification.handleApiError(
              error,
              'Failed to update Item data',
            );
          },
        });
    }
  }
}
