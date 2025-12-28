

export interface GroupShopModel
{
  id:string,
  name:string,
  description?:string
  groupId:string,
  isActive:boolean

}

export interface GroupShopRequestModel
{
  name?:string,
  description?:string,
  isActive?:boolean
}
export interface GroupShopResponseModel
{
  id:string,
  name:string,
  description?:string
  groupId:string,
  isActive:boolean
}
