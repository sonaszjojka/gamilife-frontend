import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {
  OwnedGroupItemModel,
  OwnedGroupItemRequestModel,
  OwnedGroupItemResponseModel
} from '../../models/group/owned-group-item.model';
import {Page} from '../../models/util/page.model';

@Injectable({
  providedIn: 'root'
})
export class GroupMemberInventoryApiService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getMemberInventory(groupId: string, memberId: string,isUsedUp:boolean|null,page:number,size:number):Observable<Page<OwnedGroupItemModel>> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('page', page.toString());
    httpParams = httpParams.set('size', size.toString());
    if (isUsedUp !== null) {
      httpParams = httpParams.set('isUsedUp', isUsedUp);
    }
    return this.http.get<Page<OwnedGroupItemModel>>(
      `${this.apiUrl}/groups/${groupId}/members/${memberId}/inventory`,
      { params: httpParams
        ,withCredentials: true },
    );

  }

  deleteMemberInventoryItem(groupId: string, memberId: string, itemId: string) {
    return this.http.delete(
      `${this.apiUrl}/groups/${groupId}/members/${memberId}/inventory/${itemId}`,
      { withCredentials: true },
    );

  }

  useMemberItem(groupId: string, memberId: string, itemId: string, request: OwnedGroupItemRequestModel):Observable<OwnedGroupItemResponseModel> {
   return this.http.put<OwnedGroupItemResponseModel>(
      `${this.apiUrl}/groups/${groupId}/members/${memberId}/inventory/${itemId}`,
        request ,
      { withCredentials: true },
    );
  }

  purchaseGroupItem(groupId:string,memberId:string, request: OwnedGroupItemRequestModel):Observable<OwnedGroupItemResponseModel>
  {
    return this.http.post<OwnedGroupItemResponseModel>(
      `${this.apiUrl}/groups/${groupId}/members/${memberId}/inventory`,
      request,
      {withCredentials:true}
    )

  }

}
