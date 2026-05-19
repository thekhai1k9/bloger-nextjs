'use client'

import React from 'react'
import { Search, Image as ImageIcon, Trash2, Edit3, Loader2 } from 'lucide-react'
import BlogEditor from './BlogEditor'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAdminLogic } from '../_hooks/useAdminLogic'
import TransitionEffect from '@/components/animations/TransitionEffect'

export default function AdminContent() {
  
  const {
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
    handleEditorChange
  } = useAdminLogic()
  return (
    <React.Fragment>
      <TransitionEffect/>
      <div className="min-h-screen bg-[#f8f9fa] p-4 sm:p-6 md:p-8 text-gray-800">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">KP Management</h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">Hệ thống quản trị và biên soạn nội dung Blog bài viết.</p>
            </div>
            <Button onClick={() => openModal(null)} className="w-full sm:w-auto px-6 py-3">
              + Viết bài mới
            </Button>
          </div>

          {/* Tìm kiếm */}
          <div className="mb-6 relative w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết theo tiêu đề..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
            />
            <Search className="absolute left-4 top-3.5 sm:top-4 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          {/* Danh Sách Bảng */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-[#fcfcfd] border-b border-gray-100 text-xs font-bold text-gray-400 tracking-wider">
                    <th className="p-4 pl-6">HÌNH ẢNH & TIÊU ĐỀ BÀI VIẾT</th>
                    <th className="p-4 w-32">NGÀY TẠO</th>
                    <th className="p-4 w-28 text-center">HÀNH ĐỘNG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm text-gray-600">
                  {loading && posts.length === 0 ? (
                    <tr><td colSpan={3} className="p-8 text-center text-gray-400">Đang tải dữ liệu...</td></tr>
                  ) : paginatedPosts.length === 0 ? (
                    <tr><td colSpan={3} className="p-8 text-center text-gray-400">Không tìm thấy bài viết nào.</td></tr>
                  ) : (
                    paginatedPosts.map((post: any) => (
                      <tr key={post.id} className="hover:bg-gray-50/50 transition">
                        <td className="p-4 pl-6 flex items-center gap-4 max-w-sm sm:max-w-md">
                          <div className="w-14 h-9 sm:w-16 sm:h-10 rounded-lg bg-gray-50 border overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {post.cover_image ? <img src={post.cover_image} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300 w-4 h-4" />}
                          </div>
                          <div className="truncate">
                            <p className="font-semibold text-gray-800 truncate text-sm sm:text-base">{post.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5 truncate">/{post.slug}</p>
                          </div>
                        </td>
                        <td className="p-4 text-gray-500 text-xs sm:text-sm">{new Date(post.created_at).toLocaleDateString('vi-VN')}</td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => openModal(post)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"><Edit3 className="w-4 h-4"/></button>
                            <button onClick={() => handleDelete(post.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4"/></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 bg-white border-t border-gray-50">
                <span className="text-xs sm:text-sm text-gray-500">Trang {currentPage} / {totalPages}</span>
                <div className="flex gap-2">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage((p: any) => p - 1)} className="px-3 py-1.5 border rounded-lg text-xs sm:text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition">Trước</button>
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p: any) => p + 1)} className="px-3 py-1.5 border rounded-lg text-xs sm:text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition">Sau</button>
                </div>
              </div>
            )}
          </div>

          {/* MODAL FORM THÊM / SỬA */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4 overflow-y-auto">
              <div className="bg-white rounded-none sm:rounded-2xl w-full max-w-2xl shadow-xl p-5 sm:p-6 min-h-screen sm:min-h-0 max-h-screen sm:max-h-[90vh] overflow-y-auto flex flex-col">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-6">{editingPost ? 'Cập nhật bài viết' : 'Tạo bài viết mới'}</h2>
                
                <form onSubmit={handleSave} className="space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-5">
                    <Input label="Tiêu đề bài viết" required placeholder="Nhập tiêu đề..." value={title} onChange={(e) => setTitle(e.target.value)} />

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Ảnh bìa bài viết (Thumbnail)</label>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer border border-dashed border-gray-300 hover:border-[#8b5cf6] rounded-xl px-4 py-2 flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 transition">
                          <input type="file" accept="image/*" onChange={handleUploadCoverImage} className="hidden" disabled={uploading} />
                          {uploading ? <Loader2 className="w-4 h-4 animate-spin text-[#8b5cf6]"/> : <ImageIcon className="w-4 h-4 text-gray-400"/>}
                          <span>Chọn ảnh</span>
                        </label>
                        {coverImage && (
                          <div className="w-16 h-10 rounded-lg border overflow-hidden relative group">
                            <img src={coverImage} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setCoverImage(null)} className="absolute inset-0 bg-black/60 text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 transition flex items-center justify-center">Xóa</button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Nội dung bài viết</label>
                      <BlogEditor content={contentHtml} onChange={handleEditorChange} />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100">
                    <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="w-28">Hủy bỏ</Button>
                    <Button type="submit" loading={loading} className="w-28">
                      {editingPost ? 'Lưu thay đổi' : 'Đăng bài'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </React.Fragment>
  )
}