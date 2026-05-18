import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  // Nếu sau này bạn có thêm config khác (ví dụ: images, redirects...) thì viết vào đây
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, {theme: 'github-dark'}]],
  },
})

export default withMDX(nextConfig)
