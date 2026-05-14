import {NextResponse} from 'next/server'

export const GET = async () => {
  try {
    const res = await fetch('https://api.quotable.io/random', {
      cache: 'no-store',
    })
    if (!res.ok) throw new Error('API failed')
    const data = await res.json()
    return NextResponse.json({
      text: data.content,
      author: data.author,
    })
  } catch (err) {
    return NextResponse.json({
      text: 'The only way to do great work is to love what you do.',
      author: 'Steve Jobs',
    })
  }
}
