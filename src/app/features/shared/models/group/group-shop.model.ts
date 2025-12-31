import {GroupItemModel} from './group-item.model';
import {Page} from '../util/page.model';


export interface GroupShopModel
{
  id:string,
  name:string,
  description?:string
  groupId:string,
  isActive:boolean
  page:Page<GroupItemModel>

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
