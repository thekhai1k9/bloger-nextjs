import React from 'react'
import { Metadata } from 'next'
import SignUpContent from './_components/SignUpContent'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Tạo tài khoản mới tại Khải Phùng Portfolio để tham gia cộng đồng chia sẻ kiến thức.',
}

const SignUpPage = () => {
  return <SignUpContent />
}

export default SignUpPage
