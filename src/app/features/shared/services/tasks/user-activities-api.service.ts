import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../../models/util/page.model';
import { ActivityItemDetails } from '../../models/task-models/activity.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserActivitiesApiService {
  private API_URL = `${environment.apiUrl}/activities`;
  private http = inject(HttpClient);

  getAllActivities(
    page: number,
    size: number | null,
    title: string | null,
    startDate: string | null,
    endDate: string | null,
    categoryId: number | null,
    difficultyId: number | null,
    workable: boolean | null,
    pomodoro: boolean | null,
  ): Observable<Page<ActivityItemDetails>> {
    let httpParams = new HttpParams();

    httpParams = httpParams.set('page', page.toString());
    if (size !== null) {
      httpParams = httpParams.set('size', size.toString());
    }
    if (title) {
      httpParams = httpParams.set('title', title);
    }
    if (startDate) {
      httpParams = httpParams.set('startDate', startDate);
    }
    if (endDate) {
      httpParams = httpParams.set('endDate', endDate);
    }
    if (categoryId !== undefined && categoryId !== null) {
      httpParams = httpParams.set('categoryId', categoryId.toString());
    }
    if (difficultyId !== undefined && difficultyId !== null) {
      httpParams = httpParams.set('difficultyId', difficultyId.toString());
    }
    if (workable != null) {
      httpParams = httpParams.set('workable', workable);
    }
    if (pomodoro != null) {
      httpParams = httpParams.set('pomodoro', pomodoro);
    }
    return this.http.get<Page<ActivityItemDetails>>(`${this.API_URL}`, {
      params: httpParams,
      withCredentials: true,
    });
  }
}
