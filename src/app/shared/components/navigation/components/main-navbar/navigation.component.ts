import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AuthService } from '../../../../services/auth/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { FormsModule } from '@angular/forms';
import { UserAccountButtonComponent } from '../user-account-button/user-account-button/user-account-button.component';
import { NotificationDropdownComponent } from '../notification-dropdown/notification-dropdown/notification-dropdown.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzAffixModule } from 'ng-zorro-antd/affix';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzMenuModule,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
    NzSwitchModule,
    NzProgressModule,
    FormsModule,
    UserAccountButtonComponent,
    NotificationDropdownComponent,
    NzLayoutModule,
    NzAffixModule,
  ],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent {
  public authService = inject(AuthService);

  userMoney = this.authService.money;
  isLoggedIn = this.authService.loggedIn;
  userLevel = this.authService.level;
  userExperience = this.authService.experience;
  requiredExperience = this.authService.requiredExperienceForNextLevel;

  experiencePercentage = computed(() => {
    return this.authService.getExperiencePercentage();
  });
}
