import { GroupTaskMemberModel } from './group-task-member.model';
import { Title } from '@angular/platform-browser';

export interface GroupTask {
  groupTaskId: string;
  reward: number;
  acceptedDate: string;
  declineMessage: string | null;
  taskDto: TaskDto;
  groupTaskMembers: GroupTaskMemberModel[];
}

export interface TaskDto {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: Category;
  difficulty: Difficulty;
  completedAt: string | null;
  description: string;
}

export interface Category {
  id: number;
  categoryName: Title;
}

export interface Difficulty {
  id: number;
  difficultyName: Title;
}

export interface EditGroupTaskDto {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  categoryId: number;
  difficultyId: number;
  completedAt: string | null;
  reward: number;
  isAccepted: boolean | null;
  declineMessage: string | null;
}

export interface GetGroupTaskRequest {
  size: number;
  page: number;
  isAccepted: boolean;
  isDeclined: boolean;
  [key: string]: string | number | boolean;
}
