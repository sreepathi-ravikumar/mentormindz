import { useRef, useState } from 'react'
import { downloadVideo, shareVideo } from '../../services/video.service'
import styles from './VideoPlayer.styles.module.css'

interface VideoPlayerProps {
  src: string
  title?: string
  onShare?: () => void
  onDownload?: () => void
}

export default function VideoPlayer({
  src,
  title = 'Video',
  onShare,
  onDownload,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const handlePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  const handleDownload = async () => {
    try {
      await downloadVideo(src, `${title}.mp4`)
      onDownload?.()
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleShare = async () => {
    try {
      await shareVideo(src, title)
      onShare?.()
    } catch (error) {
      console.error('Share failed:', error)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          src={src}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          className={styles.video}
        />

        <div className={styles.controls}>
          <button className={styles.playBtn} onClick={handlePlay}>
            {isPlaying ? '⏸' : '▶'}
          </button>

          <div className={styles.progress}>
            <div
              className={styles.progressBar}
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          <span className={styles.time}>
            {Math.floor(currentTime)}s / {Math.floor(duration)}s
          </span>

          <button className={styles.actionBtn} onClick={handleShare} title="Share">
            📤
          </button>

          <button className={styles.actionBtn} onClick={handleDownload} title="Download">
            📥
          </button>
        </div>
      </div>

      {title && <h3 className={styles.title}>{title}</h3>}
    </div>
  )
}
