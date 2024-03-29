// 'use client'

import { useEffect, useState } from 'react'

const useThemeSwitcher = () => {

  const preferDarkQuery = "(prefer-color-scheme: dark)"
  const [mode, setMode] = useState<string>("")

  useEffect(() => {
    const mediaQuery = window.matchMedia(preferDarkQuery)
    const usePreference = window.localStorage.getItem("theme")

    const handleChange = () => {
      if(usePreference) {
        let check = usePreference === "dark" ? "dark" : "light"
        setMode(check)
        if(check === "dark") {
          document.documentElement.classList.add('dark')
        }else {
          document.documentElement.classList.remove('dark')
        }
      }else {
        let check = mediaQuery.matches ? "dark" : "light"
        setMode(check)
        if(check === "dark") {
          document.documentElement.classList.add('dark')
        }else {
          document.documentElement.classList.remove('dark')
        }
      }
    }
    
    handleChange()
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  },[])


  useEffect(() => {
    if(mode === "dark") {
      window.localStorage.setItem("theme", "dark")
      document.documentElement.classList.add("dark")
    } else {
      window.localStorage.setItem("theme", "light")
      document.documentElement.classList.remove("dark")
    }
  },[mode])

  return [mode, setMode] as const
}

export default useThemeSwitcher