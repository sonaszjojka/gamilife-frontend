import { PomodoroModel } from './pomodoro.model';
import { HabitModel } from './habit-model';

export interface Task {
  taskId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  categoryId: number;
  difficultyId: number;
  habitId: string | null;
  completedAt: string | null;
  categoryName: string;
  difficultyName: string;
  isGroupTask: boolean;
  userId: string | null;
  pomodoro: PomodoroModel | null;
  taskHabit: HabitModel | null;
}
