import {GroupItemModel} from './group-item.model';

export interface OwnedGroupItemModel
{
  id:string,
  memberId:string,
  isUsedUp: string,
  groupItem:GroupItemModel
}
