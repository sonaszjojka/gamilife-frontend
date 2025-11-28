import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { UserFilterParams } from '../../models/group/user.model';
import { User } from '../../models/group/user.model';

export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getUsers(params: UserFilterParams): Observable<PagedResponse<User>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('size', params.size.toString());

    if (params.username) {
      httpParams = httpParams.set('username', params.username);
    }

    return this.http.get<PagedResponse<User>>(`${this.apiUrl}/users`, {
      params: httpParams,
    });
  }
}
