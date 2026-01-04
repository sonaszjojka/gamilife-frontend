import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../../shared/services/auth/auth.service';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';
import { NzCardComponent } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-email-verification-result',
  imports: [
    NzButtonModule,
    NzResultModule,
    RouterLink,
    CommonModule,
    NzSpinComponent,
    NzCardComponent,
  ],
  templateUrl: './email-verification-result.component.html',
  styleUrl: './email-verification-result.component.css',
})
export class EmailVerificationResultComponent implements OnInit {
  protected status: 'loading' | 'error' = 'loading';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notificationsService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');

    if (!code) {
      this.status = 'error';
      return;
    }

    this.authService
      .verfiyEmail(code)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/app/dashboard']);
          this.notificationsService.success(
            'Email verified successfully! Enjoy your GamiLife experience.',
          );
        },
        error: () => {
          this.status = 'error';
        },
      });
  }
}
