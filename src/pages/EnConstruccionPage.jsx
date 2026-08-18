import { Link, useParams } from 'react-router-dom'
import { Title } from '../components/common/Title'
import { APP_COLORS, APP_TEXT } from '../constants/text'
import { rutaDetalleEscuela } from '../constants/routes'

const TEXT = APP_TEXT.enConstruccion

function EnConstruccionPage({ nombreSeccion }) {
  const { id } = useParams()

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: APP_COLORS.background,
        padding: '2rem',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: '560px',
          background: APP_COLORS.surface,
          border: `1px solid ${APP_COLORS.border}`,
          borderRadius: '18px',
          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <Title as="h1" align="center">
          {nombreSeccion ?? TEXT.title}
        </Title>
        <p style={{ color: APP_COLORS.textMuted, marginTop: '1rem', lineHeight: 1.6 }}>{TEXT.description}</p>

        <Link
          to={rutaDetalleEscuela(id)}
          style={{
            display: 'inline-block',
            marginTop: '1.5rem',
            color: APP_COLORS.primary,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          ← {TEXT.volver}
        </Link>
      </section>
    </main>
  )
}

export default EnConstruccionPage
