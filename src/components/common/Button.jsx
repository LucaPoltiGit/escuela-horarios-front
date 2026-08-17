import { APP_COLORS } from '../../constants/text'

const buttonStyles = {
  primary: {
    background: APP_COLORS.primary,
    borderColor: APP_COLORS.primary,
    color: '#ffffff',
  },
  secondary: {
    background: 'transparent',
    borderColor: APP_COLORS.border,
    color: APP_COLORS.text,
  },
}

export function Button({ children, variant = 'primary', onClick, type = 'button', disabled = false }) {
  const styles = buttonStyles[variant] || buttonStyles.primary

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '0.75rem 1.25rem',
        borderRadius: '10px',
        border: '1px solid',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease',
        ...styles,
      }}
    >
      {children}
    </button>
  )
}
