'use client'

import React, {forwardRef} from 'react'
import {tv, type VariantProps} from 'tailwind-variants'

const inputStyles = tv({
  base: 'w-full text-sm outline-none transition duration-200',
  variants: {
    variant: {
      auth: 'bg-gray-200 text-dark placeholder-gray-500 rounded-3xl px-4 py-2',
      admin:
        'px-3 py-2 sm:py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8b5cf6] bg-white text-gray-800 placeholder-gray-400',
    },
  },
  defaultVariants: {
    variant: 'admin',
  },
})

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputStyles> {
  label?: string
  icon?: React.ReactNode
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({label, icon, variant, className, id, error, ...props}, ref) => {
    const inputId = id || React.useId()

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}

        <div
          className={`relative flex items-center ${variant === 'auth' ? 'bg-gray-200 rounded-3xl w-64' : 'w-full'}`}
        >
          {icon && (
            <div className="absolute left-4 text-gray-500 flex items-center justify-center pointer-events-none z-10">
              {icon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            {...props}
            className={inputStyles({
              variant,
              className: `${icon ? 'pl-11' : ''} ${className}`,
            })}
          />
        </div>
        {error && (
          <p className="text-red-500 text-[11px] mt-0.5 ml-2 font-medium text-left w-full">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
