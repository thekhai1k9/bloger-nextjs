'use client'
import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Bot, Loader2, Trash2, User, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'
import profilePic from '../../public/images/profile/developer-pic-1.png'
import toast from 'react-hot-toast'

interface Message {
  role: 'user' | 'assistant'
  content: string
  id: number
}

export const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPulse, setShowPulse] = useState(true)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Màu chủ đạo: Hồng (Pink)
  const THEME_COLOR = "bg-pink-600"
  const THEME_HOVER = "hover:bg-pink-700"

  // Tự động tắt nháy sau 10s
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 10000)
    return () => clearTimeout(timer)
  }, [])

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages, isOpen])

  // Focus input khi mở chat
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Đóng modal khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Kiểm tra kích thước màn hình, nếu là mobile thì không đóng đc
      if (window.innerWidth < 768) return

      if (isOpen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest('#chat-toggle-btn')) {
          setIsOpen(false)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleClearChat = () => {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ đoạn chat không?")) {
      setMessages([])
      toast.success('Đã xóa lịch sử chát with AI Chatbot')
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg: Message = { role: 'user', content: input, id: Date.now() }
    const assistantId = Date.now() + 1
    
    setMessages(prev => [...prev, userMsg, { role: 'assistant', content: '', id: assistantId }])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: messages.concat(userMsg).map(m => ({ role: m.role, content: m.content })) 
        }),
      })

      if (!response.ok) throw new Error('Network response was not ok')
      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.trim().startsWith('data: ')) {
            try {
              const jsonStr = line.replace('data: ', '').trim()
              if (jsonStr === '[DONE]') continue
              
              const data = JSON.parse(jsonStr)
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text || data.text || ""
              
              if (text) {
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
    <div className="fixed bottom-4 right-4 z-[9999] md:bottom-0 md:right-0 md:w-full md:flex md:justify-end md:pointer-events-none">
      {/* Nút mở chat */}
      {!isOpen && (
        <div className="relative group md:pointer-events-auto md:mb-4 md:mr-4">
          {showPulse && (
            <span className="absolute inset-0 rounded-full bg-pink-500 animate-ping opacity-75"></span>
          )}
          
          <button 
            id="chat-toggle-btn"
            onClick={() => {
              setIsOpen(true)
              setShowPulse(false)
            }}
            className={`relative ${THEME_COLOR} text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center gap-2 overflow-hidden border-2 border-white/20`}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></div>
            <MessageCircle size={28} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-semibold text-sm hidden lg:inline relative z-10">Chat với Khải AI</span>
          </button>
        </div>
      )}

      {/* Modal Chat */}
      {isOpen && (
        <div 
          ref={modalRef}
          className={`
            bg-white dark:bg-dark shadow-2xl flex flex-col overflow-hidden 
            animate-in fade-in slide-in-from-bottom-10 duration-300
            
            /* Desktop Styles */
            w-[380px] h-[600px] max-h-[80vh] rounded-2xl border border-gray-200 dark:border-gray-700
            md:pointer-events-auto
            
            /* Mobile Styles (Override with max-width query from Tailwind config or custom class) */
            max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:w-full max-md:h-[85vh] max-md:rounded-b-none max-md:rounded-t-2xl
          `}
        >
          {/* Header */}
          <div className={`${THEME_COLOR} p-4 text-white flex justify-between items-center shadow-md z-10 shrink-0`}>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full border-2 border-white/50 overflow-hidden bg-white shrink-0">
                <Image 
                  src={profilePic} 
                  alt="AI Avatar" 
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div>
                <h3 className="font-bold text-base leading-none flex items-center gap-2">
                  Khải AI Assistant
                  <Sparkles size={14} className="text-yellow-300 animate-pulse" />
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_#4ade80]"></span>
                  <span className="text-xs text-white/90 font-medium">Online - Sẵn sàng hỗ trợ</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={handleClearChat}
                className="p-2 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white"
                title="Xóa đoạn chat"
              >
                <Trash2 size={18} />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white"
                title="Đóng chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-pink-50/50 dark:bg-black/20 custom-scrollbar scroll-smooth">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-6 text-gray-500 animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mb-2 shadow-inner">
                  <Bot className="text-pink-500" size={40} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white mb-1 text-lg">Xin chào! 👋</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[250px] mx-auto">
                    Tôi là trợ lý ảo của Khải. Tôi có thể giúp bạn tìm hiểu về kỹ năng, kinh nghiệm và dự án của anh ấy.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-2 w-full text-sm">
                  <button 
                    onClick={() => { setInput("Bạn có kỹ năng gì?"); inputRef.current?.focus(); }}
                    className="p-3 bg-white dark:bg-gray-800 border border-pink-100 dark:border-gray-700 rounded-xl hover:border-pink-400 hover:text-pink-600 hover:shadow-md transition-all text-left flex items-center gap-2 group"
                  >
                    <span className="bg-pink-100 dark:bg-pink-900/50 p-1.5 rounded-md text-pink-600 group-hover:scale-110 transition-transform">💡</span>
                    Bạn có kỹ năng gì?
                  </button>
                  <button 
                    onClick={() => { setInput("Kinh nghiệm làm việc của bạn?"); inputRef.current?.focus(); }}
                    className="p-3 bg-white dark:bg-gray-800 border border-pink-100 dark:border-gray-700 rounded-xl hover:border-pink-400 hover:text-pink-600 hover:shadow-md transition-all text-left flex items-center gap-2 group"
                  >
                    <span className="bg-blue-100 dark:bg-blue-900/50 p-1.5 rounded-md text-blue-600 group-hover:scale-110 transition-transform">💼</span>
                    Kinh nghiệm làm việc?
                  </button>
                  <button 
                    onClick={() => { setInput("Làm sao để liên hệ với bạn?"); inputRef.current?.focus(); }}
                    className="p-3 bg-white dark:bg-gray-800 border border-pink-100 dark:border-gray-700 rounded-xl hover:border-pink-400 hover:text-pink-600 hover:shadow-md transition-all text-left flex items-center gap-2 group"
                  >
                    <span className="bg-green-100 dark:bg-green-900/50 p-1.5 rounded-md text-green-600 group-hover:scale-110 transition-transform">📞</span>
                    Liên hệ với bạn?
                  </button>
                </div>
              </div>
            )}
            
            {messages.map((m) => {
              // Ẩn tin nhắn nếu nội dung rỗng (đang chờ AI trả lời)
              if (!m.content) return null;
              
              return (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar icon for messages */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${
                    m.role === 'user' 
                    ? 'bg-pink-100 border-pink-200' 
                    : 'bg-white border-gray-100'
                  }`}>
                    {m.role === 'user' ? <User size={16} className="text-pink-600" /> : <Bot size={18} className="text-pink-500" />}
                  </div>

                  <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                    m.role === 'user' 
                    ? `${THEME_COLOR} text-white rounded-tr-none shadow-pink-200 dark:shadow-none` 
                    : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-tl-none text-gray-800 dark:text-gray-200'
                  }`}>
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-gray-100">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            )})}
            
            {/* Chỉ hiện loading khi AI đang xử lý VÀ chưa có nội dung trả về */}
            {isLoading && (!messages.length || !messages[messages.length - 1]?.content) && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm ml-10">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce"></span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Đang soạn tin...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <div className="p-4 bg-white dark:bg-dark border-t border-gray-100 dark:border-gray-800 shrink-0">
            <form onSubmit={handleSend} className="flex gap-2 relative">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className={`flex-1 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-pink-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pink-100 outline-none transition-all dark:text-white placeholder:text-gray-400`}
              />
              <button 
                type="submit" 
                disabled={!input?.trim() || isLoading}
                className={`${THEME_COLOR} text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed ${THEME_HOVER} hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group`}
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
              </button>
            </form>
            <div className="text-center mt-2">
              <p className="text-[10px] text-gray-400 dark:text-gray-600 flex justify-center items-center gap-1">
                Powered by Gemini AI <Sparkles size={8} />
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
