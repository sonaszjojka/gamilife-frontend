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
export interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  dateOfBirth: string;
  experience: number;
  money: number;
  sendBudgetReports: boolean;
  isProfilePublic: boolean;
  isEmailVerified: boolean;
  isTutorialCompleted: boolean;
}
