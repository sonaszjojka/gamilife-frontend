import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  UserDetails,
  UserFilterParams,
  User,
} from '../../models/group/user.model';
import {
  EditUserRequest,
  EditUserResult,
  PagedResponse,
} from '../../models/user-profile/user-profile.models';
import { StorageService } from '../../../../shared/services/auth/storage.service';
import { ChangePasswordRequest } from '../../models/auth/auth.model';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly storageService = inject(StorageService);

  getUsers(params: UserFilterParams): Observable<PagedResponse<User>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('size', params.size.toString());

    if (params.username) {
      httpParams = httpParams.set('username', params.username);
    }

    return this.http.get<PagedResponse<User>>(`${this.apiUrl}/users`, {
      params: httpParams,
      withCredentials: true,
    });
  }

  completeOnboarding(
    userId: string,
  ): Observable<{ isTutorialCompleted: boolean }> {
    return this.http.put<{ isTutorialCompleted: boolean }>(
      `${this.apiUrl}/users/${userId}/complete-onboarding`,
      {},
      { withCredentials: true },
    );
  }

  getLoggedUser(): Observable<UserDetails> {
    const userId = this.storageService.getUserId();
    return this.http.get<UserDetails>(`${this.apiUrl}/users/${userId}`, {
      withCredentials: true,
    });
  }

  getUserById(userId: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(`${this.apiUrl}/users/${userId}`, {
      withCredentials: true,
    });
  }

  updateUser(
    userId: string,
    request: EditUserRequest,
  ): Observable<EditUserResult> {
    return this.http.put<EditUserResult>(
      `${this.apiUrl}/users/${userId}`,
      request,
      { withCredentials: true },
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`/api/v1/auth/change-password`, request, {
      withCredentials: true,
    });
  }
}
