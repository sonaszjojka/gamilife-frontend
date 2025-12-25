export interface CreateChatMessageDto {
  content: string;
  isImportant: boolean;
}

export interface CreateChatMessageResult {
  messageId: string;
  isImportant: boolean;
  sendAt: string;
  group: {
    groupId: string;
  };
  content: string;
  senderGroupMember: {
    groupMemberId: string;
  };
}

export interface GetChatMessagesParams {
  isImportant?: boolean;
  page?: number;
  size?: number;
}

export interface ChatMessageDto {
  messageId: string;
  content: string;
  sentAt: string;
  isImportant: boolean;
  groupId: string;
  groupMemberId: string;
  senderUsername: string;
}

export interface GetChatMessagesResult {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  content: ChatMessageDto[];
}
