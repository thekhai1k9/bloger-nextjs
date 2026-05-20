'use client'

import React from 'react'
import {Loader2} from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'admin-primary' | 'auth-submit' | 'secondary'
  loading?: boolean
}

export default function Button({
  children,
  variant = 'admin-primary',
  loading = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-medium transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50'

  const variants = {
    'admin-primary':
      'w-fit bg-primary hover:bg-[#db2777c2] text-white px-5 py-2.5 rounded-xl shadow-sm text-xs sm:text-sm',
    'auth-submit':
      'border-2 border-primary bg-primary text-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-primary transition-all duration-200 dark:text-dark disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed',
    secondary:
      'border border-gray-200 text-gray-600 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-xs sm:text-sm',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        variant === 'auth-submit' ? (
          'Processing...'
        ) : (
          <Loader2 className="w-4 h-4 animate-spin" />
        )
      ) : (
        children
      )}
    </button>
  )
}

