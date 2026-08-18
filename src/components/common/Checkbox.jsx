import { APP_COLORS } from '../../constants/text'

export function Checkbox({ label, checked, onChange, disabled = false, id }) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontWeight: 600,
        color: APP_COLORS.text,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
        style={{
          width: '1.2rem',
          height: '1.2rem',
          accentColor: APP_COLORS.primary,
        }}
      />
      {label}
    </label>
  )
}
