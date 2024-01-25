"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import React from "react"

interface FeaturedArticleIProps {
  img: any,
  title: string,
  time: string,
  summary: string,
  link: string,
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
    <li className="col-span-1 w-full p-4 bg-light border border-solid border-dark rounded-2xl relative dark:bg-dark dark:border-light">
      <div className="absolute top-0 -right-3 -z-10 w-[101%] h-[103%] rounded-[2.5rem] bg-dark rounded-br-3xl" />
      <Link
        href={link}
        target={"_blank"}
        className="w-full inline-block cursor-pointer overflow-hidden rounded-lg"
      >
        <FrammerImage
          src={img}
          alt={title}
          className="w-full h-auto"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          priority
          sizes="(max-width: 768px) 100vw, (max-witdth: 1200px) 50vw, 50vw"
        />
      </Link>
      <Link href={link} target={"_blank"}>
        <h2 className="capitalize text-2xl font-bold my-2 mt-4 hover:underline xs:text-lg">
          {title}
        </h2>
      </Link>
      <p className="text-sm mb-2">{summary}</p>
      <span className="text-primary font-semibold dark:text-primaryDark">{time}</span>
    </li>
  )
}

export default FeaturedArticle
