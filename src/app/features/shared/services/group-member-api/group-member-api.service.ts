import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import {
  CreateGroupMemberInOpenGroupResult,
  EditGroupMemberDto,
} from '../../models/group/group-member.model';
import { StorageService } from '../../../../shared/services/auth/storage.service';

@Injectable({
  providedIn: 'root',
})
export class GroupMemberApiService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private apiUrl = environment.apiUrl;

  leaveGroup(groupId: string, groupMemberId: string): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/groups/${groupId}/members/${groupMemberId}/leave`,
      {},
      {
        responseType: 'text' as 'json',
        withCredentials: true,
      },
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
      { withCredentials: true },
    );
  }

  removeGroupMember(
    groupId: string,
    groupMemberId: string,
  ): Observable<unknown> {
    return this.http.put(
      `${this.apiUrl}/groups/${groupId}/members/${groupMemberId}/leave`,
      {},
      { withCredentials: true },
    );
  }

  joinGroup(groupId: string) {
    const params = {
      userId: this.storageService.getUserId(),
    };

    return this.http.post<CreateGroupMemberInOpenGroupResult>(
      `${this.apiUrl}/groups/${groupId}/members`,
      params,
      { withCredentials: true },
    );
  }
}
