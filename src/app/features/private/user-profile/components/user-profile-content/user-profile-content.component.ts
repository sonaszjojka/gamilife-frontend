import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ProfileTab } from '../../../../shared/models/user-profile/profile-tab.enum';
import { ProfileViewMode } from '../../../../shared/models/user-profile/profile-view-mode.enum';
import { UserDetails } from '../../../../shared/models/group/user.model';
import { AchievementsTabComponent } from '../achievements-tab/achievements-tab.component';
import { BadgesTabComponent } from '../badges-tab/badges-tab.component';
import { AvatarCustomizationTabComponent } from '../avatar-customization-tab/avatar-customization-tab.component';
import { ProfileSettingsTabComponent } from '../profile-settings-tab/profile-settings-tab.component';

@Component({
  selector: 'app-user-profile-content',
  standalone: true,
  imports: [
    CommonModule,
    NzTabsModule,
    NzIconModule,
    AchievementsTabComponent,
    BadgesTabComponent,
    AvatarCustomizationTabComponent,
    ProfileSettingsTabComponent,
  ],
  templateUrl: './user-profile-content.component.html',
  styleUrl: './user-profile-content.component.css',
})
export class UserProfileContentComponent {
  @Input() userDetails!: UserDetails;
  @Input() viewMode!: ProfileViewMode;
  @Output() userDetailsChanged = new EventEmitter<UserDetails>();

  ProfileViewMode = ProfileViewMode;
  ProfileTab = ProfileTab;
  selectedTabIndex = 0;

  onSettingsUpdated(updatedUser: UserDetails): void {
    this.userDetailsChanged.emit(updatedUser);
  }
}
