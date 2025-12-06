import { UserDetails } from '../group/user.model';

export interface AchievementDto {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  isUnlocked: boolean;
  progress: number;
  goal: number;
}

export interface GetAllUserAchievementsResult {
  achievements: AchievementDto[];
}

export interface ItemSlotDto {
  id: number;
  name: string;
}

export interface RarityDto {
  id: number;
  name: string;
}

export interface ItemDto {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  quickSellValue: number;
  itemSlot: ItemSlotDto;
  rarity: RarityDto;
  price: number | null;
  achievementId: string | null;
  unlockLevelId: number | null;
}

export interface UserInventoryItemDto {
  id: string;
  itemId: string;
  userId: string;
  quantity: number;
  isEquipped: boolean;
  item: ItemDto;
}

export interface GetUserInventoryItemsResult {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  content: UserInventoryItemDto[];
}

export interface UserInventoryItemFilter {
  itemName?: string;
  itemSlot?: number;
  rarity?: number;
  page: number;
  size: number;
}

export type { UserDetails };
