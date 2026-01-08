import styles from './Button.styles.module.css'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const variantClass = styles[variant]
  const sizeClass = styles[`size-${size}`]

  return (
    <button
      type={type}
      className={`${styles.btn} ${variantClass} ${sizeClass} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? '...' : children}
    </button>
  )
}
