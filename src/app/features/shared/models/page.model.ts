export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset?: number;
    paged?: boolean;
    unpaged?: boolean;
    sort?: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
  };
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  sort?: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
}
