'use client'

import {useState, useEffect, useCallback} from 'react'
import {createClient} from '@/lib/supabase/client'
import {Post} from '@/types/admin'
import {generateSlug} from '@/helpers/utils'

export function useAdminLogic() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchText, setSearchText] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)

  const [title, setTitle] = useState('')
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [contentHtml, setContentHtml] = useState('')

  const supabase = createClient()

  const fetchPosts = useCallback(async() => {
    setLoading(true)
    const {data, error} = await supabase
      .from('posts')
      .select('*')
      .order('created_at', {ascending: false})
    if (!error && data) {
      setPosts(data)
      setFilteredPosts(data)
    }
    setLoading(false)
  },[])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  useEffect(() => {
    const result = posts.filter((post) =>
      post.title?.toLowerCase().includes(searchText.toLowerCase()),
    )
    setFilteredPosts(result)
    setCurrentPage(1)
  }, [searchText, posts])

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )
  const totalPages = Math.ceil(filteredPosts.length / pageSize)

  const handleUploadCoverImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files || e.target.files.length === 0) return
    try {
      setUploading(true)
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `cover-${Date.now()}.${fileExt}`

      const {error: uploadError} = await supabase.storage
        .from('blog_images')
        .upload(fileName, file)
      if (uploadError) throw uploadError

      const {data} = supabase.storage.from('blog_images').getPublicUrl(fileName)
      setCoverImage(data.publicUrl)
    } catch (error) {
      alert('Lỗi tải ảnh bìa!')
    } finally {
      setUploading(false)
    }
  }

  const openModal = (post: Post | null = null) => {
    setEditingPost(post)
    if (post) {
      setTitle(post.title)
      setCoverImage(post.cover_image)
      setContentHtml(post.content)
    } else {
      setTitle('')
      setCoverImage(null)
      setContentHtml('')
    }
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const postSlug = generateSlug(title)

    if (editingPost) {
      await supabase
        .from('posts')
        .update({
          title,
          slug: postSlug,
          content: contentHtml,
          cover_image: coverImage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingPost.id)
    } else {
      await supabase
        .from('posts')
        .insert([
          {
            title,
            slug: postSlug,
            content: contentHtml,
            cover_image: coverImage,
          },
        ])
    }

    setIsModalOpen(false)
    fetchPosts()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      await supabase.from('posts').delete().eq('id', id)
      fetchPosts()
    }
  }

  const handleEditorChange = useCallback((html: string) => {
    setContentHtml(html)
  }, [])

  return {
    posts,
    paginatedPosts,
    loading,
    uploading,
    searchText,
    setSearchText,
    currentPage,
    setCurrentPage,
    totalPages,
    isModalOpen,
    setIsModalOpen,
    editingPost,
    title,
    setTitle,
    coverImage,
    setCoverImage,
    contentHtml,
    openModal,
    handleSave,
    handleDelete,
    handleUploadCoverImage,
    handleEditorChange,
    fetchPosts
  }
}
