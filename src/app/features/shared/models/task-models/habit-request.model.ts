export interface HabitRequest {
  title?: string;
  cycleLength?: number;
  categoryId?: number|null;
  difficultyId?: number|null;
  description?: string| null;
  iterationCompleted?: boolean;
  resurrect?: boolean;
}
