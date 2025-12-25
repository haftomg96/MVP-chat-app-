'use client'

interface SkeletonLoaderProps {
  type: 'sidebar' | 'chat' | 'contact'
}

export default function SkeletonLoader({ type }: SkeletonLoaderProps) {
  if (type === 'sidebar') {
    return (
      <div className="w-full md:w-[400px] max-w-full bg-white flex flex-col md:rounded-3xl md:ml-0 md:mr-3 md:mb-3 shadow-sm h-full animate-pulse">
        {/* Header */}
        <div className="px-4 md:px-6 pt-4 md:pt-6 pb-4">
          <div className="flex items-center justify-between mb-5">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
          </div>
          {/* Search */}
          <div className="h-11 bg-gray-200 rounded-xl w-full"></div>
        </div>

        {/* User List Skeletons */}
        <div className="flex-1 overflow-hidden px-4 md:px-6 space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'chat') {
    return (
      <div className="flex-1 flex flex-col bg-white rounded-2xl md:p-2 shadow-sm overflow-hidden h-full animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 bg-gray-50 rounded-2xl">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`${
                  i % 2 === 0 ? 'bg-gray-200' : 'bg-gray-200'
                } rounded-xl p-3 max-w-[70%]`}
              >
                <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3">
          <div className="h-12 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (type === 'contact') {
    return (
      <div className="w-full md:w-[402px] bg-white md:rounded-3xl md:mr-3 md:mb-3 shadow-sm h-full flex flex-col animate-pulse">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        {/* Profile */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-40"></div>
          </div>

          {/* Info sections */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}
