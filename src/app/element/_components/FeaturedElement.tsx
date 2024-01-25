import { GithubIcon } from '@/components/Icon'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface FeaturedElementIProps {
  type: string,
  title: string,
  sumary: string,
  img: any,
  link: string,
  gitHub: string
}

const FeaturedElements:React.FC<FeaturedElementIProps> = ({ type, title, sumary, img, link, gitHub}) => {
  return (
    <article className='w-full flex items-center justify-center rounded-3xl border border-solid border-dark bg-light shadow-2xl p-10 relative rounded-br-2xl dark:bg-dark dark:border-light
      lg:flex-col lg:p-8 xs:rounded-2xl xs:rounded-br-3xl xs:p-4'
    >
      <div className="absolute top-0 -right-3 -z-10 w-[101%] h-[103%] rounded-[2.5rem] bg-dark rounded-br-3xl dark:bg-light
        xs:-right-2 xs:h-[102%] sm:h-[102%] xs:w-full xs:rounded-[1.5rem]"
      />
      <Link 
        href={link} 
        target={'_blank'}
        className='w-1/2 cursor-pointer overflow-hidden rounded-lg lg:w-full'
      >
        <Image 
          src={img} 
          alt={title} 
          className='w-full h-auto'
          priority
          sizes="(max-width: 768px) 100vw, (max-witdth: 1200px) 50vw, 50vw"
        />
      </Link>
      
      <div className='w-1/2 flex flex-col items-start justify-between pl-6 lg:w-full lg:pl-0 lg:pt-6'>
        <span className='text-primary font-medium text-xl dark:text-primaryDark xs:text-base'>{type}</span>
        <Link 
          href={link} 
          target={'_blank'} 
          className='hover:underline underline-offset-2'
        >
          <h2 className='my-2 w-full text-left text-4xl font-bold dark:text-light sm:text-sm'>{title}</h2>
        </Link>
        <p className='my-2 font-medium text-dark dark:text-light sm:text-sm'>{sumary}</p>
        <div className='mt-2 flex items-center'>
          <Link href={gitHub} target={'_blank'} className='w-10'><GithubIcon/></Link>
          <Link 
            href={link} 
            target={'_blank'}
            className='ml-4 rounded-lg bg-dark text-light p-2 px-6 text-lg font-semibold hover:bg-dark/80 dark:bg-light dark:text-dark
            sm:px-4 sm:text-base'
          >
            Visit Project
          </Link>
        </div>
      </div>

    </article>
  )
}

export default FeaturedElements