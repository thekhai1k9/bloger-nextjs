import { createClient } from "@/lib/supabase/client"

export interface ArticleSummary {
  id: string
  title: string
  cover_image: string | null
  created_at: string
  slug: string
}

interface GetArticlesParams {
  page: number
  search: string
  pageSize?: number
}

export async function getArticlesAction({
  page,
  search,
  pageSize = 6,
}: GetArticlesParams) {
  const supabase = createClient()

  try {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('posts')
      .select('id, title, cover_image, created_at, slug', {count: 'exact'})
      .order('created_at', {ascending: false})
      .range(from, to)

    if (search.trim()) {
      query = query.ilike('title', `%${search.trim()}%`)
    }

    const {data, error, count} = await query

    if (error) throw error

    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / pageSize)

    return {
      posts: (data as ArticleSummary[]) || [],
      totalCount,
      totalPages,
      error: null,
    }
  } catch (error: any) {
    console.error('Lỗi Service getArticlesAction:', error.message)
    return {
      posts: [],
      totalCount: 0,
      totalPages: 0,
      error: error.message as string,
    }
  }
}
