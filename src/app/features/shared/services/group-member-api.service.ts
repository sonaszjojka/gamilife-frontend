import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupMemberApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  leaveGroup(groupId: string, groupMemberId: string): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/groups/${groupId}/members/${groupMemberId}/leave`,
      {},
      { responseType: 'text' as 'json' },
    );
  }
}
