import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { WebSocketNotificationService } from '../websocket-notification-service/web-socket-notification.service';

export interface OAuthCodeRequest {
  code: string;
  codeVerifier: string;
}

export interface LinkOAuthAccountRequest {
  shouldLink: boolean;
  provider?: string;
  providerId?: string;
  userId?: number;
  password?: string;
}

export interface AfterLoginResponse {
  userId: string;
  email: string;
  username: string;
  isEmailVerified: boolean;
  isTutorialCompleted: boolean;
  money: number;
}

export interface OAuth2LinkResponse {
  providerName: string;
  providerId: string;
  userId: number;
}

@Injectable({
  providedIn: 'root',
})
export class OAuth2Service {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/oauth2`;
  private authService = inject(AuthService);
  private notificationService = inject(WebSocketNotificationService);

  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return this.base64UrlEncode(array);
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return this.base64UrlEncode(new Uint8Array(hash));
  }

  private base64UrlEncode(array: Uint8Array): string {
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  async startGoogleLogin(): Promise<void> {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    sessionStorage.setItem('oauth2_code_verifier', codeVerifier);

    const params = new URLSearchParams({
      client_id: environment.googleClientId,
      redirect_uri: environment.googleRedirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      access_type: 'offline',
      prompt: 'consent',
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  handleGoogleCode(
    code: string,
  ): Observable<AfterLoginResponse | OAuth2LinkResponse> {
    const codeVerifier = sessionStorage.getItem('oauth2_code_verifier');

    if (!codeVerifier) {
      throw new Error('Code verifier not found');
    }

    const request: OAuthCodeRequest = {
      code,
      codeVerifier,
    };

    return this.http
      .post<
        AfterLoginResponse | OAuth2LinkResponse
      >(`${this.apiUrl}/code/google`, request, { withCredentials: true })
      .pipe(
        tap((response) => {
          if ('isTutorialCompleted' in response) {
            this.updateAuthServiceState(response);
            this.notificationService.connect();
          }
        }),
      );
  }

  linkOAuthAccount(
    linkRequest: LinkOAuthAccountRequest,
  ): Observable<AfterLoginResponse> {
    return this.http
      .post<AfterLoginResponse>(`${this.apiUrl}/link`, linkRequest, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          this.updateAuthServiceState(response);
          this.notificationService.connect();
        }),
      );
  }

  clearOAuthData(): void {
    sessionStorage.removeItem('oauth2_code_verifier');
  }

  private updateAuthServiceState(response: AfterLoginResponse): void {
    this.authService.userId.set(response.userId);
    this.authService.username.set(response.username);
    this.authService.loggedIn.set(true);
    this.authService.isTutorialCompleted.set(response.isTutorialCompleted);
    this.authService.money.set(response.money);

    localStorage.setItem('userId', response.userId);
    localStorage.setItem('username', response.username);
    localStorage.setItem(
      'isTutorialCompleted',
      String(response.isTutorialCompleted),
    );
    localStorage.setItem('money', String(response.money));
  }
}
