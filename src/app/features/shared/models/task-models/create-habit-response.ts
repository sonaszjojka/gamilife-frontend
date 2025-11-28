export interface CreateHabitResponse {
  habitId: string;
  taskId: string;
  cycleLength: string;
  currentStreak: number;
  longestStreak: number;
  acceptedDate: string | null;
}
