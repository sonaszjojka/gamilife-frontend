import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {GroupItemModel, GroupItemRequestModel, GroupItemResponseModel} from '../../models/group/group-item.model';
import {Observable} from 'rxjs';
import {Page} from '../../models/util/page.model';

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

  getItems(groupId:string, page:number, size:number, isActive:boolean):Observable<Page<GroupItemModel>>
  {
   let  httpParams = new HttpParams()
   httpParams= httpParams.set('page',page.toString())
   httpParams= httpParams.set('size',size.toString())

    if (isActive!==null)
    {
     httpParams= httpParams.set('isActive',isActive.toString())
    }
    console.log(httpParams)
    return this.http.get<Page<GroupItemModel>>(
      `${this.apiUrl}/groups/${groupId}/shop/items`,
      {
        params:httpParams,
        withCredentials:true
      }
    )
  }
}
