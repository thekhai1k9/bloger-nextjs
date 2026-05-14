'use client'
import {useEffect, useState} from 'react'
import {SpotifyData} from '@/types/spotify'
import SpotifyVisualizer from './animations/SpotifyVisualizer'

export default function SpotifyNowPlaying() {
  const [data, setData] = useState<SpotifyData | null>(null)

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch('/api/spotify')
        console.log("🚀 ~ fetchNowPlaying ~ res:", res)
        const json: SpotifyData = await res.json()
        setData(json)
      } catch (error) {
        console.error('Lỗi fetch Spotify:', error)
      }
    }
    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, 30000)
    return () => clearInterval(interval)
  }, [])

  // Nếu không nghe gì, hiển thị icon Spotify tĩnh hoặc text mờ
  if (!data?.isPlaying) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <span className="grayscale">🎧</span>
        <span>Not listening</span>
      </div>
    )
  }

  return (
    <a
      href={data.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 transition-all w-fit"
    >
      {/* Hiển thị Visualizer thay vì icon tĩnh */}
      <SpotifyVisualizer />

      <div className="flex flex-col">
        <span className="text-sm font-bold truncate max-w-[150px]">
          {data.title}
        </span>
        <span className="text-xs text-gray-400 truncate max-w-[150px]">
          {data.artist}
        </span>
      </div>
    </a>
  )
}
