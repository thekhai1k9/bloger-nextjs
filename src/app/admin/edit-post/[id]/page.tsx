'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Image as ImageIcon, Loader2, ArrowLeft } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import BlogEditor from '../../_components/BlogEditor'
import { generateSlugPageAdmin } from '@/helpers/utils'

const postSchema = z.object({
  title: z.string().min(5, 'Tiêu đề bài viết phải có ít nhất 5 ký tự'),
  cover_image: z.string().nullable().optional(),
  content: z.string().min(10, 'Nội dung bài viết quá ngắn'),
})

type PostFormValues = z.infer<typeof postSchema>

interface EditPostPageProps {
  params: { id: string }
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { id } = params
  const router = useRouter()
  const supabase = createClient()

  const [pageLoading, setPageLoading] = useState(true)
  
  // State File ảnh mới được chọn ở Client (Chưa upload)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  // State URL ảnh cũ từ Database 
  const [originalCoverUrl, setOriginalCoverUrl] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: '', cover_image: null, content: '' },
  })

  // 1. Lấy dữ liệu chi tiết
  useEffect(() => {
    async function fetchPostDetail() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        if (data) {
          reset({
            title: data.title,
            cover_image: data.cover_image,
            content: data.content,
          })
          setOriginalCoverUrl(data.cover_image)
          setPreviewUrl(data.cover_image)
        }
      } catch (err: any) {
        toast.error('Không thể tải thông tin bài viết: ' + err.message)
        router.push('/admin')
      } finally {
        setPageLoading(false)
      }
    }
    fetchPostDetail()
  }, [id, reset, router, supabase])

  // Handle ảnh ở client - not upload
  const handleSelectCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    
    // Tạo đường dẫn tạm để hiển thị
    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)
    setValue('cover_image', localUrl, { shouldValidate: true })
  }

  // Hàm phụ bổ trợ việc phân tách đường dẫn lấy tên File trên Storage phục vụ việc Xóa
  const getStoragePathFromUrl = (url: string) => {
    const parts = url.split('/storage/v1/object/public/blog_images/')
    return parts.length > 1 ? parts[1] : null
  }

  // Handle Submit
  const onSubmit = async (values: PostFormValues) => {
    try {
      let finalCoverUrl = originalCoverUrl
      if (selectedFile) {
        // Dọn dẹp, xóa tấm ảnh cũ
        if (originalCoverUrl) {
          const oldPath = getStoragePathFromUrl(originalCoverUrl)
          if (oldPath) {
            await supabase.storage.from('blog_images').remove([oldPath])
          }
        }

        // Đẩy ảnh mới lên hệ thống
        const fileExt = selectedFile.name.split('.').pop()
        const fileName = `covers/${crypto.randomUUID()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('blog_images')
          .upload(fileName, selectedFile)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('blog_images').getPublicUrl(fileName)
        finalCoverUrl = data.publicUrl
      } else if (values.cover_image === null && originalCoverUrl) {
        // Người dùng "Xóa" ảnh 
        const oldPath = getStoragePathFromUrl(originalCoverUrl)
        if (oldPath) {
          await supabase.storage.from('blog_images').remove([oldPath])
        }
        finalCoverUrl = null
      }

      // Đồng bộ cập nhật bản ghi dữ liệu
      const slug = generateSlugPageAdmin(values.title)
      const { data, error } = await supabase
        .from('posts')
        .update({
          title: values.title,
          cover_image: finalCoverUrl,
          content: values.content,
          slug,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')

      if (error) throw error

      toast.success('Cập nhật bài viết thành công!')
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      toast.error('Gặp lỗi trong quá trình xử lý: ' + err.message)
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-[#8b5cf6]" />
          <p className="text-gray-500 font-medium text-sm">Đang tải nội dung bài viết...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 sm:p-6 md:p-8 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Chỉnh sửa bài viết</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Tiêu đề bài viết"
              placeholder="Nhập tiêu đề..."
              error={errors.title?.message}
              {...register('title')}
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh bìa bài viết (Thumbnail)</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer border border-dashed border-gray-300 hover:border-[#8b5cf6] rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSelectCoverImage}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <ImageIcon className="w-4 h-4 text-gray-400" />
                  <span>Thay đổi ảnh</span>
                </label>
                
                {previewUrl && (
                  <div className="w-20 h-12 rounded-lg border overflow-hidden relative group">
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null)
                        setSelectedFile(null)
                        setValue('cover_image', null, { shouldValidate: true })
                      }}
                      className="absolute inset-0 bg-black/70 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nội dung bài viết</label>
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white min-h-[350px]">
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <BlogEditor content={field.value} onChange={(html) => field.onChange(html)} />
                  )}
                />
              </div>
              {errors.content && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.content.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button type="button" variant="secondary" onClick={() => router.push('/admin')} className="w-28">
                Hủy bỏ
              </Button>
              <Button type="submit" loading={isSubmitting} className="w-28 bg-[#8b5cf6] hover:bg-[#7c3aed]">
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}