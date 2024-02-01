'use client'

import AnimationText from '@/components/AnimationText'
import Layout from '@/components/Layouts/Layout'
import Head from 'next/head'
import React, {useEffect, useRef} from 'react'
import Image from 'next/image'
import profilePic from '../../../public/images/profile/developer-pic-2.png'
import {useInView, useMotionValue, useSpring} from 'framer-motion'
import Skills from '@/app/about/_components/Skills'
import Experience from '@/app/about/_components/Experience'
import Education from '@/app/about/_components/Education'
import TransitionEffect from '@/components/TransitionEffect'

interface AnimatedNumberTextIProps {
  value: number
}

const AnimatedNumberText: React.FC<AnimatedNumberTextIProps> = ({value}) => {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {duration: 3000})
  const isInView = useInView(ref, {once: true})

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [motionValue, value, isInView])

  useEffect(() => {
    springValue.on('change', (latest: any) => {
      console.log('latest====>', latest)
      if (ref.current && latest.toFixed(0) <= value) {
        ref.current.textContent = latest.toFixed(0)
      }
    })
  }, [springValue, value])

  return <span ref={ref}></span>
}

const about = () => {
  return (
    <div>
      <Head>
        <title>Code Bug || About Page</title>
        <meta name="description" content="any description"></meta>
      </Head>
      <TransitionEffect />
      <main className="flex w-full flex-col items-center justify-center dark:text-light">
        <Layout className="pt-16">
          <AnimationText
            text="Passion Fules Purpse!"
            className="mb-6 lg:!text-7xl sm:!text-6xl xs:!text-4xl sm:mb-8"
          />
          <div className="grid w-full grid-cols-8 gap-16 sm:gap-8">
            <div className="col-span-3 flex flex-col items-start justify-start xl:col-span-4 md:order-2 md:col-span-8">
              <div className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light">
                <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light">
                  Biography
                </h2>
                <p className="font-medium">
                  HI, I AM KHAI PHUNG, A WEB DEVELOPER AND UI/UX DESIGNER WITH A
                  PASSION FOR CREATING BEAUTIFUL, FUNCTIONAL, AND USER-CENTERED
                  DIGITAL EXPERIENCES. WITH 2 YEARS OF EXPERIENCE IN THE FIELD.
                  I AM ALWAYS LOOKING FOR NEW AND INNOVATIVE WAYS TO BRING MY
                  CLIENTS VISIONS TO LIFE.
                </p>
                <p className="my-4 font-medium">
                  I BELIEVE THAT DESIGN IS ABOUT MORE THAN JUST MAKING THINGS
                  LOOK PRETTY. IT ABOUT SOLVING PROBLEMS AND CREATING INTUITIVE,
                  ENJOYABLE EXPERIENCES FOR USERS.
                </p>
                <p className="font-medium">
                  WHETHER I AM WORKING ON A WEBSITE, MOBILE APP, OR OTHER
                  DIGITAL PRODUCT, I BRING MY COMMITMENT TO DESIGN EXCELLENCE
                  AND USER-CENTERED THINKING TO EVERY PROJECT I WORK ON. I LOOK
                  FORWARD TO THE OPPORTUNITY TO BRING MY SKILLS AND PASSION TO
                  YOUR NEXT PROJECT.
                </p>
              </div>
            </div>

            <div
              className="col-span-3 relative h-max rounded-2xl border-2 border-solid border-dark bg-light p-8 dark:bg-dark dark:border-light
              xl:col-span-4 md:order-1 md:col-span-8"
            >
              <div className="absolute top-0 -right-3 -z-10 w-[102%] h-[103%] rounded-2xl bg-dark dark:bg-light" />
              <Image
                src={profilePic}
                alt="Hình ảnh"
                className="w-full h-auto rounded-2xl"
                priority
                sizes="(max-width: 768px) 100vw, (max-witdth: 1200px) 50vw, 33vw"
              />
            </div>

            <div className="col-span-2 flex flex-col items-end justify-between xl:col-span-8 xl:flex-row xl:items-center md:order-3">
              <div className="flex flex-col items-end justify-center xl:items-center">
                <span className="inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl">
                  <AnimatedNumberText value={100} />+
                </span>
                <h2 className="text-xl font-medium capitalize text-dark/75 dark:text-light/75 xl:text-center md:text-lg sm:text-base xs:text-sm">
                  satisfied clients
                </h2>
              </div>
              <div className="flex flex-col items-end justify-center xl:items-center">
                <span className="inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl">
                  <AnimatedNumberText value={7} />+
                </span>
                <h2 className="text-xl font-medium capitalize text-dark/75 dark:text-light/75 xl:text-center md:text-lg sm:text-base xs:text-sm">
                  project completed
                </h2>
              </div>
              <div className="flex flex-col items-end justify-center xl:items-center">
                <span className="inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl">
                  <AnimatedNumberText value={2} />+
                </span>
                <h2 className="text-xl font-medium capitalize text-dark/75 dark:text-light/75 xl:text-center md:text-lg sm:text-base xs:text-sm">
                  years of experience
                </h2>
              </div>
            </div>
          </div>
          <Skills />
          <Experience />
          <Education />
        </Layout>
      </main>
    </div>
  )
}

export default about
