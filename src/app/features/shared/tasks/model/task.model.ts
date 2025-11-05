
export interface Task {
  taskId: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  categoryId?: number;
  difficultyId?: number;
  completedAt?: string | null;
  habitTaskId?: string;
  previousTaskId?: string | null;
}
