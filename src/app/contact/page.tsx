import React from 'react'
import { Metadata } from 'next'
import ContactContent from './_components/ContactContent'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Liên hệ với Khải Phùng để thảo luận về dự án của bạn hoặc chỉ để gửi lời chào.',
}

const ContactPage = () => {
  return <ContactContent />
}

export default ContactPage
