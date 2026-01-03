import { GroupItemModel } from './group-item.model';

export interface OwnedGroupItemModel {
  id: string;
  memberId: string;
  usedAt: string;
  groupItem: GroupItemModel;
}

export interface OwnedGroupItemResponseModel {
  usedAt: string;
}

export interface OwnedGroupItemRequestModel {
  memberId?: string;
  isUsedUp?: boolean;
  groupItemId?: string;
}

export interface OwnedGroupItemRequestModel {
  memberId?: string;
  isUsedUp?: boolean;
  groupItemId?: string;
}
