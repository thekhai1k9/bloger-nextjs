import {notFound} from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {createClient} from '@/lib/supabase/client'
import { formatDate } from '@/helpers/utils'

interface ArticlePageProps {
  params: {
    slug: string
  }
}

async function getArticleBySlug(slug: string) {
  try {
    const supabase = await createClient() 

    const {data: article, error} = await supabase
      .from('posts') 
      .select('*')
      .eq('slug', slug) 
      .single() 
    console.log("=== DEBUG SLUG ===", { slug, dataReceived: article, errorReceived: error });
    if (error || !article) {
      console.error('Lỗi fetch bài viết:', error?.message)
      return null
    }

    return article
  } catch (err) {
    console.error('Lỗi hệ thống khi fetch bài viết:', err)
    return null
  }
}

export default async function ArticleDetailPage({params}: ArticlePageProps) {
  const {slug} = await params

  const article = await getArticleBySlug(slug)
  if (!article) {
    notFound()
  }

  return (
    <article className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="mb-6">
          <Link
            href="/articles"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            ← Quay lại danh sách bài viết
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {article.author || 'Khải Phùng'}
            </span>
            <span className="hidden sm:inline">•</span>
            <time dateTime={article.created_at}>
              {formatDate(article.created_at)}
            </time>
          </div>
        </header>

        {article.cover_url && (
          <div className="relative w-full h-[200px] sm:h-[350px] md:h-[450px] rounded-xl overflow-hidden mb-10 shadow-md">
            <Image
              src={article.cover_url}
              alt={article.title}
              fill
              priority
              sizes="(max-w-768px) 100vw, (max-w-1200px) 85vw, 1200px"
              className="object-cover"
            />
          </div>
        )}

        <div
          className="text-base sm:text-lg leading-relaxed space-y-6 break-words prose dark:prose-invert max-w-none [&>p]:mb-4 [&>h2]:text-xl [&>h2]:sm:text-2xl [&>h2]:font-bold [&>h2]:mt-6"
          dangerouslySetInnerHTML={{__html: article.content}}
        />
      </div>
    </article>
  )
}
