'use client'

import React, { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import { Heading1, Heading2, Bold, Italic, List, Image as ImageIcon, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface BlogEditorProps {
  content: string
  onChange: (html: string) => void
}

// Sử dụng React.memo để chặn re-render thừa từ component cha
const BlogEditor = React.memo(({ content, onChange }: BlogEditorProps) => {
  const supabase = createClient()
  const [uploading, setUploading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-4 mx-auto border border-gray-100 shadow-sm block',
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[250px] max-h-[400px] overflow-y-auto p-4 bg-white border border-gray-200 rounded-xl mt-2 text-base text-gray-800',
      },
    },
  })

  // Chỉ cập nhật nội dung khi dữ liệu thực sự thay đổi từ bên ngoài (ví dụ: đổi bài cần sửa)
  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const handleInsertImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !editor) return
    try {
      setUploading(true)
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `content-${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('blog_images').upload(fileName, file)
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('blog_images').getPublicUrl(fileName)
      editor.chain().focus().setImage({ src: data.publicUrl }).run()
    } catch (error) {
      console.error(error)
      alert('Lỗi chèn ảnh nội dung!')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="w-full">
      {editor && (
        <div className="flex flex-wrap gap-1 p-1.5 bg-gray-50 border border-gray-200 rounded-t-xl border-b-0 items-center">
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded-lg hover:bg-gray-200 transition ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-purple-600 font-bold' : ''}`}><Heading1 className="w-4 h-4"/></button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded-lg hover:bg-gray-200 transition ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-purple-600 font-bold' : ''}`}><Heading2 className="w-4 h-4"/></button>
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded-lg hover:bg-gray-200 transition ${editor.isActive('bold') ? 'bg-gray-200 text-purple-600' : ''}`}><Bold className="w-4 h-4"/></button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded-lg hover:bg-gray-200 transition ${editor.isActive('italic') ? 'bg-gray-200 text-purple-600' : ''}`}><Italic className="w-4 h-4"/></button>
          <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded-lg hover:bg-gray-200 transition ${editor.isActive('bulletList') ? 'bg-gray-200 text-purple-600' : ''}`}><List className="w-4 h-4"/></button>
          
          <label className="p-2 rounded-lg hover:bg-gray-200 text-gray-700 cursor-pointer flex items-center justify-center transition" title="Chèn ảnh">
            <input type="file" accept="image/*" onChange={handleInsertImage} className="hidden" disabled={uploading} />
            {uploading ? <Loader2 className="w-4 h-4 animate-spin text-purple-600"/> : <ImageIcon className="w-4 h-4" />}
          </label>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  )
})

BlogEditor.displayName = 'BlogEditor'
export default BlogEditor