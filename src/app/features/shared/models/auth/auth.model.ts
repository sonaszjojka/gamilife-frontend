export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  email: string;
  username: string;
  isEmailVerified: boolean;
  isTutorialCompleted: boolean;
  money: number;
}

export interface GamificationUserData {
  userId: string;
  username: string;
  level: number;
  experience: number;
  money: number;
  requiredExperienceForNextLevel: number | null;
  statsVersion: number;
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  dateOfBirth: Date;
  password: string;
  isPublicProfile: boolean;
  isBudgetReports: boolean;
}
