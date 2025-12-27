import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  GetUserInventoryItemsResult,
  UserInventoryItemFilter,
} from '../../models/user-profile/user-profile.models';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserInventoryService {
  protected readonly apiUrl = `${environment.apiUrl}/users`;
  protected readonly http = inject(HttpClient);

  getUserInventoryItems(
    userId: string,
    filter: UserInventoryItemFilter,
  ): Observable<GetUserInventoryItemsResult> {
    let params = new HttpParams()
      .set('page', filter.page.toString())
      .set('size', filter.size.toString());

    if (filter.itemName) {
      params = params.set('itemName', filter.itemName);
    }
    if (filter.itemSlot !== undefined && filter.itemSlot !== null) {
      params = params.set('itemSlot', filter.itemSlot.toString());
    }
    if (filter.rarity !== undefined && filter.rarity !== null) {
      params = params.set('rarity', filter.rarity.toString());
    }

    return this.http.get<GetUserInventoryItemsResult>(
      `${this.apiUrl}/${userId}/inventory/items`,
      { params, withCredentials: true },
    );
  }
}
