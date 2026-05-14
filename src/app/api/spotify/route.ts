// src/app/api/spotify/route.ts
import { NextResponse } from 'next/server'
import { getNowPlaying } from '@/lib/spotify'
import { SpotifyData } from '@/types/spotify'

export const GET = async () => {
  const response = await getNowPlaying()
  
  if (response.status === 204 || response.status > 400) {
    return NextResponse.json({ isPlaying: false })
  }
  
  const song = await response.json()

  // 2. Kiểm tra nếu item không tồn tại (quảng cáo hoặc lỗi track)
  if (!song || song.item === null) {
    return NextResponse.json({ isPlaying: false })
  }

  const data: SpotifyData = {
    isPlaying: song.is_playing,
    title: song.item.name,
    artist: song.item.artists.map((_artist: any) => _artist.name).join(', '),
    albumImageUrl: song.item.album.images[0]?.url || '', // Thêm optional chaining
    songUrl: song.item.external_urls.spotify
  }

  return NextResponse.json(data)
}