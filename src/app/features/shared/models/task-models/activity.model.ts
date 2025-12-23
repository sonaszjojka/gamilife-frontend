export interface ActivityItemDetails
{
  id: string
  type:ActivityType
  title:string
  description:string
  userId:string
  categoryId:number
  categoryName:string
  difficultyId:number
  difficultyName:string
  deadlineDate:string
  deadlineTime:string
  status:ActivityStatus
  pomodoro?:Pomodoro | undefined
  cycleLength?:number|undefined
  currentStreak?:number|undefined
  longestStreak?:number|undefined
  completedAt?:string|undefined
  workable?:boolean|undefined
}

export enum ActivityType {
  TASK = 'TASK',
  HABIT = 'HABIT',
}

export const ActivityTypeColors:Record <ActivityType,string>=
  {
    [ActivityType.TASK]:'#2196f3',
    [ActivityType.HABIT]:'#9c27b0'
  }


export enum ActivityStatus {
  ALIVE = 'ALIVE',
  INCOMPLETE = 'INCOMPLETE',
  DEADLINE_TODAY = 'DEADLINE_TODAY',
  DEADLINE_MISSED = 'DEADLINE_MISSED',
}

export interface Pomodoro
{
  id : string,
  cyclesRequired:number,
  cyclesCompleted:number
}

export interface  GetAllActivitiesParams
{
  page:number;
  size:number;
  title:string|undefined;
  categoryId:number|undefined;
  difficultyId:number|undefined;
  startDate:string|undefined;
  endDate:string|undefined;
  [key: string]: string | number|undefined;
}

