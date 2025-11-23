export interface CreateTaskResponse
{
  //todo change after adding habits
  title:string,
  startTime:string,
  endTime:string,
  categoryId:number,
  difficultyId:number,
  completedAt:string|null,
  description:string
}
