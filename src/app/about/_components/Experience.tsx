import React, { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import ListIcon from '../../../components/ListIcon'

interface DetailsIProps {
  position: string,
  company: string,
  companyLink?: string,
  time: any,
  address: string,
  work: string
}

const Details:React.FC<DetailsIProps> = ({position, company, companyLink, time, address, work}) => {
  const refDetails = useRef(null)
  return (
    <li ref={refDetails} className='my-8 first:mt-0 last:mb-0 w-[60%] mx-auto flex flex-col items-start justify-between md:w-[80%]'>
      <ListIcon reference={refDetails}/>
      <motion.div 
        initial={{y: 50}}
        whileInView={{y: 0}}
        transition={{duration: 0.5, type: "spring"}}
      >
        <h3 className='capitalize font-bold text-2xl sm:text-xl xs:text-lg'>{position}&nbsp;<a href={companyLink} target={'_blank'} className='text-primary capitalize dark:text-primaryDark'>@{company}</a></h3>
        <span className='capitalize font-sans text-dark/75 dark:text-light/75 xs:text-sm'>{time} | {address}</span>
        <p className='font-medium w-full md:text-sm'>{work}</p>
      </motion.div>
    </li>
  )
}

const Experience = () => {
  const ref = useRef(null)
  const { scrollYProgress} = useScroll(
    {
      target: ref,
      offset: ["start end", "center start"]
    }
  )

  return (
    <div className='my-64'>
      <h2 className='font-bold text-8xl mb-32 w-full text-center md:text-6xl xs:text-4xl md:mb-16'>
        Experience
      </h2>
      <div ref={ref} className='relative w-[75%] mx-auto lg:w-[90%] md:w-full'>
        <motion.div 
          style={{scaleY: scrollYProgress}}
          className='absolute left-9 top-0 w-[4px] md:w-[2px] md:left-[30px] xs:left-[20px] h-full bg-dark  origin-top  dark:bg-primaryDark dark:shadow-3xl'
        />
        <ul className='w-full flex flex-col items-start justify-between ml-4 xs:ml-2'>
          <Details
            position="Software Engineer"
            company="Google"
            time="2022-Present"
            address="Mountain View, CA"
            work="Worked on a team responsible for developing new features for Google's 
            search engine, including improving the accuracy and relevance of search results and 
            developing new tools for data analysis and visualization."
          />
          <Details
            position="Software Engineer"
            company="Google"
            time="2022-Present"
            address="Mountain View, CA"
            work="Worked on a team responsible for developing new features for Google's 
            search engine, including improving the accuracy and relevance of search results and 
            developing new tools for data analysis and visualization."
          />
          <Details
            position="Software Engineer"
            company="Google"
            time="2022-Present"
            address="Mountain View, CA"
            work="Worked on a team responsible for developing new features for Google's 
            search engine, including improving the accuracy and relevance of search results and 
            developing new tools for data analysis and visualization."
          />
          <Details
            position="Software Engineer"
            company="Google"
            time="2022-Present"
            address="Mountain View, CA"
            work="Worked on a team responsible for developing new features for Google's 
            search engine, including improving the accuracy and relevance of search results and 
            developing new tools for data analysis and visualization."
          />
        </ul>
      </div>
    </div>
  )
}

export default Experience