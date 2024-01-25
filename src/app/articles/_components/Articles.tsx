'use client'

import Link from "next/link"
import React, { useRef } from "react"
import { motion, useMotionValue } from "framer-motion"
import Image from "next/image"

interface ArticlesIProps {
  image?: any;
  title: string;
  date: string;
  link: string;
}

interface MovingImageIProps {
  title: string,
  image: any,
  link: string
}

const MovingImage:React.FC<MovingImageIProps> = ({ title, image, link }) => {

  const FrammerImage = motion(Image)
  const x = useMotionValue<number>(0)
  const y = useMotionValue<number>(0)
  const imgRef = useRef<any>(null)

  const handleMouse = (event: any) => {
    imgRef.current.style.display = "inline-block"
    x.set(event.pageX)
    y.set(-10)
  } 

  const handleMouseLeave = (event: any) => {
    imgRef.current.style.display = "none"
    x.set(0)
    y.set(0)
  }

  return (
    <Link 
      href={link} 
      target={"_blank"}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
    >
      <h2 className="capitalize text-xl font-semibold hover:underline">{title}</h2>
      <FrammerImage 
        style={{ x: x, y: y }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, transition: {duration: 0.2}}}
        ref={imgRef} 
        src={image} 
        alt={title}
        className="z-10 w-96 h-auto hidden absolute rounded-lg md:!hidden"
      />
    </Link>
  )
}

const Articles: React.FC<ArticlesIProps> = ({ image, title, date, link }) => {
  return (
    <motion.li
      className="relative w-full p-4 py-6 my-4 rounded-xl flex items-center 
      justify-between bg-light text-dark first:mt-0 border border-solid border-dark
      border-r-4 border-b-4 dark:border-light dark:text-light dark:bg-dark
      sm:flex-col"
      initial={{y: 200}}
      whileInView={{y: 0, transition: { duration: 0.5, ease: "easeInOut"}}}
      viewport={{once: true}}
    >
      <MovingImage title={title} image={image} link={link}/>
      <span className="text-primary font-semibold pl-4 dark:text-primaryDark sm:self-start sm:pl-0 xs:text-sm">{date}</span>
    </motion.li>
  )
}

export default Articles
