import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CreateGroupInvitationDto } from '../../models/group/user.model';
import {
  EditGroupInvitationStatusDto,
  GroupInvitation,
} from '../../models/group/group-invitation.model';

@Injectable({
  providedIn: 'root',
})
export class GroupInvitationApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getById(groupId: string, invitationId: string): Observable<GroupInvitation> {
    return this.http.get<GroupInvitation>(
      `${this.apiUrl}/groups/${groupId}/invitations/${invitationId}`,
    );
  }

  createInvitation(
    groupId: string,
    data: CreateGroupInvitationDto,
  ): Observable<unknown> {
    return this.http.post(
      `${this.apiUrl}/groups/${groupId}/invitations`,
      data,
      { withCredentials: true },
    );
  }

  updateInvitationStatus(
    groupId: string,
    invitationId: string,
    data: EditGroupInvitationStatusDto,
  ): Observable<unknown> {
    return this.http.put(
      `${this.apiUrl}/groups/${groupId}/invitations/${invitationId}/status`,
      data,
      { withCredentials: true },
    );
  }
}
