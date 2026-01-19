import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { GroupInvitationApiService } from '../../../shared/services/group-invitation-api/group-invitation-api.service';
import {
  InvitationStatus,
  InvitationStatusId,
} from '../../../shared/models/group/group-invitation.model';
import { NotificationService } from '../../../shared/services/notification-service/notification.service';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-group-invitation-response-page',
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
  templateUrl: './group-invitation-response-page.component.html',
  styleUrls: ['./group-invitation-response-page.component.css'],
})
export class GroupInvitationResponsePageComponent {
  private readonly invitationApi = inject(GroupInvitationApiService);
  private readonly notification = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  groupId = input.required<string>();
  groupInvitationId = input.required<string>();
  token = input<string>();

  processing = signal(false);

  groupInvitation = rxResource({
    params: () => ({
      groupId: this.groupId(),
      invitationId: this.groupInvitationId(),
    }),
    stream: ({ params }) => {
      return this.invitationApi.getById(params.groupId, params.invitationId);
    },
  });
  groupInvitationStatus = computed(() => {
    if (this.groupInvitation.isLoading()) {
      return 'loading';
    }

    const invitation = this.groupInvitation.value();
    if (!invitation) return 'loading';

    switch (invitation.status) {
      case InvitationStatus.SENT:
        return invitation.expiresAt > Date.now() ? 'sent' : 'expired';
      case InvitationStatus.ACCEPTED:
        return 'accepted';
      case InvitationStatus.REJECTED:
        return 'rejected';
      case InvitationStatus.REVOKED:
        return 'revoked';
    }
  });

  errorCode = computed(() => {
    const error = this.groupInvitation.error();
    if (!error) return null;

    if (error.cause instanceof HttpErrorResponse) {
      return error.cause.status;
    }

    return 500;
  });

  acceptInvitation(): void {
    if (this.processing()) return;

    if (!this.token()) {
      this.notification.error('Invitation token is missing');
      this.router.navigate(['/app/dashboard']);
      return;
    }

    this.processing.set(true);

    this.invitationApi
      .updateInvitationStatus(this.groupId(), this.groupInvitationId(), {
        invitationStatusId: InvitationStatusId.ACCEPTED,
        token: this.token()!,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.processing.set(false);
          this.notification.success(
            'Invitation accepted successfully! Welcome to the group!',
          );
          this.router.navigate(['/app/community/groups/', this.groupId()]);
        },
        error: (err) => {
          this.processing.set(false);
          this.handleActionError(err);
        },
      });
  }

  rejectInvitation(): void {
    if (this.processing()) return;

    if (!this.token()) {
      this.notification.error('Invitation token is missing');
      this.router.navigate(['/app/dashboard']);
      return;
    }

    this.processing.set(true);

    this.invitationApi
      .updateInvitationStatus(this.groupId(), this.groupInvitationId(), {
        invitationStatusId: InvitationStatusId.REJECTED,
        token: this.token()!,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.processing.set(false);
          this.notification.success('Invitation rejected');
          this.router.navigate(['/app/dashboard']);
        },
        error: (err) => {
          this.processing.set(false);
          this.handleActionError(err);
        },
      });
  }

  private handleActionError(err: HttpErrorResponse): void {
    let errorMsg = 'Something went wrong. Please try again.';
    if (err.status === 404) {
      errorMsg = 'Invitation not found or expired';
    } else if (err.status === 409) {
      errorMsg = 'You are already a member of this group';
    } else if (err.status === 400) {
      errorMsg = 'Error processing the invitation. Invitation may be expired.';
    }
    this.notification.error(errorMsg);
  }
}
