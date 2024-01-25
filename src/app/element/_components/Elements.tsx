import { GithubIcon } from '@/components/Icon'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface ElementsIProps {
  type: string,
  title: string,
  img: any,
  link: string,
  gitHub: string
}

const Elements:React.FC<ElementsIProps> = ({ type, title, img, link, gitHub}) => {
  return (
    <article className='w-full flex flex-col items-center justify-center rounded-2xl border border-solid border-dark bg-light p-6 relative dark:bg-dark dark:border-light xs:p-4'>
      <div className="absolute top-0 -right-3 -z-10 w-[101%] h-[103%] rounded-[2rem] bg-dark rounded-br-3xl dark:bg-light
        md:-right-2 md:w-[101%] xs:h-[102%] xs:rounded-[1.5rem]"
      />
      <Link 
        href={link} 
        target={'_blank'}
        className='w-full cursor-pointer overflow-hidden rounded-lg'
      >
        <Image src={img} alt={title} className='w-full h-auto'/>
      </Link>
      
      <div className='w-full flex flex-col items-start justify-between mt-4'>
        <span className='text-primary font-medium text-xl dark:text-primaryDark lg:text-lg md:text-base'>{type}</span>
        <Link 
          href={link} 
          target={'_blank'} 
          className='hover:underline underline-offset-2'
        >
          <h2 className='my-2 w-full text-left text-3xl font-bold lg:text-2xl'>{title}</h2>
        </Link>
        <div className='w-full mt-2 flex items-center justify-between'>
          <Link href={gitHub} target={'_blank'} className='w-8 md:w-6'><GithubIcon/></Link>
          <Link 
            href={link} 
            target={'_blank'}
            className='ml-4 text-lg font-semibold hover:underline md:text-base'
          >
            Visit
          </Link>
        </div>
      </div>

    </article>
  )
}

export default Elements