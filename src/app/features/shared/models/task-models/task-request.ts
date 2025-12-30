export interface TaskRequest {
  title: string;
  deadlineDate: string;
  deadlineTime?: string | null;
  categoryId?: number | null;
  difficultyId?: number | null;
  description?: string | null;
  completed?: boolean | null;
}
