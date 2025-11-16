export interface CreateGroupMemberInOpenGroupResult {
  groupMemberId: string;
  memberGroup: GroupDto;
  userId: string;
  joinedAt: string;
  groupMoney: number;
  totalEarnedMoney: number;
}

export interface GroupDto {
  groupId: string;
  adminId: string;
}

export interface GroupMember {
  groupMemberId: string;
  groupId: string;
  userId: string;
  groupMoney: number | null;
  totalEarnedMoney: number | null;
  joinedAt: string;
  leftAt: string | null;
}
