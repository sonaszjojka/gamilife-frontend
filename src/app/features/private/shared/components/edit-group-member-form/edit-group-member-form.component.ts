import { Component, inject, signal, output, input } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GroupMember } from '../../../../shared/models/group/group-member.model';
import { GroupMemberApiService } from '../../../../shared/services/group-member-api/group-member-api.service';
import { EditGroupMemberDto } from '../../../../shared/models/group/group-member.model';
import { take } from 'rxjs/operators';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';

@Component({
  selector: 'app-edit-group-member-form',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-group-member-form.component.html',
})
export class EditGroupMemberFormComponent {
  private fb = inject(NonNullableFormBuilder);
  private groupMemberApi = inject(GroupMemberApiService);
  private notification = inject(NotificationService);

  groupId = input.required<string>();
  member = input<GroupMember | null>(null);
  memberUpdated = output<void>();

  protected validateForm = this.fb.group({
    groupMoney: this.fb.control<number>(0, [
      Validators.required,
      Validators.min(0),
    ]),
    totalEarnedMoney: this.fb.control<number>(0, [
      Validators.required,
      Validators.min(0),
    ]),
  });

  isVisible = signal(false);
  isLoading = signal(false);

  open(member: GroupMember): void {
    this.validateForm.patchValue({
      groupMoney: member.groupMoney ?? 0,
      totalEarnedMoney: member.totalEarnedMoney ?? 0,
    });
    this.isVisible.set(true);
  }

  handleEdit(): void {
    if (this.validateForm.valid && this.member()) {
      this.isLoading.set(true);
      const formValue = this.validateForm.getRawValue();

      const editDto: EditGroupMemberDto = {
        groupMoney: Number(formValue.groupMoney),
        totalEarnedMoney: Number(formValue.totalEarnedMoney),
      };

      this.groupMemberApi
        .editGroupMember(this.groupId(), this.member()!.groupMemberId, editDto)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.notification.success('Member updated successfully');
            this.isVisible.set(false);
            this.isLoading.set(false);
            this.memberUpdated.emit();
          },
          error: (err) => {
            console.error('Failed to update member:', err);
            this.notification.handleApiError(err, 'Failed to update member');
            this.isLoading.set(false);
          },
        });
    } else {
      this.notification.showValidationError();
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
