'use client'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { generateSlugPageAdmin } from '@/helpers/utils'
import { createClient } from '@/lib/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Image as ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'
import BlogEditor from '../_components/BlogEditor'

const postSchema = z.object({
  title: z.string().min(5, 'Tiêu đề bài viết phải có ít nhất 5 ký tự'),
  cover_image: z.string().nullable().optional(),
  content: z.string().min(10, 'Nội dung bài viết quá ngắn'),
})

type PostFormValues = z.infer<typeof postSchema>

export default function NewPostPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: '', cover_image: null, content: '' },
  })

  // không gọi API upload 
  const handleSelectCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    
    // Tạo đường dẫn image
    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)
    setValue('cover_image', localUrl, { shouldValidate: true })
  }

  const handleRemovePreview = () => {
    setPreviewUrl(null)
    setSelectedFile(null)
    setValue('cover_image', null)
  }

  // Hàm Submit
  const onSubmit = async (values: PostFormValues) => {
    try {
      let finalCoverUrl = null

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop()
        const fileName = `covers/${crypto.randomUUID()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('blog_images')
          .upload(fileName, selectedFile)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('blog_images').getPublicUrl(fileName)
        finalCoverUrl = data.publicUrl
      }

      const slug = generateSlugPageAdmin(values.title)

      // Lưu dữ liệu
      const { error } = await supabase
        .from('posts')
        .insert({
          title: values.title,
          cover_image: finalCoverUrl,
          content: values.content,
          slug,
          created_at: new Date().toISOString(),
        })
        .select('*')

      if (error) throw error

      toast.success('Đăng bài viết thành công!')
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      toast.error('Lỗi trong quá trình tạo bài viết: ' + err.message)
    }
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Tạo bài viết mới</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Tiêu đề bài viết"
              placeholder="Nhập tiêu đề bài viết tại đây..."
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
                  <span>Chọn ảnh từ thiết bị</span>
                </label>

                {previewUrl && (
                  <div className="w-20 h-12 rounded-lg border overflow-hidden relative group">
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                    <button
                      type="button"
                      onClick={handleRemovePreview}
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
                Đăng bài
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}