import { GroupType } from './group-type.model';

export interface Group {
  groupId: string;
  joinCode: string;
  groupName: string;
  adminId: string;
  groupCurrencySymbol: string;
  membersLimit: number;
  groupType: GroupType;
  membersCount: number;
}
