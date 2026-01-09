import { GroupMember } from './group-member.model';
import { GroupType } from './group-type.model';

export interface Group {
  groupId: string;
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
  groupTimeZone: string;
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
  groupTimeZoneId: string;
}

export interface GroupFilterParams {
  groupType?: number;
  groupName?: string;
  isForLoggedUser?: boolean;
  page: number;
  size: number;
}
