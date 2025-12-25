'use client'

import { useState } from 'react'

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  onClose: () => void
}

const EMOJI_CATEGORIES = {
  'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔'],
  'Gestures': ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
  'Objects': ['💬', '💭', '🗨️', '🗯️', '💤', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '🗨️', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💾', '💿', '📀'],
}

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState('Smileys')

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      ></div>

      {/* Picker */}
      <div 
        className="absolute bottom-16 left-0 md:left-auto md:right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 w-80 md:w-96"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Emoji</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 p-3 border-b border-gray-200 overflow-x-auto">
          {Object.keys(EMOJI_CATEGORIES).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                activeCategory === category
                  ? 'bg-[#1E9A80] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Emoji Grid */}
        <div className="p-4 h-64 overflow-y-auto">
          <div className="grid grid-cols-8 gap-2">
            {EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES].map((emoji, index) => (
              <button
                key={index}
                onClick={() => {
                  onSelect(emoji)
                  onClose()
                }}
                className="text-2xl hover:bg-gray-100 rounded-lg p-2 transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
