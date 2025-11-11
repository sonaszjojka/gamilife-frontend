export interface Task {
  taskId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  categoryId: number;
  difficultyId: number;
  completedAt?: string | null;
  categoryName: string;
  difficultyName: string;
  isGroupTask: boolean;
  userId:string;
}
