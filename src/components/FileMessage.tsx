'use client'

interface FileMessageProps {
  fileUrl: string
  fileName: string
  fileSize: number
  fileType: string
  isSent: boolean
}

export default function FileMessage({ fileUrl, fileName, fileSize, fileType, isSent }: FileMessageProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileIcon = () => {
    if (fileType.startsWith('image/')) return '🖼️'
    if (fileType.startsWith('video/')) return '🎥'
    if (fileType.startsWith('audio/')) return '🎵'
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('word') || fileType.includes('document')) return '📝'
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📊'
    if (fileType.includes('zip') || fileType.includes('rar')) return '📦'
    return '📎'
  }

  const isImage = fileType.startsWith('image/')

  return (
    <div 
      className="flex flex-col gap-2 min-w-[240px] max-w-[300px]"
      style={{
        padding: '12px',
        borderRadius: '12px',
        backgroundColor: isSent ? '#F0FDF4' : '#FFFFFF',
      }}
    >
      {/* Image Preview */}
      {isImage && (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={fileUrl}
            alt={fileName}
            className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition"
            style={{ maxHeight: '200px', objectFit: 'cover' }}
          />
        </a>
      )}

      {/* File Info */}
      <div className="flex items-center gap-3">
        <div 
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg text-2xl"
          style={{
            backgroundColor: isSent ? '#E6F7F3' : '#F3F4F6',
          }}
        >
          {getFileIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <p 
            className="font-medium truncate text-sm"
            style={{ color: isSent ? '#111625' : '#111625' }}
          >
            {fileName}
          </p>
          <p className="text-xs text-gray-500">
            {formatFileSize(fileSize)}
          </p>
        </div>

        <a
          href={fileUrl}
          download={fileName}
          className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition"
          title="Download"
        >
          <svg 
            className="w-5 h-5" 
            style={{ color: isSent ? '#1E9A80' : '#6B7280' }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
            />
          </svg>
        </a>
      </div>
    </div>
  )
}
