import { NavLink } from 'react-router-dom'
import { APP_COLORS, APP_TEXT } from '../../constants/text'
import { ROUTES } from '../../constants/routes'

const linkStyle = ({ isActive }) => ({
  padding: '0.6rem 1rem',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 600,
  color: isActive ? '#ffffff' : APP_COLORS.text,
  background: isActive ? APP_COLORS.primary : 'transparent',
})

export function NavBar() {
  return (
    <nav
      style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '1rem 2rem',
        background: APP_COLORS.surface,
        borderBottom: `1px solid ${APP_COLORS.border}`,
      }}
    >
      <NavLink to={ROUTES.salud} end style={linkStyle}>
        {APP_TEXT.nav.salud}
      </NavLink>
      <NavLink to={ROUTES.escuelas} style={linkStyle}>
        {APP_TEXT.nav.escuelas}
      </NavLink>
    </nav>
  )
}
