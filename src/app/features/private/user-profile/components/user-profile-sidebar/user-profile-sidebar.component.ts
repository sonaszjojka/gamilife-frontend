import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { UserDetails } from '../../../../shared/models/group/user.model';
import { ProfileViewMode } from '../../../../shared/models/user-profile/profile-view-mode.enum';
import { UserInventoryItemDto } from '../../../../shared/models/user-profile/user-profile.models';
import { UserInventoryService } from '../../../../shared/services/user-inventory-api/user-inventory-api.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { CommonModule } from '@angular/common';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { BadgeItemComponent } from '../badge-item/badge-item.component';
import { ItemSlotEnum } from '../../../../shared/models/gamification/item-slot.enum';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-profile-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzProgressModule,
    NzEmptyModule,
    BadgeItemComponent,
    NzAvatarModule,
    NzStatisticModule,
    NzIconModule,
    NzSpinModule,
    NzButtonModule,
    NzListModule,
  ],
  templateUrl: './user-profile-sidebar.component.html',
  styleUrl: './user-profile-sidebar.component.css',
})
export class UserProfileSidebarComponent implements OnInit {
  @Input() userDetails!: UserDetails;
  @Input() viewMode!: ProfileViewMode;

  ProfileViewMode = ProfileViewMode;
  badges: UserInventoryItemDto[] = [];
  displayedBadges: UserInventoryItemDto[] = [];
  loadingBadges = false;

  currentLevel: number | null = 0;
  requiredExperience = 0;
  pointsToNextLevel = 0;
  levelProgress = 0;
  isMaxLevel = false;

  protected inventoryService = inject(UserInventoryService);
  private readonly notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.calculateLevel();
    this.loadBadges();
  }

  loadBadges(): void {
    if (this.viewMode === ProfileViewMode.PRIVATE) {
      return;
    }

    this.loadingBadges = true;

    this.inventoryService
      .getUserInventoryItems(this.userDetails.id, {
        itemSlot: ItemSlotEnum.BADGE,
        page: 0,
        size: 12,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.badges = result.content;
          this.displayedBadges = this.badges.slice(0, 8);
          this.loadingBadges = false;
        },
        error: (error) => {
          this.loadingBadges = false;
          this.notificationService.handleApiError(
            error,
            'Failed to load user badges',
          );
        },
      });
  }

  trackByBadgeId(index: number, item: UserInventoryItemDto): string {
    return item.id;
  }

  calculateLevel(): void {
    this.currentLevel = this.userDetails.level;

    if (this.userDetails.requiredExperience === null) {
      this.isMaxLevel = true;
      this.pointsToNextLevel = 0;
      this.levelProgress = 100;
      this.requiredExperience = this.userDetails.experience!;
    } else {
      this.isMaxLevel = false;
      this.requiredExperience = this.userDetails.requiredExperience;
      this.pointsToNextLevel =
        this.requiredExperience - this.userDetails.experience!;
      this.levelProgress = Math.min(
        (this.userDetails.experience! / this.requiredExperience) * 100,
        100,
      );
    }
  }
}
