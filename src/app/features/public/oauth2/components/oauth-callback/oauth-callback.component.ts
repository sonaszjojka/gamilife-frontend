import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import {
  OAuth2Service,
  OAuth2LinkResponse,
  AfterLoginResponse,
} from '../../../../shared/services/oauth2.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-oauth-callback',
  imports: [CommonModule, NzSpinModule],
  templateUrl: './oauth-callback.component.html',
  styleUrl: './oauth-callback.component.css',
  standalone: true,
})
export class OAuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private oauth2Service = inject(OAuth2Service);

  error: string | null = null;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
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
    this.oauth2Service.handleGoogleCode(code).subscribe({
      next: (response) => {
        this.oauth2Service.clearOAuthData();

        if ('providerName' in response) {
          const linkResponse = response as OAuth2LinkResponse;
          this.router.navigateByUrl('/login', {
            state: {
              linkAccount: true,
              provider: linkResponse.providerName,
              providerId: linkResponse.providerId,
              userId: linkResponse.userId,
            },
          });
        } else {
          const loginResponse = response as AfterLoginResponse;
          if (!loginResponse.isEmailVerified) {
            this.router.navigateByUrl('/login', {
              state: {
                showEmailVerification: true,
                email: loginResponse.email,
              },
            });
          } else {
            this.router.navigate(['/dashboard']);
          }
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
        console.error('OAuth error:', err);
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
    });
  }
}
