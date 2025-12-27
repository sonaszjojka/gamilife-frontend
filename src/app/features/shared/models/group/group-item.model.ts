
export interface GroupItemModel
{
  id:string,
  name:string,
  price:number,
  isActive:boolean
}

export interface GroupItemRequestModel
{
  name?:string,
  price?:number,
  isActive?:boolean
}

export interface GroupItemResponseModel
{
  id:string,
  name:string,
  price:number,
  isActive:boolean
}
