'use client'

import Layout from '@/components/Layouts/Layout'
import AnimationText from '@/components/animations/AnimationText'
import TransitionEffect from '@/components/animations/TransitionEffect'
import ButtonSubmit from '@/components/ui/ButtonSubmit'
import { EmailIcon, FaceBookIcon, GithubIcon, GoogleICon, PasswordIcon } from '@/components/ui/Icon'
import Input from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import { motion } from "framer-motion"
import Link from 'next/link'
import React, { useState } from 'react'

const SignUpContent = () => {
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({type: '', text: ''})

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({type: '', text: ''})

    // 1. Gọi Supabase Auth để đăng ký tài khoản
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name, // Lưu thêm tên vào metadata của Auth user
        },
      },
    })

    setLoading(false)

    if (error) {
      setMessage({type: 'error', text: error.message})
      return
    }

    if (data?.user) {
      setMessage({
        type: 'success',
        text: 'Đăng ký thành công! Hãy kiểm tra hộp thư email để kích hoạt tài khoản.',
      })
      // Clear form
      setEmail('')
      setPassword('')
      setName('')
    }
  }

  return (
    <React.Fragment>
      <TransitionEffect/>
      <main className="w-full mb-16 flex flex-col items-center justify-center overflow-hidden dark:text-light">
        <Layout className="pt-16">
          <div className='bg-light/80 rounded-2xl shadow-2xl flex justify-center text-center'>
            
            <div className='w-3/5 p-5'>
              <div className='text-left font-bold'>
                <span className='text-primary dark:text-dark'>KP</span>BLOG
              </div>  
              <div className='py-10'>
                <AnimationText className='!text-3xl font-bold text-primary mb-2 dark:!text-dark' text="Sign up for Account"/>
                <div className='border-2 w-10 border-primary inline-block mb-2'/>

                {/* Mạng xã hội */}
                <div className='flex justify-center my-2'>
                  <motion.a href={'#'} whileHover={{y: -2}} className='border-2 border-light/70 rounded-full mx-3 dark:border-transparent dark:p-0'><GoogleICon className='w-8 h-8'/></motion.a>
                  <motion.a href={'#'} whileHover={{y: -2}} className='border-2 border-light/70 rounded-full mx-3 dark:border-transparent dark:p-0'><FaceBookIcon className='w-8 h-8'/></motion.a>
                  <motion.a href={'#'} whileHover={{y: -2}} className='border-2 border-light/70 rounded-full mx-3 dark:border-transparent dark:p-0 dark:rounded-full dark:bg-dark'><GithubIcon className='!w-[32px]'/></motion.a>
                </div>
                <p className='text-dark/60 my-3 text-sm dark:!text-dark'>or use your email account</p>
                
                {message.text && (
                  <p className={`text-sm mb-4 font-semibold ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                    {message.text}
                  </p>
                )}
                
                <form onSubmit={handleSignUp} className='flex flex-col items-center'>
                  <Input 
                    type='text' 
                    placeholder='User name' 
                    value={name}
                    onChange={(e: any) => setName(e.target.value)}
                    icon={<GithubIcon className='w-5 h-5 dark:bg-dark dark:rounded-full'/>}
                    required
                  />

                  <Input 
                    type='email' 
                    placeholder='Email' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<EmailIcon className='w-4 h-4'/>}
                    required
                  />

                  <Input 
                    type='password' 
                    placeholder='Password' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<PasswordIcon className='w-4 h-4'/>}
                    required
                  />

                  <div className='flex justify-center w-64 mb-5'>
                    <span className='flex items-center text-xs dark:text-dark'>
                      Have an account?<Link href={'/sign-in'} className='text-xs text-blueLink ml-2 hover:text-blueLink/80 font-bold'>Sign in</Link>
                    </span>
                  </div>

                  <ButtonSubmit type='submit' loading={loading}>
                    Sign Up
                  </ButtonSubmit>
                </form>

              </div>
            </div>

            <div className='w-2/5 bg-primary text-light rounded-tr-2xl rounded-br-2xl py-36 px-12 xs:hidden'>
              <h2 className='text-3xl font-bold mb-2'>Hello, friend!</h2>
              <div className='border-2 w-10 border-light inline-block mb-2'/>
              <p className='mb-10 text-sm'>Fill up personal information and start journey with us.</p>
              <Link href='/sign-in' className='border-2 border-light rounded-full px-12 py-2 inline-block font-semibold hover:bg-white/80 hover:text-primary lg:text-sm md:text-[10px] md:!px-10 sm:!px-5'>Sign In</Link>
            </div>
          </div>
        </Layout>
      </main>
    </React.Fragment>
  )
}

export default SignUpContent