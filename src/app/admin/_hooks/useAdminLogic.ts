'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Post } from '@/types/admin'
import toast from 'react-hot-toast'
import { extractStoragePaths } from '@/helpers/utils'

export function useAdminLogic() {
  const [posts, setPosts] = useState<Omit<Post, 'content'>[]>([])
  const [loading, setLoading] = useState(true)

  const [searchText, setSearchText] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0) 
  const pageSize = 5

  const supabase = createClient()

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText)
      setCurrentPage(1) 
    }, 500)

    return () => clearTimeout(handler)
  }, [searchText])

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const from = (currentPage - 1) * pageSize
      const to = from + pageSize - 1

      let query = supabase
        .from('posts')
        .select('id, title, slug, cover_image, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to) 

      if (debouncedSearch.trim()) {
        query = query.ilike('title', `%${debouncedSearch.trim()}%`)
      }

      const { data, error, count } = await query

      if (error) throw error

      setPosts(data || [])
      setTotalCount(count || 0)
    } catch (error: any) {
      toast.error('Lỗi khi lấy danh sách bài viết: ' + error.message)
    } finally {
      setLoading(false)
    }
  }, [supabase, currentPage, debouncedSearch])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const totalPages = Math.ceil(totalCount / pageSize)

  // ============= HANDLE DELETE =================
  const handleDelete = async (post: Post) => {
    try {
      const { data: detailPost } = await supabase
        .from('posts')
        .select('content, cover_image')
        .eq('id', post.id)
        .single()

      const filesToDelete = extractStoragePaths(
        detailPost?.content || '', 
        detailPost?.cover_image || null
      )

      const { error: dbError } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id)

      if (dbError) throw dbError

      if (filesToDelete.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('blog_images')
          .remove(filesToDelete)
        
        if (storageError) {
          console.error('Lỗi dọn dẹp Storage:', storageError.message)
        }
      }

      toast.success('Xóa bài viết thành công!')
      
      if (posts.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
      } else {
        await fetchPosts()
      }
    } catch (error: any) {
      toast.error('Xóa thất bại: ' + error.message)
    } finally {
      setIsDeleteOpen(false)
    }
  }

  return {
    paginatedPosts: posts, 
    loading,
    searchText,
    setSearchText,
    currentPage,
    setCurrentPage,
    totalPages,
    isDeleteOpen,
    setIsDeleteOpen,
    handleDelete,
    fetchPosts,
    totalCount
  }
}