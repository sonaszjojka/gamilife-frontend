import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import {
  CreateGroupMemberInOpenGroupResult,
  EditGroupMemberDto,
} from '../../models/group-member.model';

@Injectable({
  providedIn: 'root',
})
export class GroupMemberApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  leaveGroup(groupId: string, groupMemberId: string): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/groups/${groupId}/members/${groupMemberId}/leave`,
      {},
      { responseType: 'text' as 'json' },
    );
  }

  editGroupMember(
    groupId: string,
    groupMemberId: string,
    data: EditGroupMemberDto,
  ): Observable<unknown> {
    return this.http.put(
      `${this.apiUrl}/groups/${groupId}/members/${groupMemberId}`,
      data,
    );
  }

  removeGroupMember(
    groupId: string,
    groupMemberId: string,
  ): Observable<unknown> {
    return this.http.put(
      `${this.apiUrl}/groups/${groupId}/members/${groupMemberId}/leave`,
      {},
    );
  }

  joinGroup(groupId: string) {
    const params = {
      userId: localStorage.getItem('userId'),
    };

    return this.http.post<CreateGroupMemberInOpenGroupResult>(
      `${this.apiUrl}/groups/${groupId}/members`,
      params,
    );
  }
}
