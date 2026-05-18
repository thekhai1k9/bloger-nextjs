// src/app/blog/[slug]/page.tsx
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc' // Hoặc thư viện compiler bạn dùng trong src/lib/mdx.ts
import { MDXComponents } from '@/components/mdx/MDXComponents'
import ViewCounter from '@/components/blog/ViewCounter'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      images: [`/api/og?title=${encodeURIComponent(post.title)}`], // Trỏ vào API sinh ảnh tự động bên dưới
    },
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <article className="prose max-w-4xl mx-auto py-10">
      <h1>{post.title}</h1>
      {/* Component tăng và hiển thị view động */}
      <ViewCounter slug={post.slug} /> 
      
      <hr />
      {/* Render nội dung MDX kết hợp các custom component (Callout, CodeBlock...) */}
      <MDXRemote source={post.content} components={MDXComponents} />
    </article>
  )
}