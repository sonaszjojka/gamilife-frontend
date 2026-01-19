import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePomodoroResponse } from '../../models/task/create-pomodoro-response';
import { PomodoroRequest } from '../../models/task/pomodoro-request';
import { EditPomodoroResponse } from '../../models/task/edit-pomodoro-response';

@Injectable({
  providedIn: 'root',
})
export class UserPomodoroApiService {
  private API_URL = `${environment.apiUrl}`;
  private http = inject(HttpClient);

  createPomodoro(request: PomodoroRequest): Observable<CreatePomodoroResponse> {
    return this.http.post<CreatePomodoroResponse>(
      `${this.API_URL}/pomodoro-items`,
      request,
      { withCredentials: true },
    );
  }

  editPomodoro(
    pomodoroId: string,
    request: PomodoroRequest,
  ): Observable<EditPomodoroResponse> {
    return this.http.patch<EditPomodoroResponse>(
      `${this.API_URL}/pomodoro-items/${pomodoroId}`,
      request,
      { withCredentials: true },
    );
  }
}
