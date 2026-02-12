'use client'

import TransitionEffect from '@/components/TransitionEffect'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import FormContactSendMail from './FormContactSendMail'
import { useRouter } from 'next/navigation'

const ContactContent = () => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const title = (form.elements.namedItem('title') as HTMLInputElement).value
    const nameforyou = (form.elements.namedItem('nameforyou') as HTMLInputElement).value
    const message  = (form.elements.namedItem('message') as HTMLInputElement).value
    
    try {
      const res = await fetch('/api/mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, nameforyou, message }),
      })

      if (!res.ok) {
        throw new Error('Send failed')
      }

      toast.success('Message sent successfully')
      form.reset()
      router.push('/')

    } catch (error) {
      toast.error('Something went wrong')
      form.reset()
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <React.Fragment>
      <TransitionEffect />
      <FormContactSendMail loading={loading} handleSubmit={handleSubmit}/>
    </React.Fragment>
  )
}

export default ContactContent
