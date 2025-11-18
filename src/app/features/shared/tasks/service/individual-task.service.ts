import {inject, Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../model/task.model';
import {EditTaskResponse} from '../model/edit-task-response';
import {environment} from '../../../../../environments/environment';
import {EditTaskRequest} from '../model/edit-task-request';
import {CreateTaskResponse} from '../model/create-task-response';

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class IndividualTaskService {
  private API_URL = `${environment.apiUrl}/tasks`;

 private http = inject(HttpClient);

  getUserTasks(
    page: number = 0,
    size: number = 10,
    categoryId?: number | null,
    difficultyId?: number | null,
    isCompleted?: boolean | null,
    isGroupTask?: boolean | null
  ): Observable<Page<Task>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (categoryId !== undefined && categoryId !== null) {
      params = params.set('categoryId', categoryId.toString());
    }
    if (difficultyId !== undefined && difficultyId !== null) {
      params = params.set('difficultyId', difficultyId.toString());
    }
    if (isCompleted !== undefined && isCompleted !== null) {
      params = params.set('completed', isCompleted.toString());
    }
    if (isGroupTask !== undefined && isGroupTask !== null) {
      params = params.set('isGroupTask', isGroupTask.toString());
    }

    return this.http.get<Page<Task>>(this.API_URL, {
      params,
      withCredentials: true
    });
  }

  editTask(taskId: string, request: EditTaskRequest): Observable<EditTaskResponse> {
    const body = {
      title: request.title,
      startTime: request.startTime,
      endTime: request.endTime,
      categoryId: request.categoryId,
      difficultyId: request.difficultyId,
      completedAt: request.completedAt,
      description: request.description
    };

    return this.http.put<EditTaskResponse>(
      `${environment.apiUrl}/tasks/${taskId}`,
      body,
      {withCredentials: true}
    );

  }
  createTask(request:EditTaskRequest): Observable<CreateTaskResponse>
  {
    const body = {
      title: request.title,
      startTime: request.startTime,
      endTime: request.endTime,
      categoryId: request.categoryId,
      difficultyId: request.difficultyId,
      completedAt: request.completedAt,
      description: request.description
    };
    return this.http.post<EditTaskResponse>(
      `${environment.apiUrl}/tasks`,
      body,
      {withCredentials: true}
    );

  }

  deleteTask(taskId:String)
  {
    return this.http.delete(`${environment.apiUrl}/tasks/${taskId}`, {withCredentials:true});
  }

}



