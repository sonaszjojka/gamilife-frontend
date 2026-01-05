import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { UserStatisticsModel } from '../../models/user-profile/user-statistics.model';

@Injectable({
  providedIn: 'root',
})
export class UserStatisticsService {
  private apiURL = `${environment.apiUrl}`;
  private readonly http = inject(HttpClient);

  public getUserStatistics(): Observable<UserStatisticsModel[]> {
    return this.http.get<UserStatisticsModel[]>(`${this.apiURL}/users/stats`, {
      withCredentials: true,
    });
  }
}
