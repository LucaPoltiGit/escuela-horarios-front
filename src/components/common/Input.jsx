import { APP_COLORS } from '../../constants/text'

export function Input({ label, valor, onChange, placeholder, type = 'text', disabled = false, id, min }) {
  return (
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        fontWeight: 600,
        color: APP_COLORS.text,
      }}
    >
      {label}
      <input
        id={id}
        type={type}
        value={valor}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        style={{
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          border: `1px solid ${APP_COLORS.border}`,
          fontSize: '1rem',
          color: APP_COLORS.text,
          background: APP_COLORS.surface,
        }}
      />
    </label>
  )
}
