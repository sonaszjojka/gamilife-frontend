import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {CreateHabitRequest} from '../../models/task-models/create-habit-request';
import {Observable} from 'rxjs';
import {CreateHabitResponse} from '../../models/task-models/create-habit-response';

@Injectable({
  providedIn: 'root'

})


export class HabitTaskService {
  private API_URL = `${environment.apiUrl}/tasks`;
  private http = inject(HttpClient);


createHabitTask(taskId: string, createHabitRequest: CreateHabitRequest) :Observable<CreateHabitResponse> {

    return this.http.post<CreateHabitResponse>
    (`${this.API_URL}/${taskId}/habits`, createHabitRequest,
      {withCredentials: true}
    );

  }
editHabitTask(habitId:string,taskId:string, editHabitRequest:CreateHabitRequest):Observable<CreateHabitResponse>{
    return this.http.put<CreateHabitResponse>
    (`${this.API_URL}/${taskId}/habits/${habitId}`,editHabitRequest,
      {withCredentials:true}
    );
  }






}
