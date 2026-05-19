'use client'

import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import {useForm, Controller} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {Image as ImageIcon, Loader2, ArrowLeft} from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import {createClient} from '@/lib/supabase/client'
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
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: {errors, isSubmitting},
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {title: '', cover_image: null, content: ''},
  })

  const currentCoverImage = watch('cover_image')

  const handleUploadCoverImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return
      setUploading(true)

      const fileExt = file.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const filePath = `covers/${fileName}`

      const {error: uploadError} = await supabase.storage
        .from('blog_images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const {data} = supabase.storage
        .from('blog_images')
        .getPublicUrl(filePath)
      setValue('cover_image', data.publicUrl, {shouldValidate: true})
      toast.success('Tải ảnh bìa thành công!')
    } catch (err: any) {
      toast.error('Lỗi tải ảnh: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (values: PostFormValues) => {
    try {
      const slug = values.title
        .toLowerCase()
        .substring(0, 150)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const {error} = await supabase.from('posts').insert({
        title: values.title,
        cover_image: values.cover_image,
        content: values.content,
        slug,
        created_at: new Date().toISOString(),
      })

      if (error) throw error

      toast.success('Đăng bài viết thành công!')
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message)
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
            Tạo bài viết mới
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Tiêu đề bài viết"
              placeholder="Nhập tiêu đề mượt mà tại đây..."
              error={errors.title?.message}
              {...register('title')}
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ảnh bìa bài viết (Thumbnail)
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer border border-dashed border-gray-300 hover:border-[#8b5cf6] rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadCoverImage}
                    className="hidden"
                    disabled={uploading || isSubmitting}
                  />
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#8b5cf6]" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-gray-400" />
                  )}
                  <span>Chọn ảnh từ thiết bị</span>
                </label>

                {currentCoverImage && (
                  <div className="w-20 h-12 rounded-lg border overflow-hidden relative group">
                    <img
                      src={currentCoverImage}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                    <button
                      type="button"
                      onClick={() => setValue('cover_image', null)}
                      className="absolute inset-0 bg-black/70 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nội dung bài viết
              </label>
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white min-h-[350px]">
                <Controller
                  name="content"
                  control={control}
                  render={({field}) => (
                    <BlogEditor
                      content={field.value}
                      onChange={(html) => field.onChange(html)}
                    />
                  )}
                />
              </div>
              {errors.content && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">
                  {errors.content.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/admin')}
                className="w-28"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={uploading}
                className="w-28 bg-[#8b5cf6] hover:bg-[#7c3aed]"
              >
                Đăng bài
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
