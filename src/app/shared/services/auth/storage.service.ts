import { Injectable } from '@angular/core';

export interface StorageKeys {
  userId: string;
  username: string;
  isTutorialCompleted: boolean;
  money: number;
  level: number;
  experience: number;
  requiredExperienceForNextLevel: number | null;
  oauth2_code_verifier: string;
  user_notifications: string;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getIsTutorialCompleted(): boolean {
    return localStorage.getItem('isTutorialCompleted') === 'true';
  }

  getMoney(): number {
    return Number(localStorage.getItem('money')) || 0;
  }

  getLevel(): number {
    return Number(localStorage.getItem('level')) || 1;
  }

  getExperience(): number {
    return Number(localStorage.getItem('experience')) || 0;
  }

  getRequiredExperienceForNextLevel(): number | null {
    const value = localStorage.getItem('requiredExperienceForNextLevel');
    return value ? Number(value) : null;
  }

  getStatsVersion(): number | null {
    const value = localStorage.getItem('statsVersion');
    return value ? Number(value) : null;
  }

  getIsEmailVerified(): boolean | null {
    return localStorage.getItem('isEmailVerified') === 'true';
  }

  getOAuth2CodeVerifier(): string | null {
    return sessionStorage.getItem('oauth2_code_verifier');
  }

  getNotifications(): string | null {
    return localStorage.getItem('user_notifications');
  }

  setUserId(value: string): void {
    localStorage.setItem('userId', value);
  }

  setUsername(value: string): void {
    localStorage.setItem('username', value);
  }

  setIsTutorialCompleted(value: boolean): void {
    localStorage.setItem('isTutorialCompleted', String(value));
  }

  setMoney(value: number): void {
    localStorage.setItem('money', String(value));
  }

  setLevel(value: number): void {
    localStorage.setItem('level', String(value));
  }

  setExperience(value: number): void {
    localStorage.setItem('experience', String(value));
  }

  setRequiredExperienceForNextLevel(value: number | null): void {
    if (value !== null) {
      localStorage.setItem('requiredExperienceForNextLevel', String(value));
    } else {
      localStorage.removeItem('requiredExperienceForNextLevel');
    }
  }

  setStatsVersion(value: number): void {
    localStorage.setItem('statsVersion', String(value));
  }

  setIsEmailVerified(value: boolean): void {
    localStorage.setItem('isEmailVerified', String(value));
  }

  setOAuth2CodeVerifier(value: string): void {
    sessionStorage.setItem('oauth2_code_verifier', value);
  }

  setNotifications(value: string): void {
    localStorage.setItem('user_notifications', value);
  }

  removeUserId(): void {
    localStorage.removeItem('userId');
  }

  removeUsername(): void {
    localStorage.removeItem('username');
  }

  removeIsTutorialCompleted(): void {
    localStorage.removeItem('isTutorialCompleted');
  }

  removeMoney(): void {
    localStorage.removeItem('money');
  }

  removeLevel(): void {
    localStorage.removeItem('level');
  }

  removeExperience(): void {
    localStorage.removeItem('experience');
  }

  removeRequiredExperienceForNextLevel(): void {
    localStorage.removeItem('requiredExperienceForNextLevel');
  }

  removeOAuth2CodeVerifier(): void {
    sessionStorage.removeItem('oauth2_code_verifier');
  }

  removeNotifications(): void {
    localStorage.removeItem('user_notifications');
  }

  removeIsEmailVerified(): void {
    localStorage.removeItem('isEmailVerified');
  }

  removeStatsVersion(): void {
    localStorage.removeItem('statsVersion');
  }

  clearAuthData(): void {
    this.removeUserId();
    this.removeUsername();
    this.removeIsTutorialCompleted();
    this.removeMoney();
    this.removeLevel();
    this.removeExperience();
    this.removeRequiredExperienceForNextLevel();
    this.removeStatsVersion();
    this.removeIsEmailVerified();
    this.removeNotifications();
  }

  clearAllData(): void {
    localStorage.clear();
    sessionStorage.clear();
  }
}
