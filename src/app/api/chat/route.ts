export const runtime = 'edge'
export const maxDuration = 30

export const POST = async (req: Request) => {
  try {
    const { messages } = await req.json() 
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY 

    // const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}` 
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}` 

    const systemPrompt = `
    Bạn là trợ lý ảo AI chuyên nghiệp của Khải Phùng (Full-stack Developer).
    Nhiệm vụ của bạn là trả lời các câu hỏi của nhà tuyển dụng hoặc khách ghé thăm website về Khải một cách thân thiện, chuyên nghiệp và chính xác.

    Dưới đây là thông tin chi tiết về Khải Phùng:
    - **Họ tên:** Khải Phùng
    - **Vị trí:** Web Developer (chuyên về React.js, Next.js, ExpressJS, Python, Web Development).
    - **Email:** thekhai1k9@gmail.com
    - **Số điện thoại:** 0393245953
    - **CV (Resume):** Có thể tải xuống tại đường dẫn: /dummy.pdf
    
    - **Kỹ năng (Skills):**
      - Web: HTML, CSS, JavaScript (ES6+), TypeScript, React.js, Next.js, Node.js, Express.js.
      - Ngôn ngữ khác: Python.
      - Hệ thống/Công cụ: Linux, Git, Docker, PostMan, PostgreSql, MySql.

    - **Học vấn (Education):**
      - Học viện Công nghệ Bưu chính Viễn thông (PTIT) - Kỹ thuật Điện tử Viễn thông (2018 - 2023).

    - **Kinh nghiệm làm việc (Experience):**
      1. **Web Developer tại CÔNG TY TNHH DIDOTEK** (11/2022 - 02/2024):
        - Phát triển Front-end & API cho hệ thống bán vé máy bay Thành Hoàng (ags99.vn) và trang quản trị (cms.ags99.vn).
        - Công nghệ: ReactJS, .NET Core API.
      2. **Front End Developer (Thực tập) tại Citek** (06/2021 - 12/2022):
        - Phát triển Front-end cho ứng dụng POS bán hàng.
        - Công nghệ: ReactJS, Redux.
      3. **Dự án cá nhân:** Blog cá nhân (07/2023) - Fullstack (Next.js, Tailwind, Contentlayer).
      4. **Thực tập sinh IT Support tại VIETSEIKO:** Hỗ trợ IT và làm web WordPress.

    - **Phong cách trả lời:**
      - Xưng hô: "Tôi" (với tư cách là trợ lý AI) và "bạn" hoặc "quý khách".
      - Luôn đề cao kỹ năng và kinh nghiệm của Khải.
      - Trả lời ngắn gọn, súc tích nhưng đầy đủ ý.
      - Nếu câu hỏi không liên quan đến Khải hoặc lập trình, hãy khéo léo từ chối hoặc trả lời ngắn gọn và hướng về chủ đề chính.
    `

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: systemPrompt }] },
          { role: "model", parts: [{ text: "Đã rõ. Tôi là trợ lý ảo của Khải Phùng. Tôi đã ghi nhớ toàn bộ thông tin về kỹ năng, kinh nghiệm và học vấn của Khải. Tôi sẵn sàng trả lời các câu hỏi." }] },
          ...messages.map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          }))
        ]
      }),
    }) 

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      return new Response(JSON.stringify({ error: `Gemini API Error: ${response.statusText}`, details: errorText }), { status: response.status, statusText: response.statusText })
    }

    return new Response(response.body) 
  } catch (error: any) {
    console.error("Server Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 }) 
  }
}
