export interface EditHabitResponse {
  habitId: string;
  taskId: string;
  cycleLength: string;
  currentStreak: number;
  longestStreak: number;
  acceptedDate: string | null;
}
