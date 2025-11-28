import { Group } from './group.model';

export interface GetGroupsResult {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  content: Group[];
}
