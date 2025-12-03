

import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {EditGroupTaskMemberDto, GroupTaskMemberModel} from '../../models/group/group-task-member.model';
@Injectable
({
  providedIn: 'root',
})

export class GroupTaskMemberApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  public assignMemberToTask(groupId: string, taskId: string,request:any): Observable<GroupTaskMemberModel> {
    return this.http.post<GroupTaskMemberModel>(`${this.apiUrl}/groups/${groupId}/group-tasks/${taskId}/participants`, request, {
      withCredentials: true,
    });

  }

  public removeMemberFromTask( groupId: string, taskId: string, participantId: string) {
    return this.http.delete(`${this.apiUrl}/groups/${groupId}/group-tasks/${taskId}/participants/${participantId}`, {
      withCredentials: true,
    });
  }

  public editTaskMemberCompletionStatus(groupId: string, taskId: string, participantId: string, request: EditGroupTaskMemberDto): Observable<GroupTaskMemberModel> {
    return this.http.put<GroupTaskMemberModel>(`${this.apiUrl}/groups/${groupId}/group-tasks/${taskId}/participants/${participantId}`, request, {
      withCredentials: true,
    });
  }



}
