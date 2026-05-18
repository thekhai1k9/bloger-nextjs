import React from 'react'

interface FormButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: React.ReactNode
}

const ButtonSubmit: React.FC<FormButtonProps> = ({
  loading,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="border-2 border-primary bg-primary text-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-primary transition-all duration-200 dark:text-dark disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed"
    >
      {loading ? 'Processing...' : children}
    </button>
  )
}

export default ButtonSubmit
