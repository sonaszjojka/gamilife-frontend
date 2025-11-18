import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreatePomodoroResponse} from '../model/create-pomodoro-response';
import {CreatePomodoroRequest} from '../model/create-pomodoro-request';


@Injectable({

  providedIn:'root'
})

export class PomodoroTaskService
{
  private API_URL = `${environment.apiUrl}/tasks`;
  private http = inject(HttpClient)

  createPomodoro (taskId:string,request:CreatePomodoroRequest): Observable<CreatePomodoroResponse>
{
  return this.http.post(`${this.API_URL}/${taskId}/pomodoro-tasks`,request,{withCredentials:true})
}


}
