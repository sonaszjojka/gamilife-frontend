import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import {
  CreateGroupRequestResult,
  EditGroupRequestStatusRequest,
  EditGroupRequestStatusResult,
  GetGroupRequestsParams,
  GetGroupRequestsResult,
} from '../../models/group/group-request.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupRequestApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  sendRequest(groupId: string) {
    return this.http.post<CreateGroupRequestResult>(
      `${this.apiUrl}/groups/${groupId}/requests`,
      {},
    );
  }

  getAllGroupRequests(
    groupId: string,
    params?: GetGroupRequestsParams,
  ): Observable<GetGroupRequestsResult> {
    let httpParams = new HttpParams();

    if (params?.statusId !== undefined) {
      httpParams = httpParams.set('statusId', params.statusId.toString());
    }
    if (params?.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.size !== undefined) {
      httpParams = httpParams.set('size', params.size.toString());
    }

    return this.http.get<GetGroupRequestsResult>(
      `${this.apiUrl}/groups/${groupId}/requests`,
      { params: httpParams },
    );
  }

  getPendingGroupRequests(
    groupId: string,
    page = 0,
    size = 20,
  ): Observable<GetGroupRequestsResult> {
    return this.getAllGroupRequests(groupId, {
      statusId: 1,
      page,
      size,
    });
  }

  editGroupRequestStatus(
    groupId: string,
    groupRequestId: string,
    request: EditGroupRequestStatusRequest,
  ): Observable<EditGroupRequestStatusResult> {
    return this.http.put<EditGroupRequestStatusResult>(
      `${this.apiUrl}/groups/${groupId}/requests/${groupRequestId}/status`,
      request,
    );
  }

  approveGroupRequest(
    groupId: string,
    groupRequestId: string,
  ): Observable<EditGroupRequestStatusResult> {
    return this.editGroupRequestStatus(groupId, groupRequestId, {
      groupRequestStatusId: 2,
    });
  }

  rejectGroupRequest(
    groupId: string,
    groupRequestId: string,
  ): Observable<EditGroupRequestStatusResult> {
    return this.editGroupRequestStatus(groupId, groupRequestId, {
      groupRequestStatusId: 3,
    });
  }
}
