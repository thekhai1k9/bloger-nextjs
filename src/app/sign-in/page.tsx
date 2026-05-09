import React from 'react'
import { Metadata } from 'next'
import SignInContent from './_components/SignInContent'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Đăng nhập vào tài khoản của bạn để trải nghiệm thêm các tính năng.',
}

const SignInPage = () => {
  return <SignInContent />
}

export default SignInPage
