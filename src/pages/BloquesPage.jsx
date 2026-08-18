import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { Select } from '../components/common/Select'
import { Title } from '../components/common/Title'
import { APP_COLORS, APP_TEXT } from '../constants/text'
import { TIPOS_BLOQUE } from '../constants/bloquesOptions'
import { rutaDetalleEscuela } from '../constants/routes'
import { bloquesService } from '../services/bloquesService'
import { formatearHoraCorta } from '../utils/horario'

const BLOQUES_TEXT = APP_TEXT.bloques

const crearFilaVacia = () => ({
  clave: crypto.randomUUID(),
  horaInicio: '',
  horaFin: '',
  tipoBloque: '',
})

const etiquetaTipoBloque = (value) => TIPOS_BLOQUE.find((tipo) => tipo.value === value)?.label ?? value

function BloquesPage() {
  const { id } = useParams()

  const [bloques, setBloques] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorListar, setErrorListar] = useState('')

  const [filas, setFilas] = useState([crearFilaVacia()])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorGuardar, setErrorGuardar] = useState('')
  const [exitoGuardar, setExitoGuardar] = useState('')

  const fetchBloques = async () => {
    setIsLoading(true)
    setErrorListar('')

    try {
      const respuesta = await bloquesService.listarBloques(id)
      setBloques(respuesta ?? [])
    } catch (error) {
      setErrorListar(BLOQUES_TEXT.mensajes.errorListar)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBloques()
  }, [id])

  const actualizarFila = (clave, campo) => (valor) => {
    setFilas((anteriores) => anteriores.map((fila) => (fila.clave === clave ? { ...fila, [campo]: valor } : fila)))
  }

  const agregarFila = () => {
    setFilas((anteriores) => [...anteriores, crearFilaVacia()])
  }

  const quitarFila = (clave) => {
    setFilas((anteriores) => anteriores.filter((fila) => fila.clave !== clave))
  }

  const handleGuardar = async (event) => {
    event.preventDefault()
    setErrorGuardar('')
    setExitoGuardar('')

    if (filas.length === 0) {
      setErrorGuardar(BLOQUES_TEXT.mensajes.sinFilas)
      return
    }

    const hayFilaIncompleta = filas.some((fila) => !fila.horaInicio || !fila.horaFin || !fila.tipoBloque)
    if (hayFilaIncompleta) {
      setErrorGuardar(BLOQUES_TEXT.mensajes.camposIncompletos)
      return
    }

    setIsSubmitting(true)

    const payload = filas.map((fila, index) => ({
      orden: index + 1,
      hora_inicio: fila.horaInicio,
      hora_fin: fila.horaFin,
      tipo_bloque: fila.tipoBloque,
    }))

    try {
      await bloquesService.crearBloques(id, payload)
      setExitoGuardar(BLOQUES_TEXT.mensajes.exitoGuardar)
      await fetchBloques()
    } catch (error) {
      setErrorGuardar(BLOQUES_TEXT.mensajes.errorGuardar)
    } finally {
      setIsSubmitting(false)
    }
  }

  const yaTieneBloques = !isLoading && !errorListar && bloques.length > 0
  const mostrarEditor = !isLoading && !errorListar && bloques.length === 0

  return (
    <main
      style={{
        minHeight: '100vh',
        background: APP_COLORS.background,
        padding: '2rem',
      }}
    >
      <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Link to={rutaDetalleEscuela(id)} style={{ color: APP_COLORS.primary, fontWeight: 600, textDecoration: 'none' }}>
          ← {BLOQUES_TEXT.volver}
        </Link>

        <div>
          <Title as="h1">{BLOQUES_TEXT.title}</Title>
          <p style={{ color: APP_COLORS.textMuted, marginTop: '0.5rem' }}>{BLOQUES_TEXT.description}</p>
        </div>

        {isLoading && <p style={{ color: APP_COLORS.textMuted }}>{BLOQUES_TEXT.mensajes.cargando}</p>}

        {!isLoading && errorListar && <p style={{ color: APP_COLORS.error }}>{errorListar}</p>}

        {yaTieneBloques && (
          <section
            style={{
              background: APP_COLORS.surface,
              border: `1px solid ${APP_COLORS.border}`,
              borderRadius: '18px',
              padding: '2rem',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={celdaEncabezado}>{BLOQUES_TEXT.tabla.orden}</th>
                    <th style={celdaEncabezado}>{BLOQUES_TEXT.tabla.horaInicio}</th>
                    <th style={celdaEncabezado}>{BLOQUES_TEXT.tabla.horaFin}</th>
                    <th style={celdaEncabezado}>{BLOQUES_TEXT.tabla.tipo}</th>
                  </tr>
                </thead>
                <tbody>
                  {bloques.map((bloque) => (
                    <tr key={bloque.id}>
                      <td style={celda}>{bloque.orden}</td>
                      <td style={celda}>{formatearHoraCorta(bloque.hora_inicio)}</td>
                      <td style={celda}>{formatearHoraCorta(bloque.hora_fin)}</td>
                      <td style={celda}>{etiquetaTipoBloque(bloque.tipo_bloque)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {mostrarEditor && (
          <section
            style={{
              background: APP_COLORS.surface,
              border: `1px solid ${APP_COLORS.border}`,
              borderRadius: '18px',
              padding: '2rem',
            }}
          >
            <Title as="h2">{BLOQUES_TEXT.editor.title}</Title>
            <p style={{ color: APP_COLORS.textMuted, marginTop: '0.5rem' }}>{BLOQUES_TEXT.editor.ayuda}</p>

            <form onSubmit={handleGuardar} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filas.map((fila, index) => (
                <div
                  key={fila.clave}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr 1fr 1fr auto',
                    gap: '1rem',
                    alignItems: 'end',
                    padding: '1rem',
                    borderRadius: '12px',
                    background: APP_COLORS.background,
                    border: `1px solid ${APP_COLORS.border}`,
                  }}
                >
                  <strong style={{ color: APP_COLORS.textMuted, paddingBottom: '0.85rem' }}>{index + 1}</strong>

                  <Input
                    type="time"
                    label={BLOQUES_TEXT.labels.horaInicio}
                    valor={fila.horaInicio}
                    onChange={actualizarFila(fila.clave, 'horaInicio')}
                    disabled={isSubmitting}
                  />

                  <Input
                    type="time"
                    label={BLOQUES_TEXT.labels.horaFin}
                    valor={fila.horaFin}
                    onChange={actualizarFila(fila.clave, 'horaFin')}
                    disabled={isSubmitting}
                  />

                  <Select
                    label={BLOQUES_TEXT.labels.tipo}
                    opciones={TIPOS_BLOQUE}
                    valor={fila.tipoBloque}
                    onChange={actualizarFila(fila.clave, 'tipoBloque')}
                    placeholder={BLOQUES_TEXT.selectPlaceholder}
                    disabled={isSubmitting}
                  />

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => quitarFila(fila.clave)}
                    disabled={isSubmitting}
                  >
                    {BLOQUES_TEXT.buttons.quitarFila}
                  </Button>
                </div>
              ))}

              <div>
                <Button type="button" variant="secondary" onClick={agregarFila} disabled={isSubmitting}>
                  {BLOQUES_TEXT.buttons.agregarFila}
                </Button>
              </div>

              {errorGuardar && <p style={{ color: APP_COLORS.error, margin: 0 }}>{errorGuardar}</p>}
              {exitoGuardar && <p style={{ color: APP_COLORS.success, margin: 0 }}>{exitoGuardar}</p>}

              <div>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? BLOQUES_TEXT.buttons.guardando : BLOQUES_TEXT.buttons.guardarDia}
                </Button>
              </div>
            </form>
          </section>
        )}
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

export default BloquesPage
