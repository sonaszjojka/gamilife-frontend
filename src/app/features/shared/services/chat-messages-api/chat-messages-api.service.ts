import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  CreateChatMessageDto,
  CreateChatMessageResult,
  GetChatMessagesResult,
  GetChatMessagesParams,
} from '../../models/chat-messages/chat-message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatMessageApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  createChatMessage(
    groupId: string,
    groupMemberId: string,
    data: CreateChatMessageDto,
  ): Observable<CreateChatMessageResult> {
    return this.http.post<CreateChatMessageResult>(
      `${this.apiUrl}/groups/${groupId}/members/${groupMemberId}/chat-messages`,
      data,
      { withCredentials: true },
    );
  }

  getChatMessages(
    groupId: string,
    groupMemberId: string,
    params?: GetChatMessagesParams,
  ): Observable<GetChatMessagesResult> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.isImportant !== undefined) {
        httpParams = httpParams.set('isImportant', params.isImportant);
      }
      if (params.page !== undefined) {
        httpParams = httpParams.set('page', params.page);
      }
      if (params.size !== undefined) {
        httpParams = httpParams.set('size', params.size);
      }
    }

    return this.http.get<GetChatMessagesResult>(
      `${this.apiUrl}/groups/${groupId}/members/${groupMemberId}/chat-messages`,
      {
        params: httpParams,
        withCredentials: true,
      },
    );
  }
}
