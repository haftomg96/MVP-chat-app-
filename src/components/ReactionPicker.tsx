'use client'

import { useMemo } from 'react'

interface ReactionPickerProps {
  onSelect: (emoji: string) => void
  onClose: () => void
  position: { x: number; y: number }
}

export default function ReactionPicker({ onSelect, onClose, position }: ReactionPickerProps) {
  const emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏', '👏', '🔥']
  
  // Calculate position immediately before render
  const adjustedPosition = useMemo(() => {
    // Calculate picker width (8 emojis * 40px + gaps + padding)
    const pickerWidth = 8 * 40 + 7 * 4 + 16 // emojis + gaps + padding
    const pickerHeight = 60
    
    let x = position.x
    let y = position.y - pickerHeight
    
    // Check if picker goes off-screen on the right
    if (x + pickerWidth > window.innerWidth) {
      // Position to the left instead
      x = position.x - pickerWidth
    }
    
    // Ensure it doesn't go off-screen on the left
    if (x < 10) {
      x = 10
    }
    
    // Check if picker goes off-screen on top
    if (y < 10) {
      y = position.y + 20 // Position below instead
    }
    
    return { x, y }
  }, [position])

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      ></div>

      {/* Picker */}
      <div
        className="fixed bg-white shadow-2xl z-50 rounded-full p-2 flex gap-1"
        style={{
          left: `${adjustedPosition.x}px`,
          top: `${adjustedPosition.y}px`,
          border: '1px solid #E5E7EB',
        }}
      >
        {emojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              onSelect(emoji)
              onClose()
            }}
            className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-gray-100 rounded-full transition"
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
  )
}
