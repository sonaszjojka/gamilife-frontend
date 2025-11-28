export interface CreateHabitRequest {
  cycleLength: string;
  currentStreak: number;
  longestStreak: number;
  acceptedDate: string | null;
}
