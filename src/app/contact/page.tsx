'use client'

import TransitionEffect from '@/components/TransitionEffect'
import Head from 'next/head'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import FormContactSendMail from './_components/FormContactSendMail'

const page = () => {
  const [loading, setLoading] = useState(false)
  
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
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    toast('Please wait before sending again...', {
      icon: '⚠️',
    })
    return
  }

  return (
    <React.Fragment>
      <Head>
        <title>Code Bug || Contact Page</title>
        <meta name="description" content="any description"></meta>
      </Head>
      <TransitionEffect />
      <FormContactSendMail loading={loading} handleSubmit={handleSubmit}/>
    </React.Fragment>
  )
}

export default page
