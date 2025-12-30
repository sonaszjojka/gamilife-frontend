import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  ViewChild,
  AfterViewInit,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCarouselComponent, NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { UserApiService } from '../../../../../shared/services/user-api/user-api.service';
import { NotificationService } from '../../../../../shared/services/notification-service/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-onboarding-modal',
  standalone: true,
  imports: [
    CommonModule,
    NzCarouselModule,
    NzButtonModule,
    NzModalModule,
    NzSpinModule,
  ],
  templateUrl: './onboarding-modal.component.html',
  styleUrls: ['./onboarding-modal.component.css'],
})
export class OnboardingModalComponent implements AfterViewInit {
  @Input() visible = false;
  @Input() userId: string | null = null;
  @Output() completed = new EventEmitter<void>();

  @ViewChild(NzCarouselComponent) carousel!: NzCarouselComponent;

  private userApiService = inject(UserApiService);
  private notification = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  currentSlide = 0;
  isLoading = false;

  slides = [
    {
      title: 'Welcome to Your Productivity Hub!',
      description:
        "We're excited to have you here! Let's take a quick tour of the features that will help you stay organized and motivated.",
      icon: '👋',
    },
    {
      title: 'Master Your Tasks',
      description:
        'Create, organize, and track your tasks effortlessly. Set priorities, deadlines, and watch your productivity soar as you check items off your list.',
      icon: '✅',
    },
    {
      title: 'Build Habits That Stick',
      description:
        'Transform your goals into daily habits. Track your streaks, visualize your progress, and watch as small consistent actions lead to big achievements.',
      icon: '🎯',
    },
    {
      title: 'Collaborate in Groups',
      description:
        'Join forces with others! Discover communities, share tasks with your team, and achieve more together. Teamwork makes the dream work!',
      icon: '👥',
    },
    {
      title: 'Level Up with Gamification',
      description:
        'Stay motivated with our reward system! Earn points for completing tasks, maintaining streaks, and hitting milestones. Unlock achievements and exchange points for exciting rewards.',
      icon: '🎮',
    },
    {
      title: "You're All Set!",
      description:
        "Your journey begins now! Dive in, explore the features, and start building the productive life you've always wanted. Let's make it happen!",
      icon: '🚀',
    },
  ];

  ngAfterViewInit(): void {
    if (this.carousel) {
      this.carousel.goTo(0);
    }
  }

  onSlideChange(index: number): void {
    this.currentSlide = index;
  }

  nextSlide(): void {
    if (this.carousel) {
      this.carousel.next();
    }
  }

  prevSlide(): void {
    if (this.carousel) {
      this.carousel.pre();
    }
  }

  get isLastSlide(): boolean {
    return this.currentSlide === this.slides.length - 1;
  }

  get isFirstSlide(): boolean {
    return this.currentSlide === 0;
  }

  completeOnboarding(): void {
    if (!this.userId) {
      this.notification.error('User ID is missing. Please try again.');
      return;
    }

    this.isLoading = true;

    this.userApiService
      .completeOnboarding(this.userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.notification.success(
            'Welcome aboard! Your journey begins now! 🎉',
          );
          this.completed.emit();
        },
        error: (error) => {
          this.isLoading = false;
          this.notification.handleApiError(
            error,
            'Failed to complete onboarding. Please try again.',
          );
        },
      });
  }

  handleButtonClick(): void {
    if (this.isLastSlide) {
      this.completeOnboarding();
    } else {
      this.nextSlide();
    }
  }
}
