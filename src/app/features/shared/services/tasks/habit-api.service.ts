import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {HabitRequest} from '../../models/task-models/habit-request.model';

@Injectable({
  providedIn: 'root',
})
export class HabitTaskService {
  private API_URL = `${environment.apiUrl}/habits`;
  private http = inject(HttpClient);

  createHabitTask(
    createHabitRequest: HabitRequest,
  ): Observable<HabitRequest> {
    return this.http.post<HabitRequest>(
      `${this.API_URL}`,
      createHabitRequest,
      { withCredentials: true },
    );
  }
  editHabitTask(
    habitId: string,
    taskId: string,
    editHabitRequest: HabitRequest,
  ): Observable<HabitRequest> {
    return this.http.put<HabitRequest>(
      `${this.API_URL}/${taskId}/habits/${habitId}`,
      editHabitRequest,
      { withCredentials: true },
    );
  }
}
