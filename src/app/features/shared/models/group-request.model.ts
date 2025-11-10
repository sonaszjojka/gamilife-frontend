export interface CreateGroupRequestResult {
  groupRequestId: string;
  userId: string;
  groupRequested: GroupDto;
  createdAt: string;
  groupRequestStatus: GroupRequestStatusDto;
}

export interface GroupDto {
  groupId: string;
}

export interface GroupRequestStatusDto {
  groupRequestStatusId: number;
  title: string;
}
