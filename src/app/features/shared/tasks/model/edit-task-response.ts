export interface EditTaskResponse
{
   taskId : string,
   title : string,
   startTime: string,
   endTime : string,
   categoryId : number,
   difficultyId : number,
   userId : string,
   completedAt: string,
   habitTaskId?: string,
   previousTaskId?: string,
   description : string



}
