import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingModalComponent } from '../onboarding/onboarding-modal/onboarding-modal.component';
import { AuthService } from '../../../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, OnboardingModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);

  userId = signal<string | null>(null);
  showOnboarding = signal<boolean>(false);

  constructor() {
    effect(() => {
      const isTutorialCompleted = this.authService.isTutorialCompleted();

      if (!isTutorialCompleted && this.authService.loggedIn()) {
        this.showOnboarding.set(true);
      } else {
        this.showOnboarding.set(false);
      }
    });
  }

  ngOnInit(): void {
    const id = this.authService.userId();
    this.userId.set(id);
    this.checkOnboardingStatus();
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
}
