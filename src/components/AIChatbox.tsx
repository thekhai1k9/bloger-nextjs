'use client'
import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Bot, Loader2, Trash2, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'
import profilePic from '../../public/images/profile/developer-pic-1.png'

interface Message {
  role: 'user' | 'assistant'
  content: string
  id: number
}


export const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: string, content: string, id: number }[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPulse, setShowPulse] = useState(true)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null) 
  const inputRef = useRef<HTMLInputElement>(null)


  // Tự động tắt nháy sau 5s
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  //Tự động cuộn khi có message mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ 
        top: scrollRef.current.scrollHeight, 
        behavior: 'smooth'
      })
    }
  }, [messages, isOpen])

  // Forcus vào input khi chát
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  //Đóng modal khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        // Kiểm tra xem click có phải vào nút mở chat không
        const target = event.target as HTMLElement
        if (!target.closest('#chat-toggle-btn')) {
          setIsOpen(false)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Del history chat
  const handleClearChat = () => {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ đoạn chat không?")) {
      setMessages([])
    }
  }

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

      if(!response.ok) throw new Error('Network reponse was not ok.....')
      if (!response.body) throw new Error('No reponse body.......')
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
              if (jsonStr === '[DONE]') continue

              const data = JSON.parse(jsonStr)
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text || data.text || ""
              
              if(text) {
                accumulatedText += text
                setMessages(prev => 
                  prev.map(msg => msg.id === assistantId ? { ...msg, content: accumulatedText } : msg)
                )
              }
            } catch (e) {
              console.error("Error parsing JSON chunk", e)
            }
          }
        }
      }
    } catch (err) {
      console.error("Lỗi:", err)
      setMessages(prev => prev.map(msg => msg.id === assistantId ? { 
        ...msg, 
        content: "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng kiểm tra lại mạng hoặc thử lại sau." 
      } : msg))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Nút bấm mở chat */}
      {!isOpen && (
        <div className="relative group">
          {showPulse && (
            <span className="absolute inset-0 rounded-full bg-[#6366f1] animate-ping opacity-75"></span>
          )}
          
          <button 
            onClick={() => {
              setIsOpen(true)
              setShowPulse(false)
            }}
            className="relative bg-[#6366f1] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2 group"
          >
            <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />
            <span className="font-semibold text-sm hidden md:inline">Hỏi AI về tôi</span>
          </button>
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-dark text-light text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Hỏi tôi về kinh nghiệm & kỹ năng của Admin Website!!!
          </div>
        </div>
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
                <p className="font-bold text-sm leading-none">Trợ lý AI Assistant</p>
                <p className="text-[10px] text-white/70 tracking-tight">Khải Phùng Build with all for love!</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_#4ade80]"></span>
                  <span className="text-xs text-light/90 font-medium">Online</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={handleClearChat}
                className="p-2 hover:bg-white/20 rounded-full transition-colors text-light/80 hover:text-light"
                title="Xóa đoạn chat"
              >
                <Trash2 size={18} />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 hover:bg-white/20 rounded-full transition-colors text-light/80 hover:text-light"
                title="Đóng chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Chat AI Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30 dark:bg-transparent custom-scrollbar">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-6 text-gray-400 animate-in fade-in duration-500">
                <div className="relative w-10 h-10 rounded-full border-2 border-light/50 overflow-hidden bg-white shrink-0">
                  <Image 
                    src={profilePic} 
                    alt="AI Avatar" 
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-dark dark:text-light mb-1">Xin chào! 👋</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tôi là trợ lý ảo của Khải Phùng. Tôi có thể giúp bạn tìm hiểu về kỹ năng, kinh nghiệm, học vấn và các dự án của anh ấy.</p>
                </div>
                <div className="grid grid-cols-1 gap-2 w-full text-xs">
                  <button 
                    onClick={() => { setInput("Bạn có kỹ năng gì?"); inputRef.current?.focus(); }}
                    className="p-2 bg-white dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:text-primary transition-colors text-left"
                  >
                    💡 Anh ấy có những kỹ năng gì?
                  </button>
                  <button 
                    onClick={() => { setInput("Kinh nghiệm làm việc của bạn?"); inputRef.current?.focus(); }}
                    className="p-2 bg-white dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:text-primary transition-colors text-left"
                  >
                    💼 Kinh nghiệm làm việc của anh ấy?
                  </button>
                  <button 
                    onClick={() => { setInput("Làm sao để liên hệ với bạn?"); inputRef.current?.focus(); }}
                    className="p-2 bg-white dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:text-primary transition-colors text-left"
                  >
                    📞 Liên hệ với anh ấy như thế nào?
                  </button>
                </div>
              </div>
            )}
            
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar icon for messages */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                    m.role === 'user' 
                    ? 'bg-gray-200 dark:bg-gray-700 border-transparent' 
                    : 'bg-primary/10 border-primary/20'
                  }`}>
                    {m.role === 'user' ? <User size={16} className="text-gray-600 dark:text-gray-300" /> : <Bot size={18} className="text-primary" />}
                  </div>

                  <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                    m.role === 'user' 
                    ? 'bg-primary text-light rounded-tr-none' 
                    : 'bg-white dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-tl-none dark:text-gray-200'
                  }`}>
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-gray-100">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && !messages[messages.length - 1]?.content && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-white dark:bg-dark border border-gray-200 dark:border-gray-700 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm ml-10">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Đang suy nghĩ...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <div className="p-4 bg-white dark:bg-dark border-t border-gray-100 dark:border-gray-800">
            <form onSubmit={handleSend} className="flex gap-2 relative">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 bg-gray-100 dark:bg-gray-800/50 border border-transparent focus:border-primary/30 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-light placeholder:text-gray-400"
              />
              <button 
                type="submit" 
                disabled={!input?.trim() || isLoading}
                className="bg-primary text-light p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primaryDark hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
              </button>
            </form>
            <div className="text-center mt-2">
              <p className="text-[10px] text-gray-400 dark:text-gray-600">
                AI có thể đưa ra thông tin không chính xác, hãy kiểm tra lại những thông tin quan trọng.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}