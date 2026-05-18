import React from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode 
}

const FormInput: React.FC<FormInputProps> = ({icon, ...props}) => {
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

export default FormInput
