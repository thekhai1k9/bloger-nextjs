export const runtime = 'edge'
export const maxDuration = 30

export const POST = async (req: Request) => {
  try {
    const { messages } = await req.json() 
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY 

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}` 

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          // Đây là chỗ "dạy" nó làm trợ lý cho ông
          { role: "user", parts: [{ text: "Bạn là trợ lý ảo của Khải. Hãy luôn xưng hô thân thiện và hỗ trợ hết mình." }] },
          { role: "model", parts: [{ text: "Đã rõ, tôi là trợ lý ảo của anh Khải!" }] },
          // Các tin nhắn cũ để AI nhớ ngữ cảnh
          ...messages.map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          }))
        ]
      }),
    }) 

    return new Response(response.body) 
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 }) 
  }
}