export interface Task {
  taskId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  categoryId: number;
  difficultyId: number;
  habitId?:string|null;
  completedAt?: string | null;
  categoryName: string;
  difficultyName: string;
  isGroupTask: boolean;
  userId?:string|null;
  pomodoroId?:string|null;
  workCyclesNeeded?:number|null;
  workCyclesCompleted?:number|null;
  createdAt?:string|null;
}
