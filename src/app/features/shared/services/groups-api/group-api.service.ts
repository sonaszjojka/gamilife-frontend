import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { GroupFilterParams } from '../../models/group/group.model';
import { GetGroupsResult } from '../../models/group/groups.model';
import {
  CreateGroupDto,
  EditGroupDto,
  Group,
} from '../../models/group/group.model';
import { GroupType } from '../../models/group/group-type.model';
import { StorageService } from '../../../../shared/services/auth/storage.service';

@Injectable({
  providedIn: 'root',
})
export class GroupApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private storageService = inject(StorageService);

  getGroups(params: GroupFilterParams): Observable<GetGroupsResult> {
    return this.http.get<GetGroupsResult>(`${this.apiUrl}/groups`, {
      params: this.buildHttpParamsForGetGroups(params),
      withCredentials: true,
    });
  }

  getAllGroupsByUserIdWhereUserIsMember(
    params: GroupFilterParams,
  ): Observable<GetGroupsResult> {
    const userId = this.storageService.getUserId();

    return this.http.get<GetGroupsResult>(
      `${this.apiUrl}/users/${userId}/groups`,
      {
        params: this.buildHttpParamsForGetGroups(params),
        withCredentials: true,
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

    return this.http.get<Group>(`${this.apiUrl}/groups/${groupId}`, {
      params,
      withCredentials: true,
    });
  }

  getGroupTypes(): Observable<GroupType[]> {
    return this.http.get<GroupType[]>(`${this.apiUrl}/group-types`, {
      withCredentials: true,
    });
  }

  createGroup(formValue: CreateGroupDto): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/groups`, formValue, {
      withCredentials: true,
    });
  }

  editGroup(groupId: string, data: EditGroupDto): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/groups/${groupId}`, data, {
      withCredentials: true,
    });
  }

  deleteGroup(groupId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/groups/${groupId}`, {
      withCredentials: true,
    });
  }
}
