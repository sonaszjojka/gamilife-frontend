export interface EditGroupInvitationStatusDto {
  invitationStatusId: number;
  token: string;
}

export enum InvitationStatusId {
  SENT = 1,
  ACCEPTED = 2,
  REJECTED = 3,
  REVOKED = 4,
}

export enum InvitationStatus {
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  REVOKED = 'REVOKED',
}

export interface GroupInvitation {
  id: string;
  groupId: string;
  groupName: string;
  invitedUserId: string;
  status: InvitationStatus;
  expiresAt: number;
}
