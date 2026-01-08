import { useState } from 'react'
import styles from './Input.styles.module.css'

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'date'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  disabled?: boolean
  error?: string
  label?: string
  required?: boolean
  className?: string
}

export default function Input({
  type = 'text',
  placeholder,
  value = '',
  onChange,
  onBlur,
  disabled = false,
  error,
  label,
  required = false,
  className = '',
}: InputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={() => {
          setFocused(false)
          onBlur?.()
        }}
        onFocus={() => setFocused(true)}
        disabled={disabled}
        className={`${styles.input} ${error ? styles.error : ''} ${className}`}
      />

      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  )
}
