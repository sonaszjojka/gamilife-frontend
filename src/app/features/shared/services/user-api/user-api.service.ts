import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { UserDetails, UserFilterParams } from '../../models/user.model';
import { User } from '../../models/user.model';

export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getUsers(params: UserFilterParams): Observable<PagedResponse<User>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('size', params.size.toString());

    if (params.username) {
      httpParams = httpParams.set('username', params.username);
    }

    return this.http.get<PagedResponse<User>>(`${this.apiUrl}/users`, {
      params: httpParams,
    });
  }

  completeOnboarding(
    userId: string,
  ): Observable<{ isTutorialCompleted: boolean }> {
    return this.http.put<{ isTutorialCompleted: boolean }>(
      `${this.apiUrl}/users/${userId}/complete-onboarding`,
      {},
    );
  }

  getLoggedUser(): Observable<UserDetails> {
    const userId = localStorage.getItem('userId');
    return this.http.get<UserDetails>(`${this.apiUrl}/users/${userId}`, {});
  }

  getUserById(userId: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(`${this.apiUrl}/users/${userId}`, {});
  }
}
