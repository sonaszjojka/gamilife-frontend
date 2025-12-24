export interface User {
  id: string;
  username: string;
  email: string;
  isProfilePublic: boolean;
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
  firstName: string | null;
  lastName: string | null;
  username: string;
  level: number | null;
  isProfilePublic: boolean;
  email: string | null;
  dateOfBirth: string | null;
  experience: number | null;
  requiredExperience: number | null;
  money: number | null;
  sendBudgetReports: boolean | null;
  isEmailVerified: boolean | null;
  isTutorialCompleted: boolean | null;
}
