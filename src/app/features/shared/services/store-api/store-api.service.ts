import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  GetAllItemSlotsResult,
  GetAllRaritiesResult,
  PurchaseStoreItemResult,
  StoreFiltersModel,
  StoreItemDetailsDto,
  StoreItemDto,
} from '../../models/store/store.model';
import { Observable } from 'rxjs';
import {Page} from '../../models/util/page.model';

@Injectable({
  providedIn: 'root',
})
export class StoreApiService {
  private API_URL = `${environment.apiUrl}`;
  private http = inject(HttpClient);

  public getFilteredItems(
    filters: StoreFiltersModel,
  ): Observable<Page<StoreItemDto>> {
    const params = this.buildHttpParamsForGetItems(filters);

    return this.http.get<Page<StoreItemDto>>(`${this.API_URL}/store/item`, {
      params: params,
      withCredentials: true,
    });
  }

  public getItemSlots(): Observable<GetAllItemSlotsResult> {
    return this.http.get<GetAllItemSlotsResult>(`${this.API_URL}/item-slots`, {
      withCredentials: true,
    });
  }
  public getRarities(): Observable<GetAllRaritiesResult> {
    return this.http.get<GetAllRaritiesResult>(
      `${this.API_URL}/item-rarities`,
      {
        withCredentials: true,
      },
    );
  }

  public getItemDetails(itemId: string): Observable<StoreItemDetailsDto> {
    return this.http.get<StoreItemDetailsDto>(
      `${this.API_URL}/store/item/${itemId}`,
      {
        withCredentials: true,
      },
    );
  }

  public purchaseItem(itemId: string): Observable<PurchaseStoreItemResult> {
    const userId = localStorage.getItem('userId');
    const request = {
      itemId: itemId,
    };
    return this.http.post<PurchaseStoreItemResult>(
      `${this.API_URL}/users/${userId}/inventory/items`,
      request,
      {
        withCredentials: true,
      },
    );
  }

  protected buildHttpParamsForGetItems(params: StoreFiltersModel) {
    let httpParams = new HttpParams();

    if (params.itemSlot !== undefined) {
      params.itemSlot.forEach((slot) => {
        httpParams = httpParams.append('itemSlot', slot);
      });
    }
    if (params.rarity !== undefined) {
      params.rarity.forEach((rarity) => {
        httpParams = httpParams.append('rarity', rarity);
      });
    }
    if (params.itemName) {
      httpParams = httpParams.set('itemName', params.itemName);
    }
    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.size !== undefined) {
      httpParams = httpParams.set('size', params.size.toString());
    }
    return httpParams;
  }
}
