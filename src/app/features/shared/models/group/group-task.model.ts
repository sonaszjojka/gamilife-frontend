export interface GroupTask
{
groupTaskId: string;
reward:number;
acceptedDate:string;
taskDto: TaskDto;
groupTaskMembers: GroupTaskMemberModel[];

}


export interface TaskDto
{
  id:string;
  title:string;
  startTime:string;
  endTime:string;
  category:number;
  difficulty:number;
  completedAt:string|null;
  description:string;
}

export interface GroupTaskMemberModel{
  groupTaskMemberId:string;
  groupMemberId:string;
  isMarkedAsDone:boolean;
}


