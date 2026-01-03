import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import {
  GroupShopModel,
  GroupShopRequestModel,
  GroupShopResponseModel,
} from '../../models/group/group-shop.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupShopApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  changeGroupShopStatus(
    groupId: string,
    request: GroupShopRequestModel,
  ): Observable<GroupShopResponseModel> {
    return this.http.patch<GroupShopResponseModel>(
      `${this.apiUrl}/groups/${groupId}/shop`,
      request,
      { withCredentials: true },
    );
  }
  editGroupShop(
    groupId: string,
    request: GroupShopRequestModel,
  ): Observable<GroupShopResponseModel> {
    return this.http.put<GroupShopResponseModel>(
      `${this.apiUrl}/groups/${groupId}/shop`,
      request,
      { withCredentials: true },
    );
  }

  getGroupShopItems(
    groupId: string,
    page: number,
    size: number,
  ): Observable<GroupShopModel> {
    let httpParams = new HttpParams();

    httpParams = httpParams.set('page', page.toString());
    httpParams = httpParams.set('size', size.toString());
    return this.http.get<GroupShopModel>(
      `${this.apiUrl}/groups/${groupId}/shop`,
      {
        params: httpParams,
        withCredentials: true,
      },
    );
  }
}
