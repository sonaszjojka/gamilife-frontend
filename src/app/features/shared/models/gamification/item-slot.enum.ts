export enum ItemSlotEnum {
  HEAD = 1,
  BODY = 2,
  LEGS = 3,
  FEET = 4,
  ACCESSORY = 5,
  TITLE = 6,
  BADGE = 7,
  BACKGROUND = 8,
}

export const ITEM_SLOT_NAMES: Record<ItemSlotEnum, string> = {
  [ItemSlotEnum.HEAD]: 'Head',
  [ItemSlotEnum.BODY]: 'Body',
  [ItemSlotEnum.LEGS]: 'Legs',
  [ItemSlotEnum.FEET]: 'Feet',
  [ItemSlotEnum.ACCESSORY]: 'Accessory',
  [ItemSlotEnum.TITLE]: 'Title',
  [ItemSlotEnum.BADGE]: 'Badge',
  [ItemSlotEnum.BACKGROUND]: 'Background',
};

export const EQUIPPABLE_SLOTS = [
  ItemSlotEnum.HEAD,
  ItemSlotEnum.BODY,
  ItemSlotEnum.LEGS,
  ItemSlotEnum.FEET,
  ItemSlotEnum.ACCESSORY,
  ItemSlotEnum.TITLE,
  ItemSlotEnum.BADGE,
  ItemSlotEnum.BACKGROUND,
];
