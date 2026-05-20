'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface HeaderAuthProps {
  isMobile?: boolean
  toggleMobileMenu?: () => void
}

export default function HeaderAuth({ isMobile = false, toggleMobileMenu }: HeaderAuthProps) {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user hiện tại
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    // get status đăng nhập/đăng xuất 
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    if (toggleMobileMenu) toggleMobileMenu()
    router.refresh()
    router.push('/')
  }

  const handleSignInClick = () => {
    if (toggleMobileMenu) toggleMobileMenu()
    router.push('/sign-in')
  }

  if (loading) {
    return <div className="w-14 h-6 bg-gray-300 dark:bg-gray-600 animate-pulse rounded ml-4"></div>
  }

  // TRƯỜNG HỢP 1: Chưa đăng nhập
  if (!user) {
    return (
      <button 
        onClick={handleSignInClick}
        className={`${
          isMobile 
            ? 'mt-4 text-light dark:text-dark font-bold underline' 
            : 'ml-4 font-bold flex items-center justify-center cursor-pointer dark:hover:text-light/75 hover:text-dark/75 text-sm'
        }`}
      >
        Sign in
      </button>
    )
  }

  // TRƯỜNG HỢP 2: Đã đăng nhập thành công
  return (
    <div className={`flex items-center gap-3 ${isMobile ? 'flex-col mt-6' : 'ml-4 text-sm'}`}>
      <div className={`flex flex-col ${isMobile ? 'items-center text-light dark:text-dark' : 'items-end'}`}>
        <span className="font-bold truncate max-w-[120px]">
          {user.user_metadata?.full_name || user.email?.split('@')[0]}
        </span>
        {/* Nếu email là admin thì hiển thị thêm lối tắt truy cập nhanh */}
        {user.email === process.env.ADMIN_INFO && (
          <button 
            onClick={() => {
              if (toggleMobileMenu) toggleMobileMenu()
              router.push('/admin')
            }}
            className="text-[11px] text-purple-500 dark:text-purple-400 font-bold hover:underline"
          >
            Admin Panel
          </button>
        )}
      </div>

      <button
        onClick={handleSignOut}
        className="text-xs font-semibold text-red-500 border border-red-500/30 hover:bg-red-500/10 px-2 py-1 rounded transition"
      >
        Log out
      </button>
    </div>
  )
}