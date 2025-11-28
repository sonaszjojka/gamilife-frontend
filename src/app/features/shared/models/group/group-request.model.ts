export interface CreateGroupRequestResult {
  groupRequestId: string;
  userId: string;
  groupRequested: GroupDto;
  createdAt: string;
  groupRequestStatus: GroupRequestStatusDto;
}

export interface GroupRequest {
  groupRequestId: string;
  userId: string;
  username: string;
  groupId: string;
  createdAt: string;
  groupRequestStatus: {
    groupRequestStatusId: number;
    title: string;
  };
}

export interface GroupDto {
  groupId: string;
}

export interface GroupRequestStatusDto {
  groupRequestStatusId: number;
  title: string;
}

export interface GetGroupRequestsParams {
  statusId?: number;
  page?: number;
  size?: number;
}

export interface GetGroupRequestsResult {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  content: GroupRequest[];
}

export interface EditGroupRequestStatusRequest {
  groupRequestStatusId: number;
}

export interface EditGroupRequestStatusResult {
  groupRequestId: string;
  userId: string;
  groupRequested: {
    groupId: string;
  };
  createdAt: string;
  groupRequestStatus: GroupRequestStatusDto;
  groupMemberId: string;
}
