export interface TaskRequest {
  title: string;
  deadlineDate: string;
  deadlineTime?: string | null;
  categoryId: number;
  difficultyId: number;
  description: string;
  completed?: boolean | null;
}
