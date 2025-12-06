export interface GroupTaskMemberModel {
  groupTaskMemberId: string;
  groupMemberId: string;
  isMarkedDone: boolean;
}

export interface EditGroupTaskMemberDto {
  isMarkedDone: boolean;
}

export interface CreateGroupTaskMemberDto {
  groupMemberId: string;
  groupTaskId: string;
  isMarkedDone: boolean;
}
