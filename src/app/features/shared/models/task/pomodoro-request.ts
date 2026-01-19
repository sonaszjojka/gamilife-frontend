export interface PomodoroRequest {
  taskId?: string;
  habitId?: string;
  cyclesRequired: number;
  cyclesCompleted?: number;
}
