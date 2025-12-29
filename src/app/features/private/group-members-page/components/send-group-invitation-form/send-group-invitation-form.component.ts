import {Component, inject, signal, input, output, DestroyRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, take } from 'rxjs';
import { User } from '../../../../shared/models/group/user.model';
import { GroupInvitationApiService } from '../../../../shared/services/group-invitation-api/group-invitation-api.service';
import { UserApiService } from '../../../../shared/services/user-api/user-api.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-send-group-invitation-form',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,
    NzListModule,
    NzEmptyModule,
    NzSpinModule,
    ReactiveFormsModule,

  ],
  templateUrl: './send-group-invitation-form.component.html',
  styleUrl: './send-group-invitation-form.component.css',
})
export class SendGroupInvitationFormComponent {
  groupId = input.required<string>();
  invitationSent = output<void>();

  private userApi = inject(UserApiService);
  private invitationApi = inject(GroupInvitationApiService);
  private fb = inject(NonNullableFormBuilder);
  private destroyRef = inject(DestroyRef);

  isVisible = signal(false);
  searching = signal(false);
  sending = signal(false);
  sentSuccessfully = signal(false);
  errorMessage = signal<string | null>(null);
  users = signal<User[]>([]);
  selectedUser = signal<User | null>(null);

  searchForm = this.fb.group({
    username: this.fb.control(''),
  });

  constructor() {
    this.searchForm.controls.username.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        if (value && value.length >= 2) {
          this.searchUsers(value);
        } else {
          this.users.set([]);
        }
      });
  }

  open(): void {
    this.isVisible.set(true);
    this.reset();
  }

  close(): void {
    this.isVisible.set(false);
    this.reset();
  }

  private reset(): void {
    this.sentSuccessfully.set(false);
    this.errorMessage.set(null);
    this.selectedUser.set(null);
    this.users.set([]);
    this.searchForm.reset();
  }

  private searchUsers(username: string): void {
    this.searching.set(true);
    this.userApi
      .getUsers({ username, page: 0, size: 5 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.users.set(response.content);
          this.searching.set(false);
        },
        error: () => {
          this.searching.set(false);
        },
      });
  }

  selectUser(user: User): void {
    this.selectedUser.set(user);
  }

  sendInvitation(): void {
    const user = this.selectedUser();
    if (!user || this.sending()) return;

    this.sending.set(true);
    this.sentSuccessfully.set(false);
    this.errorMessage.set(null);

    this.invitationApi
      .createInvitation(this.groupId(), { userId: user.id })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.sending.set(false);
          this.sentSuccessfully.set(true);
          this.invitationSent.emit();
        },
        error: (err) => {
          this.sending.set(false);
          if (err.status === 409) {
            this.errorMessage.set('User already invited or is a member');
          } else if (err.status === 404) {
            this.errorMessage.set('User not found');
          } else {
            this.errorMessage.set('Something went wrong. Please try again.');
          }
        },
      });
  }
}
