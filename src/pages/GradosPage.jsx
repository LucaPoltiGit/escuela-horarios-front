import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { Checkbox } from '../components/common/Checkbox'
import { Input } from '../components/common/Input'
import { Select } from '../components/common/Select'
import { Title } from '../components/common/Title'
import { APP_COLORS, APP_TEXT } from '../constants/text'
import { DIAS_SEMANA } from '../constants/diasSemana'
import { rutaDetalleEscuela } from '../constants/routes'
import { gradosService } from '../services/gradosService'

const GRADOS_TEXT = APP_TEXT.grados

const crearFilaVacia = () => ({
  clave: crypto.randomUUID(),
  nombre: '',
  maestra: '',
  necesitaCobertura: false,
  diaCobertura: '',
})

const etiquetaDiaCobertura = (diaCobertura) =>
  DIAS_SEMANA.find((dia) => dia.value === diaCobertura)?.label ?? GRADOS_TEXT.sinCobertura

function GradosPage() {
  const { id } = useParams()

  const [grados, setGrados] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorListar, setErrorListar] = useState('')

  const [filas, setFilas] = useState([crearFilaVacia()])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorGuardar, setErrorGuardar] = useState('')
  const [exitoGuardar, setExitoGuardar] = useState('')

  const fetchGrados = useCallback(async () => {
    setIsLoading(true)
    setErrorListar('')

    try {
      const respuesta = await gradosService.listarGrados(id)
      setGrados(respuesta ?? [])
    } catch (error) {
      setErrorListar(GRADOS_TEXT.mensajes.errorListar)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchGrados()
  }, [fetchGrados])

  const actualizarFila = (clave, campo) => (valor) => {
    setFilas((anteriores) => anteriores.map((fila) => (fila.clave === clave ? { ...fila, [campo]: valor } : fila)))
  }

  const actualizarCobertura = (clave, necesitaCobertura) => {
    setFilas((anteriores) =>
      anteriores.map((fila) =>
        fila.clave === clave
          ? { ...fila, necesitaCobertura, diaCobertura: necesitaCobertura ? fila.diaCobertura : '' }
          : fila,
      ),
    )
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
      setErrorGuardar(GRADOS_TEXT.mensajes.sinFilas)
      return
    }

    const hayNombreFaltante = filas.some((fila) => !fila.nombre.trim())
    if (hayNombreFaltante) {
      setErrorGuardar(GRADOS_TEXT.mensajes.nombreRequerido)
      return
    }

    const hayCoberturaSinDia = filas.some((fila) => fila.necesitaCobertura && !fila.diaCobertura)
    if (hayCoberturaSinDia) {
      setErrorGuardar(GRADOS_TEXT.mensajes.diaCoberturaRequerido)
      return
    }

    setIsSubmitting(true)

    const payload = filas.map((fila) => ({
      nombre: fila.nombre.trim(),
      maestra: fila.maestra.trim() ? fila.maestra.trim() : null,
      dia_cobertura: fila.necesitaCobertura ? Number(fila.diaCobertura) : null,
    }))

    try {
      await gradosService.crearGrados(id, payload)
      setExitoGuardar(GRADOS_TEXT.mensajes.exitoGuardar)
      await fetchGrados()
    } catch (error) {
      setErrorGuardar(GRADOS_TEXT.mensajes.errorGuardar)
    } finally {
      setIsSubmitting(false)
    }
  }

  const yaTieneGrados = !isLoading && !errorListar && grados.length > 0
  const mostrarEditor = !isLoading && !errorListar && grados.length === 0

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
          ← {GRADOS_TEXT.volver}
        </Link>

        <div>
          <Title as="h1">{GRADOS_TEXT.title}</Title>
          <p style={{ color: APP_COLORS.textMuted, marginTop: '0.5rem' }}>{GRADOS_TEXT.description}</p>
          <p style={{ color: APP_COLORS.textMuted, marginTop: '0.5rem', fontSize: '0.9rem' }}>
            {GRADOS_TEXT.ayudaCobertura}
          </p>
        </div>

        {isLoading && <p style={{ color: APP_COLORS.textMuted }}>{GRADOS_TEXT.mensajes.cargando}</p>}

        {!isLoading && errorListar && <p style={{ color: APP_COLORS.error }}>{errorListar}</p>}

        {yaTieneGrados && (
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
                    <th style={celdaEncabezado}>{GRADOS_TEXT.tabla.nombre}</th>
                    <th style={celdaEncabezado}>{GRADOS_TEXT.tabla.maestra}</th>
                    <th style={celdaEncabezado}>{GRADOS_TEXT.tabla.cobertura}</th>
                  </tr>
                </thead>
                <tbody>
                  {grados.map((grado) => (
                    <tr key={grado.id}>
                      <td style={celda}>{grado.nombre}</td>
                      <td style={celda}>{grado.maestra ?? '—'}</td>
                      <td style={celda}>{etiquetaDiaCobertura(grado.dia_cobertura)}</td>
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
            <Title as="h2">{GRADOS_TEXT.editor.title}</Title>
            <p style={{ color: APP_COLORS.textMuted, marginTop: '0.5rem' }}>{GRADOS_TEXT.editor.ayuda}</p>

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
                    label={GRADOS_TEXT.labels.nombre}
                    valor={fila.nombre}
                    onChange={actualizarFila(fila.clave, 'nombre')}
                    placeholder={GRADOS_TEXT.placeholders.nombre}
                    disabled={isSubmitting}
                  />

                  <Input
                    label={GRADOS_TEXT.labels.maestra}
                    valor={fila.maestra}
                    onChange={actualizarFila(fila.clave, 'maestra')}
                    placeholder={GRADOS_TEXT.placeholders.maestra}
                    disabled={isSubmitting}
                  />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <Checkbox
                      id={`grado-cobertura-${fila.clave}`}
                      label={GRADOS_TEXT.labels.necesitaCobertura}
                      checked={fila.necesitaCobertura}
                      onChange={(checked) => actualizarCobertura(fila.clave, checked)}
                      disabled={isSubmitting}
                    />

                    {fila.necesitaCobertura && (
                      <Select
                        label={GRADOS_TEXT.labels.diaCobertura}
                        opciones={DIAS_SEMANA}
                        valor={fila.diaCobertura}
                        onChange={actualizarFila(fila.clave, 'diaCobertura')}
                        placeholder={GRADOS_TEXT.selectPlaceholder}
                        disabled={isSubmitting}
                      />
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => quitarFila(fila.clave)}
                    disabled={isSubmitting}
                  >
                    {GRADOS_TEXT.buttons.quitarFila}
                  </Button>
                </div>
              ))}

              <div>
                <Button type="button" variant="secondary" onClick={agregarFila} disabled={isSubmitting}>
                  {GRADOS_TEXT.buttons.agregarFila}
                </Button>
              </div>

              {errorGuardar && <p style={{ color: APP_COLORS.error, margin: 0 }}>{errorGuardar}</p>}
              {exitoGuardar && <p style={{ color: APP_COLORS.success, margin: 0 }}>{exitoGuardar}</p>}

              <div>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? GRADOS_TEXT.buttons.guardando : GRADOS_TEXT.buttons.guardarGrados}
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

export default GradosPage
