import { useEffect, useState } from 'react'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { Select } from '../components/common/Select'
import { Title } from '../components/common/Title'
import { APP_COLORS, APP_TEXT } from '../constants/text'
import { TIPOS_ESCUELA, TURNOS_ESCUELA } from '../constants/escuelasOptions'
import { escuelasService } from '../services/escuelasService'

const ESCUELAS_TEXT = APP_TEXT.escuelas

const valoresIniciales = { nombre: '', tipo: '', turno: '' }

function EscuelasPage() {
  const [escuelas, setEscuelas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorListar, setErrorListar] = useState('')

  const [valores, setValores] = useState(valoresIniciales)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorCrear, setErrorCrear] = useState('')
  const [exitoCrear, setExitoCrear] = useState('')

  const fetchEscuelas = async () => {
    setIsLoading(true)
    setErrorListar('')

    try {
      const respuesta = await escuelasService.listarEscuelas()
      setEscuelas(respuesta ?? [])
    } catch (error) {
      setErrorListar(ESCUELAS_TEXT.mensajes.errorListar)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEscuelas()
  }, [])

  const actualizarCampo = (campo) => (valor) => {
    setValores((anteriores) => ({ ...anteriores, [campo]: valor }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorCrear('')
    setExitoCrear('')

    if (!valores.nombre || !valores.tipo || !valores.turno) {
      setErrorCrear(ESCUELAS_TEXT.mensajes.camposRequeridos)
      return
    }

    setIsSubmitting(true)

    try {
      await escuelasService.crearEscuela(valores)
      setValores(valoresIniciales)
      setExitoCrear(ESCUELAS_TEXT.mensajes.exitoCrear)
      await fetchEscuelas()
    } catch (error) {
      setErrorCrear(ESCUELAS_TEXT.mensajes.errorCrear)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: APP_COLORS.background,
        padding: '2rem',
      }}
    >
      <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <Title as="h1">{ESCUELAS_TEXT.title}</Title>
          <p style={{ color: APP_COLORS.textMuted, marginTop: '0.5rem' }}>{ESCUELAS_TEXT.description}</p>
        </div>

        <section
          style={{
            background: APP_COLORS.surface,
            border: `1px solid ${APP_COLORS.border}`,
            borderRadius: '18px',
            padding: '2rem',
          }}
        >
          <Title as="h2">{ESCUELAS_TEXT.listTitle}</Title>

          {isLoading && (
            <p style={{ color: APP_COLORS.textMuted, marginTop: '1rem' }}>{ESCUELAS_TEXT.mensajes.cargando}</p>
          )}

          {!isLoading && errorListar && (
            <p style={{ color: APP_COLORS.error, marginTop: '1rem' }}>{errorListar}</p>
          )}

          {!isLoading && !errorListar && escuelas.length === 0 && (
            <p style={{ color: APP_COLORS.textMuted, marginTop: '1rem' }}>{ESCUELAS_TEXT.mensajes.vacio}</p>
          )}

          {!isLoading && !errorListar && escuelas.length > 0 && (
            <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={celdaEncabezado}>{ESCUELAS_TEXT.tabla.nombre}</th>
                    <th style={celdaEncabezado}>{ESCUELAS_TEXT.tabla.tipo}</th>
                    <th style={celdaEncabezado}>{ESCUELAS_TEXT.tabla.turno}</th>
                  </tr>
                </thead>
                <tbody>
                  {escuelas.map((escuela) => (
                    <tr key={escuela.id}>
                      <td style={celda}>{escuela.nombre}</td>
                      <td style={celda}>{escuela.tipo}</td>
                      <td style={celda}>{escuela.turno}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section
          style={{
            background: APP_COLORS.surface,
            border: `1px solid ${APP_COLORS.border}`,
            borderRadius: '18px',
            padding: '2rem',
          }}
        >
          <Title as="h2">{ESCUELAS_TEXT.formTitle}</Title>

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}
          >
            <Input
              id="escuela-nombre"
              label={ESCUELAS_TEXT.labels.nombre}
              valor={valores.nombre}
              onChange={actualizarCampo('nombre')}
              placeholder={ESCUELAS_TEXT.placeholders.nombre}
              disabled={isSubmitting}
            />

            <Select
              id="escuela-tipo"
              label={ESCUELAS_TEXT.labels.tipo}
              opciones={TIPOS_ESCUELA}
              valor={valores.tipo}
              onChange={actualizarCampo('tipo')}
              placeholder={ESCUELAS_TEXT.selectPlaceholder}
              disabled={isSubmitting}
            />

            <Select
              id="escuela-turno"
              label={ESCUELAS_TEXT.labels.turno}
              opciones={TURNOS_ESCUELA}
              valor={valores.turno}
              onChange={actualizarCampo('turno')}
              placeholder={ESCUELAS_TEXT.selectPlaceholder}
              disabled={isSubmitting}
            />

            {errorCrear && <p style={{ color: APP_COLORS.error, margin: 0 }}>{errorCrear}</p>}
            {exitoCrear && <p style={{ color: APP_COLORS.success, margin: 0 }}>{exitoCrear}</p>}

            <div>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? ESCUELAS_TEXT.buttons.creando : ESCUELAS_TEXT.buttons.crear}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}

const celdaEncabezado = {
  textAlign: 'left',
  padding: '0.75rem',
  borderBottom: `2px solid ${APP_COLORS.border}`,
  color: APP_COLORS.textMuted,
  fontSize: '0.9rem',
}

const celda = {
  padding: '0.75rem',
  borderBottom: `1px solid ${APP_COLORS.border}`,
  color: APP_COLORS.text,
}

export default EscuelasPage
