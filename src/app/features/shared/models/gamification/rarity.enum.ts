export enum RarityEnum {
  COMMON = 1,
  UNCOMMON = 2,
  RARE = 3,
  EPIC = 4,
  LEGENDARY = 5,
}

export const RARITY_NAMES: Record<RarityEnum, string> = {
  [RarityEnum.COMMON]: 'Common',
  [RarityEnum.UNCOMMON]: 'Uncommon',
  [RarityEnum.RARE]: 'Rare',
  [RarityEnum.EPIC]: 'Epic',
  [RarityEnum.LEGENDARY]: 'Legendary',
};

export const RARITY_COLORS: Record<RarityEnum, string> = {
  [RarityEnum.COMMON]: '#9e9e9e',
  [RarityEnum.UNCOMMON]: '#4caf50',
  [RarityEnum.RARE]: '#2196f3',
  [RarityEnum.EPIC]: '#9c27b0',
  [RarityEnum.LEGENDARY]: '#ff9800',
};
