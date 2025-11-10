import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment.development';

export interface GroupType {
  id: number;
  title: string;
}

export interface Group {
  groupId: string;
  joinCode: string;
  groupName: string;
  adminId: string;
  groupCurrencySymbol: string;
  membersLimit: number;
  groupType: GroupType;
  membersCount: number;
}

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset?: number;
    paged?: boolean;
    unpaged?: boolean;
    sort?: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
  };
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  sort?: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
}

export interface GroupFilterParams {
  joinCode?: string;
  groupType?: number;
  groupName?: string;
  page: number;
  size: number;
}

@Injectable({
  providedIn: 'root',
})
export class GroupApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getGroups(params: GroupFilterParams): Observable<Page<Group>> {
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

    return this.http.get<Page<Group>>(`${this.apiUrl}/groups`, {
      params: httpParams,
    });
  }

  getGroupTypes(): Observable<GroupType[]> {
    return this.http.get<GroupType[]>(`${this.apiUrl}/group-types`);
  }
}
