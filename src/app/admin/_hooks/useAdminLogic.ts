'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Post } from '@/types/admin'
import toast from 'react-hot-toast'
import { extractStoragePaths } from '@/helpers/utils'

export function useAdminLogic() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const supabase = createClient()

  // fetch danh sách bài viết từ database
  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        setPosts(data)
        setFilteredPosts(data)
      }
    } catch (error: any) {
      toast.error('Lỗi khi lấy danh sách bài viết: ' + error.message)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  useEffect(() => {
    const result = posts.filter((post) =>
      post.title?.toLowerCase().includes(searchText.toLowerCase())
    )
    setFilteredPosts(result)
    setCurrentPage(1) 
  }, [searchText, posts])

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )
  const totalPages = Math.ceil(filteredPosts.length / pageSize)

  
  // ============= HANDLE DELETE =================
  const handleDelete = async (post: Post) => {
    try {
      const filesToDelete = extractStoragePaths(post.content || '', post.cover_image || null)

      const { error: dbError } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id)

      if (dbError) throw dbError

      // dọn dẹp Storage 
      if (filesToDelete.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('blog_images')
          .remove(filesToDelete)
        
        if (storageError) {
          console.error('Lỗi dọn dẹp Storage:', storageError.message)
        }
      }

      toast.success('Xóa bài viết và toàn bộ hình ảnh thành công!')
      await fetchPosts()
      // setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id))
    } catch (error: any) {
      toast.error('Xóa thất bại: ' + error.message)
    } finally {
      setIsDeleteOpen(false)
    }
  }

  return {
    paginatedPosts,
    loading,
    searchText,
    setSearchText,
    currentPage,
    setCurrentPage,
    totalPages,
    isDeleteOpen,
    setIsDeleteOpen,
    handleDelete,
    fetchPosts
  }
}