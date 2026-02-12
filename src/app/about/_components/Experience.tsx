import React, { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import ListIcon from '../../../components/ListIcon'
import Link from 'next/link'

interface DetailsIProps {
  position: string,
  company?: string,
  companyLink?: string,
  time?: any,
  info: string,
  work: string
}

const Details:React.FC<DetailsIProps> = ({position, company, companyLink, time, info, work}) => {
  const refDetails = useRef(null)
  return (
    <li ref={refDetails} className='my-8 first:mt-0 last:mb-0 w-[60%] mx-auto flex flex-col items-start justify-between md:w-[80%]'>
      <ListIcon reference={refDetails}/>
      <motion.div 
        initial={{y: 50}}
        whileInView={{y: 0}}
        transition={{duration: 0.5, type: "spring"}}
      >
        <h3 className='capitalize font-bold text-2xl sm:text-xl xs:text-lg'>{position}&nbsp;<a href={companyLink} target={'_blank'} className='text-primary capitalize dark:text-primaryDark'>{`${company ? company : ''}`}</a></h3>
        <span className='capitalize font-sans text-dark/75 dark:text-light/75 xs:text-sm'>{time} | <Link className='font-bold my-2 mt-4 hover:underline xs:text-lg' href={info}>Visit web: </Link>{info}</span>
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
            position="Web Developer"
            company="CÔNG TY TNHH DIDOTEK"
            time="11/2022 - 02/2024"
            info="https://ags99.vn/"
            work="Lập trình front end & api cho ứng dụng bán vé của hệ thống máy bay Thành Hoàng"
          />
          <Details
            position="Web Developer"
            company="CÔNG TY TNHH DIDOTEK"
            time="11/2022 - 02/2024"
            info="https://cms.ags99.vn"
            work="Lập trình front end & api cho trang quản trị của hệ thống bán vé máy bay Thành Hoàng"
          />
          <Details
            position="Front End Developer"
            company="Thực tập sinh tại Công ty Cổ Phần Công Nghệ Citek"
            time="06/2021 - 12/2022"
            info="https://demo-pos.citek.vn"
            work="Lập trình front end cho ứng dụng POS bán hàng của công ty cổ phần công nghê Citek."
          />
          <Details
            position="Web developer"
            company="Website cá nhân blog"
            time="07/2023"
            info="https://bloger-nextjs.vercel.app/"
            work="Lập trình blog cá nhân với nextjs."
          />
          <Details
            position="Thực tập sinh IT Support"
            company="Công ty TNHH VIETSEIKO"
            info="https://www.vietseiko.com/"
            work="Hỗ trợ it cho công ty và phát triển website công ty bằng wordress"
          />
          <Details
            position="Báo cáo đồ án thực tập"
            info=""
            work="Báo cáo với đề tài: Xây dựng web hosting trên Linux"
          />
        </ul>
      </div>
    </div>
  )
}

export default Experience