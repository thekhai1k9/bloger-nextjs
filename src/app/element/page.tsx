import AnimationText from '@/components/AnimationText'
import Layout from '@/components/Layout'
import Head from 'next/head'
import React from 'react'
import FeaturedElements from './_components/FeaturedElement'
import project1 from "../../../public/images//projects/crypto-screener-cover-image.jpg"
import project2 from "../../../public/images//projects/agency-website-cover-image.jpg"
import project3 from "../../../public/images//projects/devdreaming.jpg"
import project4 from "../../../public/images//projects/fashion-studio-website.jpg"
import project5 from "../../../public/images//projects/nft-collection-website-cover-image.jpg"
import project6 from "../../../public/images//projects/portfolio-cover-image.jpg"
import Elements from './_components/Elements'
import TransitionEffect from '@/components/TransitionEffect'

const element = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Code Bug || Element Page</title>
        <meta name="description" content="any description"></meta>
      </Head>
      <TransitionEffect/>
      <main className='w-full mb-16 flex flex-col items-center justify-center dark:text-light'>
        <Layout className='pt-16'>
          <AnimationText text="Imagination Trumps Knowledge" className='mb-16 lg:!text-7xl sm:mb-8 sm:!text-6xl xs:text-4xl'/>
          <div className='grid grid-cols-12 gap-24 gap-y-32 xl:gap-x-16 lg:gap-x-8 md:gap-y-24 sm:gap-x-8'>
            <div className='col-span-12'>
              <FeaturedElements 
                img={project1}
                type="Featured Project"
                title="Crypto Screener Application"
                sumary="A feature-rich Crypto Screener App using React, Tailwind CSS, Context API, React Router and Recharts. 
                It shows detail regarding almost all the cryptocurrency. You can easily convert the price in your 
                local currency."
                link="/"
                gitHub=""
              />
            </div>
            <div className='col-span-6 sm:col-span-12'>
              <Elements 
                img={project2}
                type="Featured Project"
                title="Crypto Screener Application"
                link="/"
                gitHub=""
              />
            </div>
            <div className='col-span-6 sm:col-span-12'>
              <Elements 
                img={project3}
                type="Featured Project"
                title="Crypto Screener Application"
                link="/"
                gitHub=""
              />
            </div>

            <div className='col-span-12'>
              <FeaturedElements 
                img={project4}
                type="Featured Project"
                title="Crypto Screener Application"
                sumary="A feature-rich Crypto Screener App using React, Tailwind CSS, Context API, React Router and Recharts. 
                It shows detail regarding almost all the cryptocurrency. You can easily convert the price in your 
                local currency."
                link="/"
                gitHub=""
              />
            </div>
            <div className='col-span-6 sm:col-span-12'>
              <Elements 
                img={project5}
                type="Featured Project"
                title="Crypto Screener Application"
                link="/"
                gitHub=""
              />
            </div>
            <div className='col-span-6 sm:col-span-12'>
              <Elements 
                img={project6}
                type="Featured Project"
                title="Crypto Screener Application"
                link="/"
                gitHub=""
              />
            </div>
          </div>
        </Layout>
      </main>
    </React.Fragment>
  )
}

export default element