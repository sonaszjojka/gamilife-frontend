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
