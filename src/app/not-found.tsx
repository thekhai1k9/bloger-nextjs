'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h2 className="text-8xl font-bold text-dark dark:text-light mb-4">404</h2>
      <h3 className="text-2xl font-bold text-dark/75 dark:text-light/75 mb-6">
        Oops! Trang này không tồn tại.
      </h3>
      <p className="text-lg text-dark/60 dark:text-light/60 mb-8 max-w-md">
        Có vẻ như bạn đã lạc vào một không gian chưa được khám phá. 
        Hãy quay lại trang chủ để tiếp tục các trải nghiệm khác nhé.
      </p>
      <Link 
        href="/"
        className="rounded-lg bg-dark text-light dark:bg-light dark:text-dark px-6 py-3 font-semibold text-lg hover:bg-light hover:text-dark border-2 border-transparent hover:border-dark dark:hover:bg-dark dark:hover:text-light dark:hover:border-light transition-all duration-300 shadow-lg"
      >
        Quay về trang chủ
      </Link>
    </div>
  )
}
