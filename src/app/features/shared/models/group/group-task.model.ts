import {GroupTaskMemberModel} from './group-task-member.model';

export interface GroupTask
{
groupTaskId: string;
reward:number;
acceptedDate:string;
declineMessage:string|null;
taskDto: TaskDto;
groupTaskMembers: GroupTaskMemberModel[];

}


export interface TaskDto
{
  id:string;
  title:string;
  startTime:string;
  endTime:string;
  category:Category;
  difficulty:Difficulty;
  completedAt:string|null;
  description:string;
}

export interface Category
{
  id:number
}

export interface Difficulty
{
  id:number
}



export interface EditGroupTaskDto{
  title:string;
  description:string;
  startTime: string;
  endTime:string;
  categoryId:number;
  difficultyId:number;
  completedAt:string|null;
  reward:number;
  isAccepted:boolean;
  declineMessage:string|null;
}


