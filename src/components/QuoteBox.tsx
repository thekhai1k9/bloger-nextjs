'use client'

import {useState, useEffect, useRef} from 'react'
import {QuoteData} from '@/types/quote'

export const QuoteBox = () => {
  const [currentQuote, setCurrentQuote] = useState<QuoteData>({
    text: 'Loading inspiration...',
    author: '',
  })
  const [pendingQuote, setPendingQuote] = useState<QuoteData | null>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)

  const fetchQuote = async () => {
    try {
      const res = await fetch('/api/quote')
      const data = await res.json()
      if (data?.text) setPendingQuote(data)
    } catch (err) {
      console.error('Quote fetch error:', err)
    }
  }

  useEffect(() => {
    fetchQuote()
    const interval = setInterval(fetchQuote, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!pendingQuote) return
    if (currentQuote.text === 'Loading inspiration...') {
      setCurrentQuote(pendingQuote)
      setPendingQuote(null)
      return
    }
    // Các lần sau mới đợi
    const element = marqueeRef.current
    if (!element) return
    const onAnimationIteration = () => {
      setCurrentQuote(pendingQuote)
      setPendingQuote(null)
    }
    element.addEventListener('animationiteration', onAnimationIteration, {
      once: true,
    })
    return () =>
      element.removeEventListener('animationiteration', onAnimationIteration)
  }, [pendingQuote])

  const displayText = currentQuote.author
    ? `"${currentQuote.text}" — ${currentQuote.author}`
    : currentQuote.text

  return (
    <div className="w-full py-2 border-y border-zinc-200 dark:border-zinc-800 overflow-hidden bg-transparent">
      <div ref={marqueeRef} className="flex whitespace-nowrap animate-marquee">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center">
            <span className="text-xl md:text-xs font-black uppercase tracking-tighter text-zinc-900 dark:text-white mx-10 selection:bg-zinc-900 selection:text-white">
              {displayText}
            </span>
            <span className="text-xl md:text-xs font-black text-zinc-300 dark:text-zinc-700 mx-10">
              ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
