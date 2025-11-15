import { GroupType } from './group-type.model';

export interface Group {
  groupId: string;
  joinCode: string;
  groupName: string;
  adminId: string;
  groupCurrencySymbol: string | null;
  membersLimit: number | null;
  groupType: GroupType;
  membersCount: number;
  isMember: boolean | null;
  hasActiveGroupRequest: boolean | null;
}

export interface CreateGroupDto {
  groupName: string;
  groupCurrencySymbol: string;
  groupTypeId: string;
  membersLimit: string;
}
