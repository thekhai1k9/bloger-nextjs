'use client'

import React, { useState } from 'react'
import { Search, Image as ImageIcon, Trash2, Edit3 } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { useAdminLogic } from '../_hooks/useAdminLogic'
import TransitionEffect from '@/components/animations/TransitionEffect'
import Modal from '@/components/ui/Modal'

export default function AdminContent() {
  const {
    paginatedPosts,
    loading,
    searchText,
    setSearchText,
    currentPage,
    setCurrentPage,
    isDeleteOpen,
    setIsDeleteOpen,
    totalPages,
    handleDelete
  } = useAdminLogic()

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

  const openDeleteConfirm = (id: string) => {
    setSelectedPostId(id) 
    setIsDeleteOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedPostId) return
    await handleDelete(selectedPostId)
    setSelectedPostId(null) 
  }

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
            <Link href="/admin/new-post" className="w-full sm:w-auto">
              <Button className="px-6 py-3">+ Viết bài mới</Button>
            </Link>
          </div>

          {/* Tìm kiếm */}
          <div className="mb-6 relative w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết theo tiêu đề..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
                  {loading && paginatedPosts.length === 0 ? (
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
                            <Link href={`/admin/edit-post/${post.id}`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition">
                              <Edit3 className="w-4 h-4"/>
                            </Link>
                            
                            <button 
                              onClick={() => openDeleteConfirm(post.id)} 
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4"/>
                            </button>
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
        </div>
      </div>
      
      {/* 💡 MODAL */}
      <Modal isOpen={isDeleteOpen} onClose={() => { setIsDeleteOpen(false); setSelectedPostId(null); }} title="Xác nhận xóa">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Bạn có chắc chắn muốn xóa vĩnh viễn bài viết này không? Hành động này không thể hoàn tác.</p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setIsDeleteOpen(false); setSelectedPostId(null); }}>Hủy</Button>
            <Button className="bg-primary hover:[#db2777c2] text-white" onClick={confirmDelete}>Xác nhận xóa</Button>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  )
}