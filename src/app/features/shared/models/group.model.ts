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
  members: GroupMember[];
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
