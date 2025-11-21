export interface User {
  id: string;
  username: string;
  email: string;
}

export interface UserFilterParams {
  username?: string;
  page: number;
  size: number;
}

export interface CreateGroupInvitationDto {
  userId: string;
}
