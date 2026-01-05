import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { OAuth2Service } from '../../../../shared/services/oauth2/oauth2.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../../shared/services/auth/auth.service';
import { StorageService } from '../../../../../shared/services/auth/storage.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-oauth-callback',
  imports: [CommonModule, NzSpinModule],
  templateUrl: './oauth-callback.component.html',
  styleUrl: './oauth-callback.component.css',
  standalone: true,
})
export class OAuthCallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly oauth2Service = inject(OAuth2Service);
  private readonly authService = inject(AuthService);
  private readonly storageService = inject(StorageService);
  private readonly destroyRef = inject(DestroyRef);
  error: string | null = null;

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const code = params['code'];
        const error = params['error'];

        if (error) {
          this.error = 'Authentication failed. Please try again.';
          setTimeout(() => this.router.navigate(['/login']), 3000);
          return;
        }
        if (code) {
          this.handleCallback(code);
        } else {
          this.error = 'No authorization code received.';
          setTimeout(() => this.router.navigate(['/login']), 3000);
        }
      });
  }

  private handleCallback(code: string): void {
    this.oauth2Service
      .handleGoogleCode(code)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.oauth2Service.clearOAuthData();

          if ('providerName' in response) {
            this.router.navigateByUrl('/login', {
              state: {
                linkAccount: true,
                provider: response.providerName,
                providerId: response.providerId,
                userId: response.userId,
              },
            });
          } else {
            this.storageService.setIsTutorialCompleted(
              response.isTutorialCompleted,
            );
            this.storageService.setUserId(response.userId);
            this.authService.userId.set(response.userId);
            this.authService.username.set(response.username);
            this.authService.isTutorialCompleted.set(
              response.isTutorialCompleted,
            );

            this.router.navigate(['/app/dashboard']);
          }
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            const conflictData = err.error;

            const providerName =
              conflictData?.providerName || conflictData?.provider || 'google';
            const providerId =
              conflictData?.providerId || conflictData?.provider_id;
            const userId = conflictData?.userId || conflictData?.user_id;

            if (providerId && userId) {
              this.router.navigateByUrl('/login', {
                state: {
                  linkAccount: true,
                  provider: providerName,
                  providerId: providerId,
                  userId: userId,
                },
              });
              return;
            }
          }

          this.oauth2Service.clearOAuthData();
          this.error = 'Authentication failed. Please try again.';
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
      });
  }
}
