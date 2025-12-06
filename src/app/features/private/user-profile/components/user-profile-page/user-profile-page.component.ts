import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-user-profile-page',
  imports: [
    NzSpinModule,
    UserProfileSidebarComponent,
    UserProfileContentComponent,
    NzResultComponent,
    CommonModule,
  ],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.css',
})
export class UserProfilePageComponent implements OnInit {
  userDetails?: UserDetails;
  viewMode: ProfileViewMode = ProfileViewMode.PUBLIC;
  loading = true;

  protected route = inject(ActivatedRoute);
  protected userApiService = inject(UserApiService);
  protected authService = inject(AuthService);

  ngOnInit(): void {
    const userId = this.authService.userId();
    if (userId) {
      this.loadUserProfile(userId);
    }
  }

  loadUserProfile(userId: string): void {
    this.loading = true;
    this.userApiService.getUserById(userId).subscribe({
      next: (response) => {
        this.userDetails = response;
        this.determineViewMode(userId);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.loading = false;
      },
    });
  }

  determineViewMode(profileUserId: string): void {
    const currentUserId = this.getCurrentUserId();

    if (currentUserId === profileUserId) {
      this.viewMode = ProfileViewMode.OWNER;
    } else if (!this.userDetails?.isProfilePublic) {
      this.viewMode = ProfileViewMode.PRIVATE;
    } else {
      this.viewMode = ProfileViewMode.PUBLIC;
    }
  }

  onUserDetailsChanged(updatedUser: UserDetails): void {
    this.userDetails = updatedUser;

    if (this.viewMode !== ProfileViewMode.OWNER) {
      this.determineViewMode(updatedUser.id);
    }
  }

  private getCurrentUserId(): string | null {
    return localStorage.getItem('userId');
  }
}
