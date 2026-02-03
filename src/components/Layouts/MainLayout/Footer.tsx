import React from 'react'
import Layout from '../Layout'
import Link from 'next/link'

interface FooterIProps {
    className?: string
}

const Footer:React.FC<FooterIProps> = ({className}) => {
  return (
    <footer className='w-full border-t-2 border-solid border-dark font-medium text-lg dark:text-light dark:border-light
      sm:text-base'
    >
      <Layout className='py-8 flex items-center justify-between lg:flex-col lg:py-6'>
        <span>{new Date().getFullYear()} &copy; All Rights Reserved</span>
        <div className='flex items-center lg:py-2'>
          Build with <span className='text-primary text-2xl px-1 dark:text-primaryDark'>&hearts;</span>by&nbsp;<Link href="" className='underline underline-offset-2'>Khai Phung</Link>
        </div>
        <Link href="" target={"_blank"}>Hello world!</Link>
      </Layout>
    </footer>
  )
}

export default Footer