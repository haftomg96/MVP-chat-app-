'use client'

import { useState, useRef, useEffect } from 'react'

interface VoiceMessageProps {
  audioUrl: string
  duration: number
  isSent: boolean
}

export default function VoiceMessage({ audioUrl, duration, isSent }: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(duration)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setAudioDuration(Math.floor(audio.duration))
    }

    const handleTimeUpdate = () => {
      setCurrentTime(Math.floor(audio.currentTime))
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        await audio.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('Error playing audio:', error)
      setIsPlaying(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0

  return (
    <div 
      className="flex items-center gap-3 min-w-[240px]"
      style={{
        padding: '12px 16px',
        borderRadius: '12px',
        backgroundColor: isSent ? '#F0FDF4' : '#FFFFFF',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition"
        style={{
          backgroundColor: isSent ? '#1E9A80' : '#F3F3EE',
        }}
      >
        {isPlaying ? (
          <svg 
            className="w-5 h-5" 
            style={{ color: isSent ? '#FFFFFF' : '#1E9A80' }}
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg 
            className="w-5 h-5 ml-0.5" 
            style={{ color: isSent ? '#FFFFFF' : '#1E9A80' }}
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Waveform and Progress */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="relative h-8 flex items-center">
          {/* Waveform bars */}
          <div className="flex items-center gap-0.5 h-full">
            {[...Array(30)].map((_, i) => {
              const height = 4 + Math.sin(i * 0.5) * 12 + Math.random() * 8
              const isPassed = (i / 30) * 100 < progress
              return (
                <div
                  key={i}
                  className="w-0.5 rounded-full transition-colors duration-200"
                  style={{
                    height: `${height}px`,
                    backgroundColor: isPassed 
                      ? (isSent ? '#1E9A80' : '#1E9A80')
                      : (isSent ? '#A1D9CC' : '#E5E7EB'),
                  }}
                ></div>
              )
            })}
          </div>
        </div>

        {/* Time */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: isSent ? '#1E9A80' : '#6B7280' }}>
            {formatTime(isPlaying ? currentTime : audioDuration)}
          </span>
          <img
            src="/assets/microphone.svg"
            alt="Voice"
            className="w-3 h-3 opacity-50"
          />
        </div>
      </div>
    </div>
  )
}
