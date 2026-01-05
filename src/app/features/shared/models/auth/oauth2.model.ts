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

export interface OAuth2LinkResponse {
  providerName: string;
  providerId: string;
  userId: number;
}
