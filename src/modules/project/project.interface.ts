 export interface IProjectPagination {
  page: number
  limit: number
  search?: string
  authorId?: number
  features?: string[]
}