import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class GroupTaskApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;


  public postGroupTask(groupId: string, request: any) {
    return this.http.post(`${this.apiUrl}/groups/${groupId}/tasks`, request, {
      withCredentials: true,
    });
  }

  public deleteGroupTask(groupId: string, taskId: string) {
    return this.http.delete(`${this.apiUrl}/groups/${groupId}/tasks/${taskId}`, {
      withCredentials: true,
    });
  }

  public editGroupTask(groupId: string, taskId: string, request: any) {
    return this.http.put(`${this.apiUrl}/groups/${groupId}/tasks/${taskId}`, request, {
      withCredentials: true,
    });
  }

  public getGroupTasks(groupId: string,params?: any) {
    return this.http.get(`${this.apiUrl}/groups/${groupId}/tasks`, {
      withCredentials: true,
    });
  }


}
