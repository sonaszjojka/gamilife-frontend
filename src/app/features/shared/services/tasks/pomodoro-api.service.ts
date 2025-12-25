import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePomodoroResponse } from '../../models/task-models/create-pomodoro-response';
import { PomodoroRequest } from '../../models/task-models/pomodoro-request';
import { EditPomodoroResponse } from '../../models/task-models/edit-pomodoro-response';
import {Page} from '../../models/util/page.model';
import {ActivityItemDetails} from '../../models/task-models/activity.model';

@Injectable({
  providedIn: 'root',
})
export class PomodoroApiService {
  private API_URL = `${environment.apiUrl}`;
  private http = inject(HttpClient);

  getPomodoroActivities(page:number,
               size:number|null,
               title:string|null,
               workable:boolean|null,
               pomodoro:boolean|null): Observable<Page<ActivityItemDetails>> {

  let httpParams = new HttpParams();

  httpParams = httpParams.set('page', page.toString());
  if (size !== null)
{
  httpParams = httpParams.set('size', size.toString());
}
if (title) {
  httpParams = httpParams.set('title', title);
}
if(workable!=null)
{
  httpParams = httpParams.set('workable', workable);
}
if(pomodoro!=null)
{
  httpParams = httpParams.set('pomodoro', pomodoro);
}
return this.http.get<Page<ActivityItemDetails>>(`${this.API_URL}/pomodoro-activities`, {
  params: httpParams,
  withCredentials: true,
})
}

  createPomodoro(
    request: PomodoroRequest,
  ): Observable<CreatePomodoroResponse> {
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

  deletePomodoro(pomodoroId: string): Observable<unknown> {
    return this.http.delete(`${this.API_URL}/pomodoro-items/${pomodoroId}`, {
      withCredentials: true,
    });
  }
}
