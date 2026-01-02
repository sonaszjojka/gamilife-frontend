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
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';
import {
  GroupShopModel,
  GroupShopRequestModel,
} from '../../../../shared/models/group/group-shop.model';
import { GroupShopApiService } from '../../../../shared/services/group-shop-api/group-shop-api.service';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-group-shop-form',
  templateUrl: './group-shop-form.component.html',
  imports: [
    CommonModule,
    NzModalModule,
    ReactiveFormsModule,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzInputDirective,
    NzFormDirective,
    NzButtonComponent,
    NzIconDirective,
  ],
  standalone: true,
})
export class GroupShopFormComponent {
  formSubmitted = output<void>();
  private fb = inject(NonNullableFormBuilder);
  shop = input<GroupShopModel>();
  groupId = input.required<string>();
  isVisible = false;

  private readonly groupShopApi = inject(GroupShopApiService);
  private readonly notification = inject(NotificationService);

  protected validateForm = this.fb.group({
    name: this.fb.control<string>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(200),
    ]),
    description: this.fb.control<string>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(200),
    ]),
  });

  openForm(): void {
    const shop = this.shop();
    if (shop != null) {
      this.validateForm.patchValue({
        name: shop.name,
        description: shop.description,
      });
    }
    this.isVisible = true;
  }

  handleSubmit(): void {
    if (this.validateForm.valid) {
      const request: GroupShopRequestModel = {
        name: this.validateForm.value.name,
        description: this.validateForm.value.description,
      };
      console.log(request);
      this.groupShopApi.editGroupShop(this.groupId(), request).subscribe({
        next: () => {
          this.notification.success('Shop data updated successfully');
          this.formSubmitted.emit();
        },
        error: (error) => {
          console.log(error);
          this.notification.handleApiError(error, 'Failed to update Shop data');
        },
      });
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
    return 'Edit' + this.shop()?.name;
  }
}
