import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {HabitRequest} from '../../models/task-models/habit-request.model';
import {EditHabitResponse} from '../../models/task-models/edit-habit-response';

@Injectable({
  providedIn: 'root',
})
export class HabitApiService {
  private API_URL = `${environment.apiUrl}/habits`;
  private http = inject(HttpClient);

  createHabit(
    createHabitRequest: HabitRequest,
  ): Observable<HabitRequest> {
    return this.http.post<HabitRequest>(
      `${this.API_URL}`,
      createHabitRequest,
      { withCredentials: true },
    );
  }
  editHabit(
    habitId: string,
    editHabitRequest: HabitRequest,
  ): Observable<EditHabitResponse> {
    return this.http.patch<EditHabitResponse>(
      `${this.API_URL}/${habitId}`,
      editHabitRequest,
      { withCredentials: true },
    );
  }

  deleteHabit(
    habitId: string
  ): Observable<unknown> {
    return this.http.delete( `${this.API_URL}/${habitId}`,
       {withCredentials:true});
  }
}
