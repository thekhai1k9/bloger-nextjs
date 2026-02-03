'use client'

import { EmailIcon, FaceBookIcon, GithubIcon, GoogleICon, PasswordIcon } from '@/components/Icon'
import Layout from '@/components/Layouts/Layout'
import TransitionEffect from '@/components/TransitionEffect'
import Head from 'next/head'
import Link from 'next/link'
import React, { useState } from 'react'
import { motion } from "framer-motion"
import AnimationText from '@/components/AnimationText'

const page = () => {
  // const [formData, setFormDate] = useState({})
  // const handleChange = (e: any) => {
  //   setFormDate({...formData, [e.target.name]: e.target.value})
  // }

  // const handleSubmit = () => {
  //   console.log("run", 456)
  // }
  return (
    <React.Fragment>
      <Head>
        <title>Code Bug || Sign In Page</title>
        <meta name="description" content="any description"></meta>
      </Head>
      <TransitionEffect/>
      <main className="w-full mb-16 flex flex-col items-center justify-center overflow-hidden dark:text-light">
        <Layout className="pt-16">
          <div className='bg-light/80 rounded-2xl shadow-2xl flex justify-center text-center'>
            <div className='w-3/5 p-5'>
              <div className='text-left font-bold'>
                <span className='text-primary dark:text-dark'>KP</span>BLOG
              </div>  
              <div className='py-10'>
                <AnimationText className='!text-3xl font-bold text-primary mb-2 dark:!text-dark' text="Sign out to Account"/>
                <div className='border-2 w-10 border-primary inline-block mb-2'/>

                <div className='flex justify-center my-2'>
                  <motion.a href={'#'} target={'_blank'} whileHover={{y: -2}} className='border-2 border-light/70 rounded-full mx-3 dark:border-transparent dark:p-0'>
                    <GoogleICon className='w-8 h-8'/>
                  </motion.a>
                  <motion.a href={'#'} target={'_blank'} whileHover={{y: -2}} className='border-2 border-light/70 rounded-full mx-3 dark:border-transparent dark:p-0'>
                    <FaceBookIcon className='w-8 h-8'/>
                  </motion.a>
                  <motion.a href={'#'} target={'_blank'} whileHover={{y: -2}} className='border-2 border-light/70 rounded-full mx-3 dark:border-transparent dark:p-0 dark:rounded-full dark:bg-dark'>
                    <GithubIcon className='!w-[32px]'/>
                  </motion.a>
                </div>
                <p className='text-dark/60 my-3 text-sm dark:!text-dark'>or use your email account</p>
                
                <form className='flex flex-col items-center'>
                  <div className='bg-gray-200 p-2 flex items-center mb-3 rounded-3xl'> 
                    <GithubIcon className='w-6 mr-3 sm:mx-1 dark:bg-dark dark:rounded-full'/>
                    <input type='text' name='username' placeholder='User name' className='bg-gray-200 outline-none text-sm'/>
                  </div>
                  <div className='bg-gray-200 p-2 flex items-center mb-3 rounded-3xl'> 
                    <EmailIcon className='w-4 h-4 mr-3 sm:mx-1 dark:rounded-full'/>
                    <input 
                      type='text' 
                      name='email' 
                      placeholder='Email' 
                      className='bg-gray-200 outline-none text-sm'
                      // onChange={handleChange}
                    />
                  </div>
                  <div className='bg-gray-200 p-2 flex items-center mb-3 rounded-3xl'> 
                    <PasswordIcon className='w-4 h-4 mr-3 sm:mx-1 dark:rounded-full'/>
                    <input 
                      type='password' 
                      name='password' 
                      placeholder='Password' 
                      className='bg-gray-200 outline-none text-sm'
                      // onChange={handleChange}
                    />
                  </div>
                  <div className='flex justify-center w-64 mb-5'>
                    <span className='flex items-center text-xs dark:text-dark'>
                      Have an account?<Link href={'#'} className='text-xs text-blueLink ml-2 hover:text-blueLink/80 font-bold'>Sign in</Link>
                    </span>
                  </div>
                  <button 
                    className='border-2 border-primary rounded-full px-12 py-2 inline-block font-semibold hover:bg-white/80 hover:text-primary dark:text-dark'
                  >
                    Sign Up
                  </button>
                </form>
              </div>
            </div>

            <div className='w-2/5 bg-primary text-light rounded-tr-2xl rounded-br-2xl py-36 px-12 xs:hidden'>
              <h2 className='text-3xl font-bold mb-2'>Hello, friend!</h2>
              <div className='border-2 w-10 border-light inline-block mb-2'/>
              <p className='mb-10 text-sm'>Fill up personal information and start journey with us.</p>
              <Link href='/auth/sign-in' className='border-2 border-light rounded-full px-12 py-2 inline-block font-semibold hover:bg-white/80 hover:text-primary lg:text-sm md:text-[10px] md:!px-10 sm:!px-5'>Sign In</Link>
            </div>
          </div>
        </Layout>
      </main>
    </React.Fragment>
  )
}

export default page