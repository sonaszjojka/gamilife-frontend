import { Component, inject, Input, OnInit } from '@angular/core';
import { AchievementDto } from '../../../../shared/models/user-profile/user-profile.models';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { UserAchievementsApiService } from '../../../../shared/services/user-achievements-api/user-achievements-api.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';

@Component({
  selector: 'app-achievements-tab',
  imports: [
    NzCardModule,
    NzSpinModule,
    NzProgressModule,
    NzTagModule,
    NzEmptyModule,
    CommonModule,
  ],
  templateUrl: './achievements-tab.component.html',
  styleUrl: './achievements-tab.component.css',
})
export class AchievementsTabComponent implements OnInit {
  @Input() userId!: string;

  achievements: AchievementDto[] = [];
  loading = false;

  protected achievementsService = inject(UserAchievementsApiService);
  private readonly notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.loadAchievements();
  }

  loadAchievements(): void {
    this.loading = true;
    this.achievementsService.getUserAchievements(this.userId).subscribe({
      next: (result) => {
        this.achievements = result.achievements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading achievements:', error);
        this.loading = false;
        this.notificationService.handleApiError(
          error,
          'Failed to load achievements',
        );
      },
    });
  }

  getProgressPercent(achievement: AchievementDto): number {
    return Math.min((achievement.progress / achievement.goal) * 100, 100);
  }

  getProgressStatus(achievement: AchievementDto): 'success' | 'active' {
    return achievement.progress >= achievement.goal ? 'success' : 'active';
  }
}
