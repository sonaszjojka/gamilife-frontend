import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {GroupShopRequestModel, GroupShopResponseModel} from '../../models/group/group-shop.model';
import {Observable} from 'rxjs';

@Injectable({

  providedIn: 'root',
})

export class GroupShopApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;


  changeGroupShopStatus(groupId: string, shopId: string, isOpen: boolean) {
    return this.http.put(
      `${this.apiUrl}/groups/${groupId}/shop/${shopId}/status`,
      { isOpen },
      { withCredentials: true },
    );
  }
  editGroupShop(groupId: string, shopId: string, request:GroupShopRequestModel):Observable<GroupShopResponseModel> {
    return this.http.put<GroupShopResponseModel>(
      `${this.apiUrl}/groups/${groupId}/shop/${shopId}`,
      { request },
      { withCredentials: true },
    );
  }


}
