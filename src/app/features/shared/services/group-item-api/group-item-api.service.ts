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


  createGroupItem(request: GroupItemRequestModel):Observable<GroupItemResponseModel> {
    return this.http.post<GroupItemResponseModel>(
      `${this.apiUrl}/groups/{groupId}/shop/{shopId}/items`,
      request,
      { withCredentials: true },
    );


  }
  editGroupItem(request:GroupItemRequestModel,itemId:string):Observable<GroupItemResponseModel> {
    return this.http.put<GroupItemResponseModel>(
      `${this.apiUrl}/groups/{groupId}/shop/{shopId}/items/${itemId}`,
      request,
      { withCredentials: true },
    );
  }

  deleteGroupItem(itemId:string):Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/groups/{groupId}/shop/{shopId}/items/${itemId}`,
      { withCredentials: true },
    );
  }

}
