import AnimationText from "@/components/AnimationText"
import Layout from "@/components/Layout"
import Head from "next/head"
import React from "react"
import article1 from "../../../public/images/articles/What is Redux with easy explanation.png"
import article2 from "../../../public/images/articles/form validation in reactjs using custom react hook.png"
import article3 from "../../../public/images/articles/What is higher order component in React.jpg"
import article4 from "../../../public/images/articles/pagination component in reactjs.jpg"
import article5 from "../../../public/images/articles/todo list app built using react redux and framer motion.png"
import FeaturedArticle from "./_components/FeaturedArticle"
import Articles from "./_components/Articles"
import TransitionEffect from "@/components/TransitionEffect"

const page = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Code Bug || Articles Page</title>
        <meta name="description" content="any description"></meta>
      </Head>
      <TransitionEffect/>
      <main className="w-full mb-16 flex flex-col items-center justify-center overflow-hidden dark:text-light">
        <Layout className="pt-16">
            <AnimationText text="Words can Change the Worlds!" className="mb-16 lg:!text-7xl sm:mb-8 sm:!text-6xl xs:!text-4xl"/>
            <ul className="grid grid-cols-2 gap-16 lg:gap-8 md:grid-cols-1 md:gap-y-16">
              <FeaturedArticle 
                img={article1}
                title="Words Can Change The World!"
                time="9p trước"
                summary="Build A Custom Pagination Component In Reactjs From Scratch
                Learn how to build a custom pagination component in ReactJS from scratch. 
                Follow this step-by-step guide to integrate Pagination component in your ReactJS project.
                9 min read"
                link="/"
              />
              <FeaturedArticle 
                img={article2}
                title="Words Can Change The World!"
                time="9p trước"
                summary="Build A Custom Pagination Component In Reactjs From Scratch
                Learn how to build a custom pagination component in ReactJS from scratch. 
                Follow this step-by-step guide to integrate Pagination component in your ReactJS project.
                9 min read"
                link="/"
              />
            </ul>
            <h2 className="font-bold text-4xl w-full text-center my-16 mt-32">All Articles</h2>
            <Articles
              title="Words Can Change The World!"
              date="March 22, 2023"
              link="/"
              image={article3}
            />
            <Articles
              title="Words Can Change The World!"
              date="March 22, 2023"
              link="/"
              image={article4}
            />
            <Articles
              title="Words Can Change The World!"
              date="March 22, 2023"
              link="/"
              image={article5}
            />
            <Articles
              title="Words Can Change The World!"
              date="March 22, 2023"
              link="/"
              image={article3}
            />
            <Articles
              title="Words Can Change The World!"
              date="March 22, 2023"
              link="/"
              image={article4}
            />
            <Articles
              title="Words Can Change The World!"
              date="March 22, 2023"
              link="/"
              image={article5}
            />
        </Layout>
      </main>
    </React.Fragment>
  )
}

export default page
