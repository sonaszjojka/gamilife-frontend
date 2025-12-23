import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CreateTaskResponse } from '../../models/task-models/create-task-response';
import { EditTaskResponse } from '../../models/task-models/edit-task-response';
import { TaskRequest } from '../../models/task-models/task-request';
import {Page} from '../../models/util/page.model';
import {ActivityItemDetails} from '../../models/task-models/activity.model';

@Injectable({
  providedIn: 'root',
})
export class UserTaskApiService {

  private API_URL = `${environment.apiUrl}/activities`;
  private TASK_API_URL = `${environment.apiUrl}/tasks`;

  private http = inject(HttpClient);


  getAllActivities(
    page:number,
    size:number,
    title:string|null,
    startDate:string|null,
    endDate:string|null,
    categoryId:number|null,
    difficultyId:number|null



  ): Observable<Page<ActivityItemDetails>> {
    let httpParams = new HttpParams();

    httpParams = httpParams.set('page', page.toString());
    httpParams = httpParams.set('size', size.toString());

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
    return this.http.get<Page<ActivityItemDetails>>(`${this.API_URL}`, {
      params: httpParams,
      withCredentials: true,
    });
  }

  editTask(
    taskId: string,
    request: TaskRequest,
  ): Observable<EditTaskResponse> {
    return this.http.patch<EditTaskResponse>(
      `${this.TASK_API_URL}/${taskId}`,
      request,
      { withCredentials: true },
    );
  }


  createTask(request: TaskRequest): Observable<CreateTaskResponse> {
    return this.http.post<CreateTaskResponse>(
      `${this.TASK_API_URL}`,
      request,
      { withCredentials: true },
    );
  }

  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.TASK_API_URL}/${taskId}`, {
      withCredentials: true,
    });
  }
}
