import React from 'react'
import { Metadata } from 'next'
import AboutContent from './_components/AboutContent'

export const metadata: Metadata = {
  title: 'About',
  description: 'Tìm hiểu thêm về Khải Phùng, một Software Engineer với niềm đam mê tạo ra các trải nghiệm ứng dụng tuyệt vời.',
}

const AboutPage = () => {
  return <AboutContent />
}

export default AboutPage
