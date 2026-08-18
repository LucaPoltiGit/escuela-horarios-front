import { APP_COLORS } from '../../constants/text'

export function Select({ label, opciones, valor, onChange, placeholder, disabled = false, id }) {
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
      <select
        id={id}
        value={valor}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        style={{
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          border: `1px solid ${APP_COLORS.border}`,
          fontSize: '1rem',
          color: APP_COLORS.text,
          background: APP_COLORS.surface,
        }}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {opciones.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>
    </label>
  )
}
