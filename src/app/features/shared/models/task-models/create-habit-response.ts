export interface CreateHabitResponse
{
  habitId: string;
  taskId:string;
  cycleLength:number;
  currentStreak:number;
  longestStreak:number;
  acceptedDate:string;
}
