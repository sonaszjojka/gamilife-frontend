import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import {
  EditGroupTaskDto,
  GroupTask,
} from '../../models/group/group-task.model';
import { Observable } from 'rxjs';
import { Page } from '../tasks/individual-task.service';

@Injectable({
  providedIn: 'root',
})
export class GroupTaskApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  public postGroupTask(groupId: string, request: unknown) {
    return this.http.post(`${this.apiUrl}/groups/${groupId}/tasks`, request, {
      withCredentials: true,
    });
  }

  public deleteGroupTask(groupId: string, taskId: string) {
    return this.http.delete(
      `${this.apiUrl}/groups/${groupId}/tasks/${taskId}`,
      {
        withCredentials: true,
      },
    );
  }

  public editGroupTask(
    groupId: string,
    taskId: string,
    request: EditGroupTaskDto,
  ) {
    return this.http.put(
      `${this.apiUrl}/groups/${groupId}/tasks/${taskId}`,
      request,
      {
        withCredentials: true,
      },
    );
  }

  public getGroupTasks(
    groupId: string,
    requestParams: any,
  ): Observable<Page<GroupTask>> {
    return this.http.get<Page<GroupTask>>(
      `${this.apiUrl}/groups/${groupId}/tasks`,
      {
        params: requestParams,
        withCredentials: true,
      },
    );
  }
}
