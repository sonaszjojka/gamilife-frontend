import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePomodoroResponse } from '../../models/task-models/create-pomodoro-response';
import { CreatePomodoroRequest } from '../../models/task-models/create-pomodoro-request';
import { EditPomodoroResponse } from '../../models/task-models/edit-pomodoro-response';
import { EditPomodoroRequest } from '../../models/task-models/edit-pomodoro-request';

@Injectable({
  providedIn: 'root',
})
export class PomodoroTaskService {
  private API_URL = `${environment.apiUrl}/tasks`;
  private http = inject(HttpClient);

  createPomodoro(
    taskId: string,
    request: CreatePomodoroRequest,
  ): Observable<CreatePomodoroResponse> {
    return this.http.post<CreatePomodoroResponse>(
      `${this.API_URL}/${taskId}/pomodoro-tasks`,
      request,
      { withCredentials: true },
    );
  }

  editPomodoro(
    pomodoroId: string,
    request: EditPomodoroRequest,
  ): Observable<EditPomodoroResponse> {
    return this.http.put<EditPomodoroResponse>(
      `${this.API_URL}/pomodoro-tasks/${pomodoroId}`,
      request,
      { withCredentials: true },
    );
  }

  deletePomodoro(pomodoroId: string): Observable<unknown> {
    return this.http.delete(`${this.API_URL}/pomodoro-tasks/${pomodoroId}`, {
      withCredentials: true,
    });
  }
}
