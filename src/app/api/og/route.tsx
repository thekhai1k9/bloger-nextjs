// src/app/api/og/route.tsx
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge' // Chạy trên Edge Network để tốc độ load ảnh dưới 50ms

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'Khai DevOps Blog'

  return new ImageResponse(
    (
      <div style={{
        height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#0f172a',
        padding: '80px', color: '#fff', fontFamily: 'sans-serif'
      }}>
        <div style={{ fontSize: '24px', color: '#38bdf8', marginBottom: '20px', fontWeight: 'bold' }}>
          🚀 KHAI DEVOPS TECH
        </div>
        <div style={{ fontSize: '64px', fontWeight: 'bold', lineHeight: '1.2' }}>
          {title}
        </div>
        <div style={{ display: 'flex', marginTop: 'auto', color: '#94a3b8', fontSize: '20px' }}>
          Đọc bài viết tại: https://khaidevops.tech
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}