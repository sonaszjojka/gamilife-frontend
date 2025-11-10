import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { GroupFilterParams } from '../../models/group-filter-params.model';
import { Page } from '../../models/page.model';
import { Group } from '../../models/group.model';
import { GroupType } from '../../models/group-type.model';

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
