import React from "react"
import { motion } from "framer-motion"
import { CSSICon, ExpressJSIcon, HTMLIcon, JSIcon, LinuxIcon, ReactIcon, TypeScriptIcon } from "../../../components/Icon"

interface SkillIProps {
  children: React.ReactNode
  x: string
  y: string
}

const Skill: React.FC<SkillIProps> = ({ children, x, y }) => {
  return (
    <motion.div
      className="flex items-center justify-center rounded-full font-semibo py-3 px-6 shadow-dark cursor-pointer absolute dark:text-dark
      lg:py-2 lg:px-4 md:text-sm md:py-1.5 md:px-3 xs:bg-transparent xs:dark:bg-transparent xs:text-dark xs:dark:text-light xs:font-bold" 
      whileHover={{ scale: 1.05 }}
      initial={{x: 0, y: 0}}
      whileInView={{x: x, y: y, transition: { duration: 1.5 }}}
      viewport={{once: true}}
    >
      {children}
    </motion.div>
  )
}

const Skills = () => {
  return (
    <React.Fragment>
      <h2 className="font-bold text-8xl mt-64 w-full text-center md:text-6xl md:mt-32">Skills</h2>
      <div className="w-full h-screen relative flex items-center justify-center rounded-full bg-circularLight dark:bg-circularDark
        lg:h-[80vh] sm:h-[60vh] xs:h-[50vh] 
        lg:bg-circularLightLg lg:dark:bg-circularDarkLg
        md:bg-circularLightMd md:dark:bg-circularDarkLg
        sm:bg-circularLightSm sm:dark:bg-circularLightSm"
      >
        <motion.div
          className="flex items-center justify-center rounded-full font-semibold bg-dark text-light p-8 shadow-dark cursor-pointer dark:bg-light dark:text-dark
          lg:p-6 md:p-4 xs:text-xs xs:p-2"
          whileHover={{ scale: 1.05 }}
        >
          Web
        </motion.div>
        <Skill x="-10vw" y="2vw"><HTMLIcon/></Skill>
        <Skill x="-7vw" y="-7vw"><CSSICon/></Skill>
        <Skill x="10vw" y="6vw"><JSIcon/></Skill>
        <Skill x="-2vw" y="12vw"><ReactIcon/></Skill>
        <Skill x="15vw" y="-8vw"><ExpressJSIcon className="!w-20 !h-20 dark:bg-light"/></Skill>
        <Skill x="-20vw" y="-12vw"><TypeScriptIcon/></Skill>
        <Skill x="25vw" y="-1vw"><LinuxIcon/></Skill>
      </div>
    </React.Fragment>
  )
}

export default Skills
