import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../model/task.model';
import {EditTaskResponse} from '../model/edit-task-response';
import {environment} from '../../../../../environments/environment';

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

  constructor(private http: HttpClient) {}

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

  finishTask(task: Task): Observable<EditTaskResponse> {
    const body = {
      title: task.title,
      startTime: task.startTime,
      endTime: task.endTime,
      categoryId: task.categoryId,
      difficultyId: task.difficultyId,
      completedAt: new Date().toISOString(),
      description: task.description
    };

    return this.http.put<EditTaskResponse>(
      `${environment.apiUrl}/tasks/${task.taskId}`,
      body,
      { withCredentials: true }
    );

  }
}
