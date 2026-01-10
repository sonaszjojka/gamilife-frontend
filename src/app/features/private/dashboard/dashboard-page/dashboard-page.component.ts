import {
  Component,
  OnInit,
  inject,
  signal,
  effect,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingModalComponent } from '../components/onboarding-modal/onboarding-modal.component';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { UserActivitiesApiService } from '../../../shared/services/tasks/user-activities-api.service';
import { GroupApiService } from '../../../shared/services/groups-api/group-api.service';

import {
  Group,
  GroupFilterParams,
} from '../../../shared/models/group/group.model';
import { ActivityItemDetails } from '../../../shared/models/task-models/activity.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../shared/services/notification-service/notification.service';
import { GroupCarouselComponent } from '../components/group-carousel/group-carousel.component';
import { UserStatisticsModel } from '../../../shared/models/user-profile/user-statistics.model';
import { UserStatisticsService } from '../../../shared/services/user-statistics-api/user-statistics.service';
import { UserStatisticsCardComponent } from '../components/user-statistics-card/user-statistics-card.component';
import { DashboardActivitiesComponent } from '../components/dashboard-activities/dashboard-activities.component';
import { DashboardInputSearchComponent } from '../components/dashboard-input-search/dashboard-input-search.component';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    OnboardingModalComponent,
    GroupCarouselComponent,
    UserStatisticsCardComponent,
    DashboardActivitiesComponent,
    DashboardInputSearchComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css'],
})
export class DashboardPageComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly activityApi = inject(UserActivitiesApiService);
  private readonly groupApi = inject(GroupApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly userStatisticsApi = inject(UserStatisticsService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  groups: Group[] = [];
  username = this.authService.username();
  groupCurrentPage = signal<number>(0);
  groupTotalPage = signal<number>(1);
  groupParams: GroupFilterParams = {
    groupType: undefined,
    groupName: undefined,
    page: this.groupCurrentPage(),
    size: 3,
  };
  activities: ActivityItemDetails[] = [];
  statistics: UserStatisticsModel[] = [];

  userId = signal<string | null>(null);
  showOnboarding = signal<boolean>(false);
  isActivityListLoading = signal<boolean>(true);
  isGroupListLoading = signal<boolean>(true);
  isStatisticsCardLoading = signal<boolean>(true);

  constructor() {
    effect(() => {
      const isTutorialCompleted = this.authService.isTutorialCompleted();
      if (!isTutorialCompleted && this.authService.loggedIn()) {
        this.showOnboarding.set(true);
      } else {
        this.showOnboarding.set(false);
      }
    });

    this.breakpointObserver
      .observe(['(min-width: 1600px)', '(min-width: 1250px)'])
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        let newSize = 1;

        if (result.breakpoints['(min-width: 1600px)']) {
          newSize = 3;
        } else if (result.breakpoints['(min-width: 1250px)']) {
          newSize = 2;
        }

        if (this.groupParams.size !== newSize) {
          this.groupParams.size = newSize;
          this.loadGroups(0);
        }
      });
  }

  ngOnInit(): void {
    const id = this.authService.userId();
    this.userId.set(id);
    this.checkOnboardingStatus();
    this.loadGroups(0);
    this.loadActivities();
    this.loadStatistics();
  }

  loadGroups(page: number) {
    this.isGroupListLoading.set(true);
    this.groupParams.page = page;
    this.groupApi
      .getAllGroupsByUserIdWhereUserIsMember(this.groupParams)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.groups = response.content;
          this.groupCurrentPage.set(response.currentPage);
          this.groupTotalPage.set(response.totalPages);
          this.isGroupListLoading.set(false);
        },
        error: () => {
          this.notificationService.error('Error occurred loading your groups');
          this.isGroupListLoading.set(false);
        },
      });
  }

  onGroupSearch(searchTerm: string) {
    this.groupParams.groupName = searchTerm;
    this.loadGroups(0);
  }

  loadActivities() {
    this.isActivityListLoading.set(true);

    this.activityApi
      .getAllActivities(
        0,
        null,
        null,
        new Date(Date.now()).toISOString().slice(0, 10),
        new Date(Date.now()).toISOString().slice(0, 10),
        null,
        null,
        true,
        null,
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.isActivityListLoading.set(false);
          this.activities = response.content;
        },
        error: () => {
          this.isActivityListLoading.set(false);
          this.notificationService.error(
            'Error occurred loading your activities',
          );
        },
      });
  }

  loadStatistics() {
    this.isStatisticsCardLoading.set(true);
    this.userStatisticsApi
      .getUserStatistics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.isStatisticsCardLoading.set(false);
          console.log(response);
          this.statistics = response;
        },
        error: () => {
          this.isStatisticsCardLoading.set(false);
          this.notificationService.error(
            'Error occurred loading your statistics',
          );
        },
      });
  }

  private checkOnboardingStatus(): void {
    const isTutorialCompleted = this.authService.isTutorialCompleted();

    if (!isTutorialCompleted) {
      this.showOnboarding.set(true);
    }
  }

  onOnboardingCompleted(): void {
    this.showOnboarding.set(false);
    this.authService.completeUserOnboarding();
  }

  onActivityFinished(activityId: string) {
    this.activities = this.activities.filter((a) => a.id !== activityId);
  }
}
