import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { StorageService } from '../../../../shared/services/auth/storage.service';
import { LoginResponse } from '../../models/auth/auth.model';
import {
  OAuthCodeRequest,
  LinkOAuthAccountRequest,
  OAuth2LinkResponse,
} from '../../models/auth/oauth2.model';

@Injectable({
  providedIn: 'root',
})
export class OAuth2Service {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly storage = inject(StorageService);
  private readonly apiUrl = `${environment.apiUrl}/oauth2`;

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

    this.storage.setOAuth2CodeVerifier(codeVerifier);

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

    globalThis.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  handleGoogleCode(
    code: string,
  ): Observable<LoginResponse | OAuth2LinkResponse> {
    const codeVerifier = this.storage.getOAuth2CodeVerifier();

    if (!codeVerifier) {
      throw new Error('Code verifier not found');
    }

    const request: OAuthCodeRequest = {
      code,
      codeVerifier,
    };

    return this.http
      .post<
        LoginResponse | OAuth2LinkResponse
      >(`${this.apiUrl}/code/google`, request, { withCredentials: true })
      .pipe(
        tap((response) => {
          if ('isTutorialCompleted' in response) {
            this.authService.processAfterLoginResponse(response);
          }
        }),
      );
  }

  linkOAuthAccount(
    linkRequest: LinkOAuthAccountRequest,
  ): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/link`, linkRequest, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          this.authService.processAfterLoginResponse(response);
        }),
      );
  }

  clearOAuthData(): void {
    this.storage.removeOAuth2CodeVerifier();
  }
}
