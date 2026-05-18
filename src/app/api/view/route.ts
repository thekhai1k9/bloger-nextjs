// src/app/api/views/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { posts } from '@/lib/db/schema'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json()
    if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 })

    // Tìm xem bài viết đã có trong Postgres chưa
    const existingPost = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1)

    if (existingPost.length > 0) {
      // Nếu có rồi, tăng view lên 1
      await db.update(posts)
        .set({ views: (existingPost[0].views ?? 0) + 1 })
        .where(eq(posts.slug, slug))
    } else {
      // Nếu chưa có (bài mới viết), tạo row mới
      await db.insert(posts).values({ slug, views: 1 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}