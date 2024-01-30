'use client'

import { GithubIcon } from '@/components/Icon'
import Layout from '@/components/Layout'
import TransitionEffect from '@/components/TransitionEffect'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

const page = () => {
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
                <span className='text-green-500'>LG</span>BLOG
              </div>  
              <div className='py-10'>
                <h2 className='text-3xl font-bold text-green-500 mb-2'>Sign in to Account</h2>
                <div className='border-2 w-10 border-green-500 inline-block mb-2'/>

                <div className='flex justify-center my-2'>
                  <Link href={'#'} className='border-2 border-light/70 rounded-full p-3'>
                    <GithubIcon className='w-8 mr-3'/>
                  </Link>
                  <Link href={'#'} className='border-2 border-light/70 rounded-full p-3'>
                    <GithubIcon className='w-8 mr-3'/>
                  </Link>
                  <Link href={'#'} className='border-2 border-light/70 rounded-full p-3'>
                    <GithubIcon className='w-8 mr-3'/>
                  </Link>
                </div>
                <p className='text-dark/60 my-3 text-sm'>or use your email account</p>
                
                <div className='flex flex-col items-center'>
                  <div className='bg-gray-200 w-64 p-2 flex items-center mb-3 rounded-3xl'> 
                    <GithubIcon className='w-3.5 mr-2'/>
                    <input type='text' name='email' placeholder='Email' className='bg-gray-200 outline-none text-sm'/>
                  </div>
                  <div className='bg-gray-200 w-64 p-2 flex items-center mb-3 rounded-3xl'> 
                    <GithubIcon className='w-3.5 mr-2'/>
                    <input type='password' name='password' placeholder='Password' className='bg-gray-200 outline-none text-sm'/>
                  </div>
                  <div className='flex justify-between w-64 mb-5'>
                    <label className='flex items-center text-xs'>
                      <input type='checkbox' name='rememberme' className='mr-1'/>Remember me
                    </label>
                    <Link href={'#'} className='text-xs'>Forgot password</Link>
                  </div>
                  <Link href='/auth/sign-up' className='border-2 border-green-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-white/80 hover:text-green-500'>Sign Up</Link>
                </div>
              </div>
            </div>

            <div className='w-2/5 bg-green-500 text-light rounded-tr-2xl rounded-br-2xl py-36 px-12'>
              <h2 className='text-3xl font-bold mb-2'>Hello, friend!</h2>
              <div className='border-2 w-10 border-light inline-block mb-2'/>
              <p className='mb-10 text-sm'>Fill up personal information and start journey with us.</p>
              <Link href='/auth/sign-up' className='border-2 border-light rounded-full px-12 py-2 inline-block font-semibold hover:bg-white/80 hover:text-green-500'>Sign Up</Link>
            </div>
          </div>
        </Layout>
      </main>
    </React.Fragment>
  )
}

export default page