import Header from "@/components/Layouts/MainLayout/Header"
import "./globals.css"
import {Montserrat} from "next/font/google"
import React from "react"
import Footer from "@/components/Layouts/MainLayout/Footer"
import TanstackProvider from "@/components/Providers/TanstackProvider"
import { AIChatBot } from "@/components/AIChatbox"
import { Toaster } from 'react-hot-toast'
import type { Metadata } from 'next'

const montserrat = Montserrat({
  subsets: ["latin"], 
  variable: "--font-mont"
})

export const metadata: Metadata = {
  title: {
    // Mặc định tr/duyệt hiển thị: .... | template
    template: '%s | Khải Phùng Portfolio',
    default: 'Khải Phùng Portfolio - Full-stack Developer',
  },
  description: 'For me!!!',
  keywords: ['Next.js', 'React', 'Tailwind CSS', 'Full-stack Developer', 'Portfolio', 'Khải Phùng'],
  authors: [{ name: 'Khải Phùng' }],
  creator: 'Khải Phùng',
  icons: {
    icon: '/favicon.ico',
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-mont bg-light w-full min-h-screen dark:bg-dark`}>
      {/* xl:p-24 lg:p-16 md:p-12 sm:p-8 */}
        <TanstackProvider>
          <Header/>
            <Toaster position="top-right" reverseOrder={false} />
            {children}
          <Footer/>
        </TanstackProvider>
        <AIChatBot/>
      </body>
    </html>
  )
}
