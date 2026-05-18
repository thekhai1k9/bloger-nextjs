export interface Post {
  slug: string
  title: string
  date: string
  description?: string
  content: string
  [key: string]: any // chứa thêm các metadata khác 
}