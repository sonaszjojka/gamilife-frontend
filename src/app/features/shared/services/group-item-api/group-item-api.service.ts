import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {GroupItemRequestModel, GroupItemResponseModel} from '../../models/group/group-item.model';
import {Observable} from 'rxjs';

@Injectable
({
  providedIn: 'root'
})
export class GroupItemApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;


  createGroupItem(groupId: string, request: GroupItemRequestModel):Observable<GroupItemResponseModel> {
    return this.http.post<GroupItemResponseModel>(
      `${this.apiUrl}/groups/${groupId}/shop/items`,
      request,
      { withCredentials: true },
    );


  }
  editGroupItem(groupId: string, request:GroupItemRequestModel,itemId:string):Observable<GroupItemResponseModel> {
    return this.http.put<GroupItemResponseModel>(
      `${this.apiUrl}/groups/${groupId}/shop/items/${itemId}`,
      request,
      { withCredentials: true },
    );
  }

  deleteGroupItem(groupId: string, itemId:string):Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/groups/${groupId}/shop/items/${itemId}`,
      { withCredentials: true },
    );
  }

}
