export async function downloadVideo(videoUrl: string, filename: string) {
  try {
    const response = await fetch(videoUrl)
    const blob = await response.blob()

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || 'video.mp4'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Download failed:', error)
    throw error
  }
}

export async function shareVideo(videoUrl: string, title: string) {
  try {
    if (navigator.share) {
      await navigator.share({
        title,
        text: 'Check out this educational video from MentorMindz AI',
        url: videoUrl,
      })
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(videoUrl)
      return 'Link copied to clipboard'
    }
  } catch (error) {
    console.error('Share failed:', error)
    throw error
  }
}

export function generateVideoThumbnail(videoUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.src = videoUrl
    video.currentTime = 1

    video.onloadeddata = () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')

      if (ctx) {
        ctx.drawImage(video, 0, 0)
        resolve(canvas.toDataURL())
      } else {
        reject(new Error('Could not get canvas context'))
      }
    }

    video.onerror = () => {
      reject(new Error('Could not load video'))
    }
  })
}