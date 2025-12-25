'use client'

import { useState, useRef, useEffect } from 'react'

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob, duration: number) => void
  onCancel: () => void
}

export default function VoiceRecorder({ onSend, onCancel }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    startRecording()
    return () => {
      stopRecording()
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Setup audio analyzer for waveform
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser

      // Start visualizing
      visualize()

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      })
      
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      onCancel()
    }
  }

  const visualize = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    
    const animate = () => {
      analyserRef.current!.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length
      setAudioLevel(average / 255)
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  const handleSend = () => {
    stopRecording()
    
    if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
      onSend(audioBlob, duration)
    }
  }

  const handleCancel = () => {
    stopRecording()
    onCancel()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center"
      onClick={handleCancel}
    >
      <div 
        className="bg-white rounded-t-3xl md:rounded-3xl p-6 w-full md:w-96 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recording Voice</h3>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Waveform Visualization */}
        <div className="flex items-center justify-center h-24 mb-6 bg-gradient-to-r from-[#1E9A80]/10 to-[#1E9A80]/5 rounded-2xl">
          <div className="flex items-center gap-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-[#1E9A80] rounded-full transition-all duration-100"
                style={{
                  height: `${Math.max(8, audioLevel * 60 * (1 + Math.sin(i * 0.5 + Date.now() / 200)))}px`,
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-lg font-mono font-semibold text-gray-900">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleCancel}
            className="w-14 h-14 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            onClick={handleSend}
            disabled={duration < 1}
            className="w-16 h-16 flex items-center justify-center bg-[#1E9A80] hover:bg-[#1a8770] disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition shadow-lg"
          >
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          {duration < 1 ? 'Speak now...' : 'Tap ✓ to send or × to cancel'}
        </p>
      </div>
    </div>
  )
}
