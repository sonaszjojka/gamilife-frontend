// services/individual-task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../model/task.model';
import { AuthService} from '../../../../shared/services/auth/auth.service';

export interface GetUserTasksResponse {
  tasks: Task[];
}
export interface EditTaskResponse {
  task: Task;
}

@Injectable({
  providedIn: 'root'
})
export class IndividualTaskService {

  constructor(
    private http: HttpClient,
  ) {}

  getUserTasks(): Observable<GetUserTasksResponse> {
    return this.http.get<GetUserTasksResponse>('http://localhost:8080/api/v1/tasks',{withCredentials: true});
  }


  finishTask(task: Task): Observable<EditTaskResponse> {
    const body = {
      title: task.title,
      startTime: task.startTime,
      endTime: task.endTime,
      categoryId: task.categoryId,
      difficultyId: task.difficultyId,
      completedAt: new Date().toISOString(),
      habitTaskId: task.habitTaskId || null,
      previousTaskId: task.previousTaskId || null,
      description: task.description
    };
    return this.http.put<EditTaskResponse>(`http://localhost:8080/api/v1/tasks/${task.taskId}`, body, { withCredentials: true });
  }
}
