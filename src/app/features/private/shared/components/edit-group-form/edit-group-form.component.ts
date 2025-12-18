import {
  Component,
  inject,
  signal,
  OnInit,
  output,
  input,
  effect,
} from '@angular/core';
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
import { GroupType } from '../../../../shared/models/group/group-type.model';
import {
  EditGroupDto,
  Group,
} from '../../../../shared/models/group/group.model';
import { GroupMember } from '../../../../shared/models/group/group-member.model';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';

@Component({
  selector: 'app-edit-group-form',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-group-form.component.html',
  styleUrl: './edit-group-form.component.css',
})
export class EditGroupFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  protected groupApiService = inject(GroupApiService);
  private notification = inject(NotificationService);

  group = input.required<Group>();
  members = input<GroupMember[]>([]);
  groupUpdated = output<void>();

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
    groupTypeId: this.fb.control<number | null>(null, [Validators.required]),
    adminId: this.fb.control('', [Validators.required]),
    membersLimit: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(2),
      Validators.max(100),
    ]),
  });

  isVisible = signal(false);
  readonly groupTypes = signal<GroupType[]>([]);
  isLoading = signal(false);

  constructor() {
    effect(() => {
      const currentGroup = this.group();
      if (currentGroup && this.isVisible()) {
        setTimeout(() => {
          this.validateForm.patchValue({
            groupName: currentGroup.groupName,
            groupCurrencySymbol: currentGroup.groupCurrencySymbol ?? '',
            groupTypeId: currentGroup.groupType.id,
            adminId: currentGroup.adminId,
            membersLimit: currentGroup.membersLimit,
          });
        }, 0);
      }
    });
  }

  ngOnInit(): void {
    this.loadGroupTypes();
  }

  private loadGroupTypes(): void {
    this.groupApiService.getGroupTypes().subscribe({
      next: (types) => this.groupTypes.set(types),
      error: (err) => {
        this.notification.handleApiError(err, 'Failed to load group types');
      },
    });
  }

  open(): void {
    this.isVisible.set(true);
  }

  handleEdit(): void {
    if (this.validateForm.valid) {
      this.isLoading.set(true);
      const formValue = this.validateForm.getRawValue();

      const editGroupDto: EditGroupDto = {
        ...formValue,
        groupTypeId: Number(
          formValue.groupTypeId ?? this.group().groupType.id ?? 1,
        ),
        membersLimit: Number(
          formValue.membersLimit ?? this.group().membersLimit ?? 1,
        ),
      };

      this.groupApiService
        .editGroup(this.group().groupId!, editGroupDto)
        .subscribe({
          next: () => {
            this.notification.success('Group updated successfully');
            this.isVisible.set(false);
            this.isLoading.set(false);
            this.groupUpdated.emit();
          },
          error: (err) => {
            this.notification.handleApiError(err, 'Failed to update group');
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
