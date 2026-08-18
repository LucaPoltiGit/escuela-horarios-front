import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Title } from '../components/common/Title'
import { APP_COLORS, APP_TEXT } from '../constants/text'
import {
  ROUTES,
  rutaBloquesEscuela,
  rutaGradosEscuela,
  rutaMateriasEscuela,
  rutaDocentesEscuela,
  rutaGenerarHorarioEscuela,
} from '../constants/routes'
import { escuelasService } from '../services/escuelasService'

const ESCUELAS_TEXT = APP_TEXT.escuelas

function EscuelaDetallePage() {
  const { id } = useParams()
  const [escuela, setEscuela] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEscuela = async () => {
      setIsLoading(true)
      setError('')

      try {
        const respuesta = await escuelasService.obtenerEscuela(id)
        if (!respuesta) {
          setError(ESCUELAS_TEXT.detalle.noEncontrada)
          setEscuela(null)
          return
        }
        setEscuela(respuesta)
      } catch (fetchError) {
        setError(ESCUELAS_TEXT.detalle.errorCargar)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEscuela()
  }, [id])

  const secciones = [
    { label: ESCUELAS_TEXT.secciones.bloques, ruta: rutaBloquesEscuela(id) },
    { label: ESCUELAS_TEXT.secciones.grados, ruta: rutaGradosEscuela(id) },
    { label: ESCUELAS_TEXT.secciones.materias, ruta: rutaMateriasEscuela(id) },
    { label: ESCUELAS_TEXT.secciones.docentes, ruta: rutaDocentesEscuela(id) },
    { label: ESCUELAS_TEXT.secciones.generarHorario, ruta: rutaGenerarHorarioEscuela(id) },
  ]

  return (
    <main
      style={{
        minHeight: '100vh',
        background: APP_COLORS.background,
        padding: '2rem',
      }}
    >
      <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Link
          to={ROUTES.escuelas}
          style={{ color: APP_COLORS.primary, fontWeight: 600, textDecoration: 'none' }}
        >
          ← {ESCUELAS_TEXT.detalle.volver}
        </Link>

        {isLoading && <p style={{ color: APP_COLORS.textMuted }}>{ESCUELAS_TEXT.detalle.cargando}</p>}

        {!isLoading && error && <p style={{ color: APP_COLORS.error }}>{error}</p>}

        {!isLoading && !error && escuela && (
          <>
            <section
              style={{
                background: APP_COLORS.surface,
                border: `1px solid ${APP_COLORS.border}`,
                borderRadius: '18px',
                padding: '2rem',
              }}
            >
              <Title as="h1">{escuela.nombre}</Title>
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ margin: 0, color: APP_COLORS.textMuted }}>
                  <strong style={{ color: APP_COLORS.text }}>{ESCUELAS_TEXT.detalle.labels.tipo}:</strong>{' '}
                  {escuela.tipo}
                </p>
                <p style={{ margin: 0, color: APP_COLORS.textMuted }}>
                  <strong style={{ color: APP_COLORS.text }}>{ESCUELAS_TEXT.detalle.labels.turno}:</strong>{' '}
                  {escuela.turno}
                </p>
              </div>
            </section>

            <section
              style={{
                background: APP_COLORS.surface,
                border: `1px solid ${APP_COLORS.border}`,
                borderRadius: '18px',
                padding: '2rem',
              }}
            >
              <Title as="h2">{ESCUELAS_TEXT.detalle.seccionesTitle}</Title>
              <div
                style={{
                  marginTop: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '1rem',
                }}
              >
                {secciones.map((seccion) => (
                  <Link
                    key={seccion.ruta}
                    to={seccion.ruta}
                    style={{
                      display: 'block',
                      padding: '1.25rem',
                      borderRadius: '12px',
                      border: `1px solid ${APP_COLORS.border}`,
                      background: APP_COLORS.background,
                      color: APP_COLORS.text,
                      fontWeight: 600,
                      textDecoration: 'none',
                      textAlign: 'center',
                    }}
                  >
                    {seccion.label}
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  )
}

export default EscuelaDetallePage
