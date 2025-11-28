export interface EditGroupInvitationStatusDto {
  invitationStatusId: number;
  token: string;
}

export enum InvitationStatus {
  PENDING = 1,
  ACCEPTED = 2,
  REJECTED = 3,
}
