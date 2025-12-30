import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { GroupInvitationApiService } from '../../../../shared/services/group-invitation-api/group-invitation-api.service';
import { InvitationStatus } from '../../../../shared/models/group/group-invitation.model';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type PageStatus = 'loading' | 'ready' | 'accepted' | 'rejected' | 'error';

@Component({
  selector: 'app-group-invitation-response',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzResultModule,
    NzSpinModule,
    NzCardModule,
    NzIconModule,
    RouterLink,
  ],
  templateUrl: './group-invitation-response.component.html',
  styleUrls: ['./group-invitation-response.component.css'],
})
export class GroupInvitationResponseComponent implements OnInit {
  private invitationApi = inject(GroupInvitationApiService);
  private route = inject(ActivatedRoute);
  private notification = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  status = signal<PageStatus>('loading');
  processing = signal(false);
  groupId = signal<string>('');
  invitationId = signal<string>('');
  token = signal<string>('');
  groupCode = signal<string>('');
  errorMessage = signal<string>('');

  ngOnInit(): void {
    const groupId = this.route.snapshot.paramMap.get('groupId');
    const invitationId = this.route.snapshot.paramMap.get('groupInvitationId');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!groupId || !invitationId || !token) {
      this.status.set('error');
      this.errorMessage.set('Invalid invitation link');
      this.notification.error('Invalid invitation link');
      return;
    }

    this.groupId.set(groupId);
    this.invitationId.set(invitationId);
    this.token.set(token);

    this.status.set('ready');
  }

  acceptInvitation(): void {
    if (this.processing()) return;

    this.processing.set(true);

    this.invitationApi
      .updateInvitationStatus(this.groupId(), this.invitationId(), {
        invitationStatusId: InvitationStatus.ACCEPTED,
        token: this.token(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.processing.set(false);
          this.status.set('accepted');
          this.notification.success(
            'Invitation accepted successfully! Welcome to the group!',
          );
        },
        error: (err) => {
          this.processing.set(false);
          this.status.set('error');

          let errorMsg = '';
          if (err.status === 404) {
            errorMsg = 'Invitation not found or expired';
          } else if (err.status === 409) {
            errorMsg = 'You are already a member of this group';
          } else if (err.status === 401) {
            errorMsg = 'Invalid or expired token';
          } else {
            errorMsg = 'Something went wrong. Please try again.';
          }

          this.errorMessage.set(errorMsg);
          this.notification.error(errorMsg);
        },
      });
  }

  rejectInvitation(): void {
    if (this.processing()) return;

    this.processing.set(true);

    this.invitationApi
      .updateInvitationStatus(this.groupId(), this.invitationId(), {
        invitationStatusId: InvitationStatus.REJECTED,
        token: this.token(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.processing.set(false);
          this.status.set('rejected');
          this.notification.success('Invitation rejected');
        },
        error: (err) => {
          this.processing.set(false);
          this.status.set('error');

          let errorMsg = '';
          if (err.status === 404) {
            errorMsg = 'Invitation not found or expired';
          } else if (err.status === 401) {
            errorMsg = 'Invalid or expired token';
          } else {
            errorMsg = 'Something went wrong. Please try again.';
          }

          this.errorMessage.set(errorMsg);
          this.notification.error(errorMsg);
        },
      });
  }
}
