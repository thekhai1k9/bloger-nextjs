import Header from "@/components/Layouts/MainLayout/Header"
import "./globals.css"
import {Montserrat} from "next/font/google"
import React from "react"
import Footer from "@/components/Layouts/MainLayout/Footer"
import TranstackProvider from "@/components/Providers/TanstackProvider"
import { AIChatBot } from "@/components/AIChatbox"

const montserrat = Montserrat({
  subsets: ["latin"], 
  variable: "--font-mont"
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-mont bg-light w-full min-h-screen dark:bg-dark`}>
      {/* xl:p-24 lg:p-16 md:p-12 sm:p-8 */}
        <TranstackProvider>
          <Header/>
            {children}
          <Footer/>
        </TranstackProvider>
          <AIChatBot/>
      </body>
    </html>
  )
}
