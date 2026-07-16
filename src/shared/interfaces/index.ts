export interface AnyObj {
  [key: string]: any;
}

export interface FindManyParams {
  skip: number;
  take: number;
  search?: string;
}
