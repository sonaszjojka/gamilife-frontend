import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { GroupFilterParams } from '../../models/group-filter-params.model';
import { GetGroupsResult } from '../../models/groups.model';
import { Group } from '../../models/group.model';
import { GroupType } from '../../models/group-type.model';
import { CreateGroupMemberInOpenGroupResult } from '../../models/group-member.model';
import { CreateGroupRequestResult } from '../../models/group-request.model';

@Injectable({
  providedIn: 'root',
})
export class GroupApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getGroups(params: GroupFilterParams): Observable<GetGroupsResult> {
    return this.http.get<GetGroupsResult>(`${this.apiUrl}/groups`, {
      params: this.buildHttpParamsForGetGroups(params),
    });
  }

  getAllGroupsByUserIdWhereUserIsMember(
    params: GroupFilterParams,
  ): Observable<GetGroupsResult> {
    const userId = localStorage.getItem('userId');

    return this.http.get<GetGroupsResult>(
      `${this.apiUrl}/users/${userId}/groups`,
      {
        params: this.buildHttpParamsForGetGroups(params),
      },
    );
  }

  protected buildHttpParamsForGetGroups(params: GroupFilterParams) {
    let httpParams = new HttpParams();

    if (params.joinCode) {
      httpParams = httpParams.set('joinCode', params.joinCode);
    }
    if (params.groupType !== undefined) {
      httpParams = httpParams.set('groupType', params.groupType.toString());
    }
    if (params.groupName) {
      httpParams = httpParams.set('groupName', params.groupName);
    }
    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.size !== undefined) {
      httpParams = httpParams.set('size', params.size.toString());
    }
    return httpParams;
  }

  getGroupById(groupId: string, isForLoggedUser = true): Observable<Group> {
    const params = new HttpParams().set(
      'isForLoggedUser',
      String(isForLoggedUser),
    );

    return this.http.get<Group>(`${this.apiUrl}/groups/${groupId}`, { params });
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

  sendRequest(groupId: string) {
    return this.http.post<CreateGroupRequestResult>(
      `${this.apiUrl}/groups/${groupId}/requests`,
      {},
    );
  }

  getGroupTypes(): Observable<GroupType[]> {
    return this.http.get<GroupType[]>(`${this.apiUrl}/group-types`);
  }
}
