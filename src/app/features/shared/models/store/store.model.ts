export interface StoreItemDto {
  id: string;
  name: string;
  imagePath: string;
  itemSlot: ItemSlotDto;
  rarity: RarityDto;
  price: number;
}

export interface StoreItemDetailsDto {
  id: string;
  name: string;
  imagePath: string;
  itemSlot: ItemSlotDto;
  rarity: RarityDto;
  price: number;
  description: string;
  isAlreadyOwned: boolean;
}

export interface ItemSlotDto {
  id: number;
  name: string;
}

export interface RarityDto {
  id: number;
  name: string;
}

export interface PurchaseStoreItemResult {
  userInventoryItemId: string;
  itemId: string;
  quantity: number;
  newUserMoney: number;
}
export interface StoreFiltersModel {
  itemName?: string;
  itemSlot?: number[];
  rarity?: number[];
  size: number;
  page: number;
}

export interface GetAllItemSlotsResult {
  itemSlots: ItemSlotDto[];
}

export interface GetAllRaritiesResult {
  itemRarities: RarityDto[];
}
