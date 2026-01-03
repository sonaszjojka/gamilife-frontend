import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  DestroyRef,
} from '@angular/core';
import { UserDetails } from '../../../../shared/models/user-profile/user-profile.models';
import { ProfileViewMode } from '../../../../shared/models/user-profile/profile-view-mode.enum';
import { ActivatedRoute } from '@angular/router';
import { UserApiService } from '../../../../shared/services/user-api/user-api.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { UserProfileSidebarComponent } from '../user-profile-sidebar/user-profile-sidebar.component';
import { UserProfileContentComponent } from '../user-profile-content/user-profile-content.component';
import { NzResultComponent } from 'ng-zorro-antd/result';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../shared/services/auth/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-profile-page',
  imports: [
    NzSpinModule,
    UserProfileSidebarComponent,
    UserProfileContentComponent,
    NzResultComponent,
    CommonModule,
    NzButtonModule,
  ],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.css',
})
export class UserProfilePageComponent implements OnInit, OnDestroy {
  userDetails?: UserDetails;
  viewMode: ProfileViewMode = ProfileViewMode.PUBLIC;
  loading = true;

  private destroy$ = new Subject<void>();

  protected route = inject(ActivatedRoute);
  protected userApiService = inject(UserApiService);
  protected authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  public ProfileViewMode = ProfileViewMode;

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const userId = params['userId']
        ? params['userId']
        : this.authService.userId();

      if (userId) {
        this.loadUserProfile(userId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserProfile(userId: string): void {
    this.loading = true;
    this.userDetails = undefined;

    this.userApiService
      .getUserById(userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.userDetails = response;
          this.determineViewMode(userId);
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.notificationService.handleApiError(
            error,
            'Failed to load user profile',
          );
        },
      });
  }

  determineViewMode(profileUserId: string): void {
    const currentUserId = this.getCurrentUserId();

    if (currentUserId === profileUserId) {
      this.viewMode = ProfileViewMode.OWNER;
    } else if (this.userDetails?.isProfilePublic) {
      this.viewMode = ProfileViewMode.PUBLIC;
    } else {
      this.viewMode = ProfileViewMode.PRIVATE;
    }
  }

  onUserDetailsChanged(updatedUser: UserDetails): void {
    this.userDetails = updatedUser;

    if (this.viewMode !== ProfileViewMode.OWNER) {
      this.determineViewMode(updatedUser.id);
    }
  }

  private getCurrentUserId(): string | null {
    return this.authService.userId();
  }
}
