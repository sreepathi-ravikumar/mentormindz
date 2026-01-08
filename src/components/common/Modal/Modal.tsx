import { useEffect } from 'react'
import styles from './Modal.styles.module.css'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  closeButton?: boolean
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  closeButton = true,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        {(title || closeButton) && (
          <div className={styles.header}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {closeButton && (
              <button className={styles.closeBtn} onClick={onClose}>
                ×
              </button>
            )}
          </div>
        )}

        <div className={styles.content}>{children}</div>
      </div>
    </>
  )
}
