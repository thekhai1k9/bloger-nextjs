"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import React from "react"

interface FeaturedArticleIProps {
  img: string    
  title: string
  time: string
  summary: string
  link: string   
}

const FrammerImage = motion(Image)

const FeaturedArticle: React.FC<FeaturedArticleIProps> = ({
  img,
  title,
  time,
  summary,
  link,
}) => {
  return (
    <li className="col-span-1 w-full p-4 bg-light border border-solid border-dark rounded-2xl relative dark:bg-dark dark:border-light list-none">
      <div className="absolute top-0 -right-3 -z-10 w-[101%] h-[103%] rounded-[2.5rem] bg-dark rounded-br-3xl dark:bg-light" />
      <Link
        href={link}
        className="w-full inline-block cursor-pointer overflow-hidden rounded-lg relative aspect-[16/10]"
      >
        <FrammerImage
          src={img}
          alt={title}
          fill 
          className="object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
      <Link href={link}>
        <h2 className="capitalize text-2xl font-bold my-2 mt-4 hover:underline xs:text-lg text-dark dark:text-light line-clamp-2">
          {title}
        </h2>
      </Link>

      <p className="text-sm mb-4 text-dark/75 dark:text-light/75 line-clamp-3">
        {summary}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-primary font-semibold dark:text-primaryDark text-sm">
          {time}
        </span>
        <Link 
          href={link} 
          className="text-xs font-bold underline text-dark dark:text-light hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          Đọc bài viết →
        </Link>
      </div>

    </li>
  )
}

export default FeaturedArticle