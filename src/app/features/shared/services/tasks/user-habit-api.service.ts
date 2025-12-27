import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HabitRequest } from '../../models/task-models/habit-request.model';
import { HabitResponseModel } from '../../models/task-models/habit-response.model';
import { Page } from '../../models/util/page.model';
import { ActivityItemDetails } from '../../models/task-models/activity.model';

@Injectable({
  providedIn: 'root',
})
export class UserHabitApiService {
  private API_URL = `${environment.apiUrl}/habits`;
  private http = inject(HttpClient);

  getHabits(
    page: number,
    size: number | null,
    isAlive: boolean | null,
    categoryId: number | null,
    difficultyId: number | null,
  ): Observable<Page<ActivityItemDetails>> {
    let httpParams = new HttpParams();

    httpParams = httpParams.set('page', page.toString());

    if (size !== null) {
      httpParams = httpParams.set('size', size.toString());
    }
    if (isAlive !== null) {
      httpParams = httpParams.set('isAlive', isAlive);
    }
    if (categoryId !== undefined && categoryId !== null) {
      httpParams = httpParams.set('categoryId', categoryId.toString());
    }
    if (difficultyId !== undefined && difficultyId !== null) {
      httpParams = httpParams.set('difficultyId', difficultyId.toString());
    }

    return this.http.get<Page<ActivityItemDetails>>(`${this.API_URL}`, {
      params: httpParams,
      withCredentials: true,
    });
  }

  createHabit(createHabitRequest: HabitRequest): Observable<HabitRequest> {
    return this.http.post<HabitRequest>(`${this.API_URL}`, createHabitRequest, {
      withCredentials: true,
    });
  }
  editHabit(
    habitId: string,
    editHabitRequest: HabitRequest,
  ): Observable<HabitResponseModel> {
    return this.http.patch<HabitResponseModel>(
      `${this.API_URL}/${habitId}`,
      editHabitRequest,
      { withCredentials: true },
    );
  }

  deleteHabit(habitId: string): Observable<unknown> {
    return this.http.delete(`${this.API_URL}/${habitId}`, {
      withCredentials: true,
    });
  }
}
