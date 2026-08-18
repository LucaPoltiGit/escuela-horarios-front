import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { Title } from '../components/common/Title'
import { APP_COLORS, APP_TEXT } from '../constants/text'
import { rutaDetalleEscuela, rutaGradosEscuela } from '../constants/routes'
import { gradosService } from '../services/gradosService'
import { materiasService } from '../services/materiasService'

const MATERIAS_TEXT = APP_TEXT.materias

const crearFilaVacia = () => ({
  clave: crypto.randomUUID(),
  nombre: '',
})

const claveCelda = (gradoId, materiaId) => `${gradoId}:${materiaId}`

function MateriasPage() {
  const { id } = useParams()

  const [materias, setMaterias] = useState([])
  const [grados, setGrados] = useState([])
  const [asignaciones, setAsignaciones] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')

  const [filasMaterias, setFilasMaterias] = useState([crearFilaVacia()])
  const [isSubmittingMaterias, setIsSubmittingMaterias] = useState(false)
  const [errorMaterias, setErrorMaterias] = useState('')
  const [exitoMaterias, setExitoMaterias] = useState('')

  const [valoresMatriz, setValoresMatriz] = useState({})
  const [isSubmittingMatriz, setIsSubmittingMatriz] = useState(false)
  const [errorMatriz, setErrorMatriz] = useState('')
  const [exitoMatriz, setExitoMatriz] = useState('')

  const fetchDatos = useCallback(async () => {
    setIsLoading(true)
    setErrorCarga('')

    try {
      const [materiasResp, gradosResp, asignacionesResp] = await Promise.all([
        materiasService.listarMaterias(id),
        gradosService.listarGrados(id),
        materiasService.listarAsignaciones(id),
      ])
      setMaterias(materiasResp ?? [])
      setGrados(gradosResp ?? [])
      setAsignaciones(asignacionesResp ?? [])
      setValoresMatriz({})
    } catch (error) {
      setErrorCarga(MATERIAS_TEXT.mensajes.errorCargar)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchDatos()
  }, [fetchDatos])

  const obtenerAsignacion = (gradoId, materiaId) =>
    asignaciones.find((asignacion) => asignacion.grado_id === gradoId && asignacion.materia_id === materiaId)

  // --- Catálogo de materias ---

  const actualizarFilaMateria = (clave) => (valor) => {
    setFilasMaterias((anteriores) => anteriores.map((fila) => (fila.clave === clave ? { ...fila, nombre: valor } : fila)))
  }

  const agregarFilaMateria = () => {
    setFilasMaterias((anteriores) => [...anteriores, crearFilaVacia()])
  }

  const quitarFilaMateria = (clave) => {
    setFilasMaterias((anteriores) => anteriores.filter((fila) => fila.clave !== clave))
  }

  const handleGuardarMaterias = async (event) => {
    event.preventDefault()
    setErrorMaterias('')
    setExitoMaterias('')

    if (filasMaterias.length === 0) {
      setErrorMaterias(MATERIAS_TEXT.mensajes.sinFilas)
      return
    }

    const hayNombreFaltante = filasMaterias.some((fila) => !fila.nombre.trim())
    if (hayNombreFaltante) {
      setErrorMaterias(MATERIAS_TEXT.mensajes.nombreRequerido)
      return
    }

    setIsSubmittingMaterias(true)

    const payload = filasMaterias.map((fila) => ({ nombre: fila.nombre.trim() }))

    try {
      await materiasService.crearMaterias(id, payload)
      setExitoMaterias(MATERIAS_TEXT.mensajes.exitoGuardarMaterias)
      setFilasMaterias([crearFilaVacia()])
      await fetchDatos()
    } catch (error) {
      setErrorMaterias(MATERIAS_TEXT.mensajes.errorGuardarMaterias)
    } finally {
      setIsSubmittingMaterias(false)
    }
  }

  // --- Matriz de módulos por grado ---

  const actualizarCelda = (gradoId, materiaId) => (valor) => {
    setValoresMatriz((anteriores) => ({ ...anteriores, [claveCelda(gradoId, materiaId)]: valor }))
  }

  const handleGuardarMatriz = async (event) => {
    event.preventDefault()
    setErrorMatriz('')
    setExitoMatriz('')

    const hayValorNegativo = Object.values(valoresMatriz).some((valor) => valor !== '' && Number(valor) < 0)
    if (hayValorNegativo) {
      setErrorMatriz(MATERIAS_TEXT.mensajes.valorNegativo)
      return
    }

    const payload = []
    grados.forEach((grado) => {
      materias.forEach((materia) => {
        if (obtenerAsignacion(grado.id, materia.id)) return
        const valor = valoresMatriz[claveCelda(grado.id, materia.id)]
        const modulos = Number(valor)
        if (valor && modulos > 0) {
          payload.push({ grado_id: grado.id, materia_id: materia.id, modulos_semanales: modulos })
        }
      })
    })

    if (payload.length === 0) {
      setErrorMatriz(MATERIAS_TEXT.mensajes.sinCambiosModulos)
      return
    }

    setIsSubmittingMatriz(true)

    try {
      await materiasService.crearAsignaciones(id, payload)
      setExitoMatriz(MATERIAS_TEXT.mensajes.exitoGuardarModulos)
      await fetchDatos()
    } catch (error) {
      setErrorMatriz(MATERIAS_TEXT.mensajes.errorGuardarModulos)
    } finally {
      setIsSubmittingMatriz(false)
    }
  }

  const mostrarMatriz = !isLoading && !errorCarga && materias.length > 0 && grados.length > 0

  return (
    <main
      style={{
        minHeight: '100vh',
        background: APP_COLORS.background,
        padding: '2rem',
      }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Link to={rutaDetalleEscuela(id)} style={{ color: APP_COLORS.primary, fontWeight: 600, textDecoration: 'none' }}>
          ← {MATERIAS_TEXT.volver}
        </Link>

        <div>
          <Title as="h1">{MATERIAS_TEXT.title}</Title>
          <p style={{ color: APP_COLORS.textMuted, marginTop: '0.5rem' }}>{MATERIAS_TEXT.description}</p>
        </div>

        {isLoading && <p style={{ color: APP_COLORS.textMuted }}>{MATERIAS_TEXT.mensajes.cargando}</p>}

        {!isLoading && errorCarga && <p style={{ color: APP_COLORS.error }}>{errorCarga}</p>}

        {!isLoading && !errorCarga && (
          <>
            <section
              style={{
                background: APP_COLORS.surface,
                border: `1px solid ${APP_COLORS.border}`,
                borderRadius: '18px',
                padding: '2rem',
              }}
            >
              <Title as="h2">{MATERIAS_TEXT.catalogo.title}</Title>

              {materias.length === 0 ? (
                <p style={{ color: APP_COLORS.textMuted, marginTop: '1rem' }}>{MATERIAS_TEXT.catalogo.vacio}</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '1rem' }}>
                  {materias.map((materia) => (
                    <span
                      key={materia.id}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '999px',
                        background: APP_COLORS.background,
                        border: `1px solid ${APP_COLORS.border}`,
                        color: APP_COLORS.text,
                        fontWeight: 600,
                      }}
                    >
                      {materia.nombre}
                    </span>
                  ))}
                </div>
              )}

              <Title as="h3" align="left">
                {MATERIAS_TEXT.catalogo.editorTitle}
              </Title>
              <p style={{ color: APP_COLORS.textMuted, marginTop: '0.25rem' }}>{MATERIAS_TEXT.catalogo.editorAyuda}</p>

              <form
                onSubmit={handleGuardarMaterias}
                style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                {filasMaterias.map((fila) => (
                  <div key={fila.clave} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'end' }}>
                    <Input
                      label={MATERIAS_TEXT.labels.nombreMateria}
                      valor={fila.nombre}
                      onChange={actualizarFilaMateria(fila.clave)}
                      placeholder={MATERIAS_TEXT.placeholders.nombreMateria}
                      disabled={isSubmittingMaterias}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => quitarFilaMateria(fila.clave)}
                      disabled={isSubmittingMaterias}
                    >
                      {MATERIAS_TEXT.buttons.quitarFila}
                    </Button>
                  </div>
                ))}

                <div>
                  <Button type="button" variant="secondary" onClick={agregarFilaMateria} disabled={isSubmittingMaterias}>
                    {MATERIAS_TEXT.buttons.agregarFila}
                  </Button>
                </div>

                {errorMaterias && <p style={{ color: APP_COLORS.error, margin: 0 }}>{errorMaterias}</p>}
                {exitoMaterias && <p style={{ color: APP_COLORS.success, margin: 0 }}>{exitoMaterias}</p>}

                <div>
                  <Button type="submit" variant="primary" disabled={isSubmittingMaterias}>
                    {isSubmittingMaterias ? MATERIAS_TEXT.buttons.guardando : MATERIAS_TEXT.buttons.guardarMaterias}
                  </Button>
                </div>
              </form>
            </section>

            <section
              style={{
                background: APP_COLORS.surface,
                border: `1px solid ${APP_COLORS.border}`,
                borderRadius: '18px',
                padding: '2rem',
              }}
            >
              <Title as="h2">{MATERIAS_TEXT.matriz.title}</Title>

              {materias.length === 0 && (
                <p style={{ color: APP_COLORS.textMuted, marginTop: '1rem' }}>{MATERIAS_TEXT.matriz.faltanMaterias}</p>
              )}

              {materias.length > 0 && grados.length === 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ color: APP_COLORS.textMuted, margin: 0 }}>{MATERIAS_TEXT.matriz.faltanGrados}</p>
                  <Link
                    to={rutaGradosEscuela(id)}
                    style={{ color: APP_COLORS.primary, fontWeight: 600, textDecoration: 'none' }}
                  >
                    {MATERIAS_TEXT.matriz.irAGrados} →
                  </Link>
                </div>
              )}

              {mostrarMatriz && (
                <form onSubmit={handleGuardarMatriz} style={{ marginTop: '1rem' }}>
                  <p style={{ color: APP_COLORS.textMuted }}>{MATERIAS_TEXT.matriz.ayuda}</p>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={celdaEncabezado}>{MATERIAS_TEXT.matriz.columnaGrado}</th>
                          {materias.map((materia) => (
                            <th key={materia.id} style={celdaEncabezado}>
                              {materia.nombre}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {grados.map((grado) => (
                          <tr key={grado.id}>
                            <td style={{ ...celda, fontWeight: 600 }}>{grado.nombre}</td>
                            {materias.map((materia) => {
                              const existente = obtenerAsignacion(grado.id, materia.id)
                              return (
                                <td key={materia.id} style={celda}>
                                  {existente ? (
                                    <input
                                      type="number"
                                      value={existente.modulos_semanales}
                                      disabled
                                      style={celdaInputEstilo}
                                    />
                                  ) : (
                                    <input
                                      type="number"
                                      min="0"
                                      value={valoresMatriz[claveCelda(grado.id, materia.id)] ?? ''}
                                      onChange={(event) => actualizarCelda(grado.id, materia.id)(event.target.value)}
                                      disabled={isSubmittingMatriz}
                                      style={celdaInputEstilo}
                                    />
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {errorMatriz && <p style={{ color: APP_COLORS.error, margin: '1rem 0 0' }}>{errorMatriz}</p>}
                  {exitoMatriz && <p style={{ color: APP_COLORS.success, margin: '1rem 0 0' }}>{exitoMatriz}</p>}

                  <div style={{ marginTop: '1rem' }}>
                    <Button type="submit" variant="primary" disabled={isSubmittingMatriz}>
                      {isSubmittingMatriz ? MATERIAS_TEXT.buttons.guardando : MATERIAS_TEXT.buttons.guardarModulos}
                    </Button>
                  </div>
                </form>
              )}
            </section>
          </>
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

const celdaInputEstilo = {
  width: '4.5rem',
  padding: '0.5rem',
  borderRadius: '8px',
  border: `1px solid ${APP_COLORS.border}`,
  fontSize: '1rem',
  color: APP_COLORS.text,
  background: APP_COLORS.surface,
}

export default MateriasPage
