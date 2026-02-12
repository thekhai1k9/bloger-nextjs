'use client' 

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => console.error(error), [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h2 className="text-4xl font-bold text-red-600 mb-4">Đã có lỗi xảy ra!</h2>
      <p className="text-lg text-dark/70 dark:text-light/70 mb-8 max-w-md">
        Chúng tôi rất tiếc vì sự cố này. Hệ thống đã ghi nhận lỗi và sẽ khắc phục sớm nhất có thể.
      </p>
      <div className="flex gap-4">
        <button
          onClick={
            () => reset()
          }
          className="rounded-lg bg-dark text-light dark:bg-light dark:text-dark px-6 py-2.5 font-semibold hover:opacity-90 transition-opacity"
        >
          Thử lại
        </button>
        <a
          href="/"
          className="rounded-lg border-2 border-dark dark:border-light text-dark dark:text-light px-6 py-2.5 font-semibold hover:bg-dark hover:text-light dark:hover:bg-light dark:hover:text-dark transition-all"
        >
          Về trang chủ
        </a>
      </div>
    </div>
  )
}
