'use client'
import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: string, content: string, id: number }[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null) // Ref để kiểm tra vùng trong modal

  // 1. Tự động cuộn xuống
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages])

  //HandleLogic CLose Modal CHAT
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Nếu modal đang mở và vị trí click KHÔNG nằm trong modalRef
      if (isOpen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Hủy đăng ký khi component unmount
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg = { role: 'user', content: input, id: Date.now() }
    const assistantId = Date.now() + 1
    
    setMessages(prev => [...prev, userMsg, { role: 'assistant', content: '', id: assistantId }])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages.map(m => ({ role: m.role, content: m.content })), { role: 'user', content: input }] }),
      })

      if (!response.body) return
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.trim().startsWith('data: ')) {
            try {
              const jsonStr = line.replace('data: ', '').trim()
              const data = JSON.parse(jsonStr)
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text || data.text || ""
              accumulatedText += text
              setMessages(prev => 
                prev.map(msg => msg.id === assistantId ? { ...msg, content: accumulatedText } : msg)
              )
            } catch (e) { continue }
          }
        }
      }
    } catch (err) {
      console.error("Lỗi:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Nút bấm mở chat */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#6366f1] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2"
        >
          <MessageCircle size={24} />
          <span className="font-semibold text-sm hidden md:inline">Hỏi AI về tôi</span>
        </button>
      )}

      {isOpen && (
        <div 
          ref={modalRef}
          className="w-[25vw] md:w-[380px] h-[550px] bg-white dark:bg-[#1b1b1b] shadow-2xl rounded-2xl border border-gray-200 dark:border-white/10 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5"
        >
          {/* Header */}
          <div className="bg-[#6366f1] p-4 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Bot size={18} />
              </div>
              <div>
                <p className="font-bold text-sm leading-none">AI Assistant</p>
                <p className="text-[10px] text-white/70 tracking-tight">Cung cấp bởi Gemini 2.5</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-md transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Chat AI Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30 dark:bg-transparent custom-scrollbar">
            {messages.length === 0 && (
              <div className="text-center space-y-2 mt-10 text-gray-400">
                <Bot className="mx-auto opacity-10" size={60} />
                <p className="text-xs px-10">Chào bạn! Hãy hỏi tôi bất cứ điều gì.</p>
              </div>
            )}
            
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                  ? 'bg-[#6366f1] text-white rounded-tr-none shadow-md' 
                  : 'bg-white dark:bg-[#2a2a2a] border dark:border-white/10 rounded-tl-none shadow-sm dark:text-gray-200'
                }`}>
                  <article className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </article>
                </div>
              </div>
            ))}
            
            {isLoading && !messages[messages.length - 1]?.content && (
              <div className="flex justify-start items-center gap-2 text-xs text-[#6366f1] font-medium">
                <Loader2 size={14} className="animate-spin" /> Đang suy nghĩ...
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-4 bg-white dark:bg-[#1b1b1b] border-t dark:border-white/10 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Nhập câu hỏi..."
              autoFocus
              className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#6366f1]/50 outline-none transition-all dark:text-white"
            />
            <button 
              type="submit" 
              disabled={!input?.trim() || isLoading}
              className="bg-[#6366f1] text-white p-2.5 rounded-xl disabled:opacity-50 hover:bg-[#4f46e5] transition-all"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}