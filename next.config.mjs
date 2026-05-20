import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],

  // Thêm cấu hình images vào đây khi cần
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'atwxvuurcklsgoytdgkc.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig

// const withMDX = createMDX({
//   options: {
//     remarkPlugins: [remarkGfm],
//     rehypePlugins: [[rehypePrettyCode, {theme: 'github-dark'}]],
//   },
// })

// export default withMDX(nextConfig)
