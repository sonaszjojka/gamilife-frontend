import { GroupMember } from './group-member.model';
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
  loggedUserMembershipDto: GroupMember | null;
  membersSortedDescByTotalEarnedMoney: GroupMember[];
  adminUsername: string | null;
}

export interface CreateGroupDto {
  groupName: string;
  groupCurrencySymbol: string;
  groupTypeId: string;
  membersLimit: string;
}

export interface EditGroupDto {
  adminId: string;
  groupName: string;
  groupCurrencySymbol: string;
  groupTypeId: number;
  membersLimit: number;
}

export interface GroupFilterParams {
  joinCode?: string;
  groupType?: number;
  groupName?: string;
  isForLoggedUser?: boolean;
  page: number;
  size: number;
}
