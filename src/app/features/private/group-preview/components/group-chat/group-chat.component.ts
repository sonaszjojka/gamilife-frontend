import {
  Component,
  inject,
  input,
  OnInit,
  OnDestroy,
  signal,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { Subject } from 'rxjs';

import { ChatMessageApiService } from '../../../../shared/services/chat-messages-api/chat-messages-api.service';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';
import {
  ChatMessageDto,
  GetChatMessagesParams,
} from '../../../../shared/models/chat-messages/chat-message.model';
import { GroupPreviewMode } from '../../../../shared/models/group/group-preview-mode';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-group-chat',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzDrawerModule,
    NzListModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,
    NzCheckboxModule,
    NzEmptyModule,
    NzTagModule,
    NzPaginationModule,
  ],
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css'],
})
export class GroupChatComponent implements OnInit, OnDestroy {
  groupId = input.required<string>();
  groupMemberId = input.required<string>();
  mode = input.required<GroupPreviewMode>();

  protected visible = signal<boolean>(false);
  protected loading = signal<boolean>(false);
  protected sending = signal<boolean>(false);
  protected messages = signal<ChatMessageDto[]>([]);
  protected messageForm!: FormGroup;

  protected totalElements = signal<number>(0);
  protected currentPage = signal<number>(1);
  protected pageSize = signal<number>(20);
  protected showImportantOnly = signal<boolean>(false);

  protected readonly GroupPreviewMode = GroupPreviewMode;

  private destroy$ = new Subject<void>();
  private readonly chatMessageApi = inject(ChatMessageApiService);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.messageForm = this.fb.group({
      content: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(255),
        ],
      ],
      isImportant: [false],
    });
  }

  open(): void {
    this.visible.set(true);
    this.loadMessages();
  }

  close(): void {
    this.visible.set(false);
    this.messageForm.reset({ content: '', isImportant: false });
  }

  private loadMessages(): void {
    this.loading.set(true);

    const params: GetChatMessagesParams = {
      page: this.currentPage() - 1,
      size: this.pageSize(),
      isImportant: this.showImportantOnly() ? true : undefined,
    };

    this.chatMessageApi
      .getChatMessages(this.groupId(), this.groupMemberId(), params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.messages.set(result.content);
          this.totalElements.set(result.totalElements);
          this.loading.set(false);
        },
        error: (err) => {
          this.notification.handleApiError(err, 'Failed to load messages');
          this.loading.set(false);
        },
      });
  }

  protected onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadMessages();
  }

  protected toggleImportantFilter(): void {
    this.showImportantOnly.set(!this.showImportantOnly());
    this.currentPage.set(1);
    this.loadMessages();
  }

  protected sendMessage(): void {
    if (this.messageForm.invalid) {
      Object.values(this.messageForm.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    this.sending.set(true);

    const formValue = this.messageForm.value;

    this.chatMessageApi
      .createChatMessage(this.groupId(), this.groupMemberId(), {
        content: formValue.content,
        isImportant: formValue.isImportant || false,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notification.success('Message sent successfully');
          this.messageForm.reset({ content: '', isImportant: false });
          this.currentPage.set(1);
          this.loadMessages();
          this.sending.set(false);
        },
        error: (err) => {
          this.notification.handleApiError(err, 'Failed to send message');
          this.sending.set(false);
        },
      });
  }

  protected isAdmin(): boolean {
    return this.mode() === GroupPreviewMode.ADMIN;
  }
}
