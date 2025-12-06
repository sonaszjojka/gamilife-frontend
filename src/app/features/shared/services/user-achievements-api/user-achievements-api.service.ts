import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { GetAllUserAchievementsResult } from '../../models/user-profile/user-profile.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAchievementsApiService {
  private readonly apiUrl = `${environment.apiUrl}/users`;
  protected http = inject(HttpClient);

  getUserAchievements(
    userId: string,
  ): Observable<GetAllUserAchievementsResult> {
    return this.http.get<GetAllUserAchievementsResult>(
      `${this.apiUrl}/${userId}/achievements`,
    );
  }
}
