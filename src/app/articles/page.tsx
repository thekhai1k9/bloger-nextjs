import React from 'react'
import FeaturedArticle from './_components/FeaturedArticle'
import Link from 'next/link'
import { getArticlesAction } from './_services/getArticles'

export const revalidate = 0 // Đảm bảo SSR hoạt động độc lập, không dính cache bài viết cũ

interface ArticlesPageProps {
  searchParams: {
    page?: string
    search?: string
  }
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  // 1. Phục hồi tham số thô từ URL gán giá trị mặc định nếu thiếu
  const currentPage = Number(searchParams.page) || 1
  const searchText = searchParams.search || ''

  // 2. Triệu hồi service bóc tách logic (UI không cần biết bên trong chạy gì)
  const { posts, totalCount, totalPages, error } = await getArticlesAction({
    page: currentPage,
    search: searchText,
    pageSize: 6 // Bạn hoàn toàn có thể thay đổi số lượng hiển thị dễ dàng tại đây
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <main className="w-full min-h-screen bg-light dark:bg-dark p-8 sm:p-16 md:p-24 text-dark dark:text-light transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Tiêu đề & Đếm bài viết */}
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-4xl font-bold md:text-6xl mb-4 text-center">
            Tất Cả Bài Viết
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tìm thấy <span className="font-semibold text-purple-600 dark:text-purple-400">{totalCount}</span> bài viết
          </p>
        </div>

        {/* 🔍 Search Bar - Form HTML thuần kích hoạt đẩy query lên URL */}
        <form method="GET" action="/articles" className="max-w-md mx-auto mb-16">
          <div className="relative">
            <input
              type="text"
              name="search"
              defaultValue={searchText}
              placeholder="Nhập tiêu đề và ấn Enter để tìm..."
              className="w-full px-5 py-3 rounded-full border border-dark/20 bg-white dark:bg-dark/50 dark:border-light/20 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
            {searchText && (
              <Link href="/articles" className="absolute right-4 top-3.5 text-xs text-gray-400 hover:text-red-500 transition-colors">
                Xóa tìm kiếm
              </Link>
            )}
          </div>
        </form>

        {/* DANH SÁCH BÀI VIẾT */}
        {error ? (
          <p className="text-center text-red-500 font-medium py-12">Đã xảy ra lỗi: {error}</p>
        ) : posts.length > 0 ? (
          <ul className="grid grid-cols-2 gap-16 md:grid-cols-1 lg:gap-8 md:gap-y-16">
            {posts.map((post) => (
              <FeaturedArticle
                key={post.id}
                title={post.title}
                summary="Bấm vào để xem chi tiết bài viết và mã nguồn hướng dẫn thực hành kỹ thuật..."
                img={post.cover_image || '/images/default-thumbnail.jpg'}
                time={formatDate(post.created_at)}
                link={`/articles/${post.slug}`}
              />
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12 text-lg">Không tìm thấy bài viết nào phù hợp.</p>
        )}

        {/* 🧭 THANH PHÂN TRANG URL-DRIVEN */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-20 border-t border-dark/10 dark:border-light/10 pt-6">
            <span className="text-sm text-gray-500">
              Trang {currentPage} / {totalPages}
            </span>
            <div className="flex gap-3">
              <Link
                href={`/articles?page=${Math.max(currentPage - 1, 1)}${searchText ? `&search=${searchText}` : ''}`}
                className={`px-4 py-2 border border-dark rounded-xl text-sm font-medium dark:border-light ${currentPage === 1 ? 'pointer-events-none opacity-30' : 'hover:bg-dark/5 dark:hover:bg-light/5'}`}
              >
                Trước
              </Link>
              <Link
                href={`/articles?page=${Math.min(currentPage + 1, totalPages)}${searchText ? `&search=${searchText}` : ''}`}
                className={`px-4 py-2 border border-dark rounded-xl text-sm font-medium dark:border-light ${currentPage === totalPages ? 'pointer-events-none opacity-30' : 'hover:bg-dark/5 dark:hover:bg-light/5'}`}
              >
                Sau
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}