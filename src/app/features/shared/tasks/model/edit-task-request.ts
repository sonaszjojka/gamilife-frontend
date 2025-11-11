export interface EditTaskRequest
{
  //ToDo change after adding habits
  title:String,
  startTime:String,
  endTime:String,
  categoryId:number,
  difficultyId:number,
  completedAt:String|null,
  description:String
}
