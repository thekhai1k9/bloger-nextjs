'use client'

import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: React.ReactNode
}

export default function Input({
  label,
  icon,
  className = '',
  ...props
}: InputProps) {
  // Giao diện Auth có Icon (Form đăng nhập/đăng ký)
  if (icon) {
    return (
      <div className="bg-gray-200 p-2 flex items-center mb-3 rounded-3xl w-64 px-4">
        <div className="text-gray-500 mr-3 flex items-center justify-center">
          {icon}
        </div>
        <input
          {...props}
          className="bg-gray-200 outline-none text-sm w-full text-dark"
        />
      </div>
    )
  }

  // Giao diện Admin không Icon
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 sm:py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8b5cf6] focus:outline-none placeholder-gray-400 bg-white text-gray-800 transition ${className}`}
        {...props}
      />
    </div>
  )
}
