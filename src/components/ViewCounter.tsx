'use client'
import { useEffect } from 'react'

export default function ViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    // Gọi API tăng view mỗi khi có người đọc bài
    fetch('/api/views', {
      method: 'POST',
      body: JSON.stringify({ slug }),
      headers: { 'Content-Type': 'application/json' },
    })
  }, [slug])

  return <span className="text-sm text-gray-500">👁️ Đang cập nhật lượt xem...</span>
}