
export interface UserStatisticsModel
{
  id:string
  statisticType: StatisticsType
  count:number

}

export interface StatisticsType
{
  id:number,
  type:string
}
