import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { Checkbox } from '../components/common/Checkbox'
import { Input } from '../components/common/Input'
import { Select } from '../components/common/Select'
import { Title } from '../components/common/Title'
import { APP_COLORS, APP_TEXT } from '../constants/text'
import { DIAS_SEMANA } from '../constants/diasSemana'
import { rutaBloquesEscuela, rutaDetalleEscuela, rutaMateriasEscuela } from '../constants/routes'
import { bloquesService } from '../services/bloquesService'
import { docentesService } from '../services/docentesService'
import { materiasService } from '../services/materiasService'
import { formatearHoraCorta } from '../utils/horario'

const DOCENTES_TEXT = APP_TEXT.docentes

const crearFilaVacia = () => ({
  clave: crypto.randomUUID(),
  nombre: '',
  materiaId: '',
  cargo: '',
})

const claveCelda = (diaSemana, bloqueId) => `${diaSemana}:${bloqueId}`

function DocentesPage() {
  const { id } = useParams()

  const [materias, setMaterias] = useState([])
  const [bloques, setBloques] = useState([])
  const [docentes, setDocentes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')

  const [filasDocentes, setFilasDocentes] = useState([crearFilaVacia()])
  const [isSubmittingDocentes, setIsSubmittingDocentes] = useState(false)
  const [errorDocentes, setErrorDocentes] = useState('')
  const [exitoDocentes, setExitoDocentes] = useState('')

  const [docenteSeleccionadoId, setDocenteSeleccionadoId] = useState('')
  const [disponibilidad, setDisponibilidad] = useState([])
  const [isLoadingDisponibilidad, setIsLoadingDisponibilidad] = useState(false)
  const [errorDisponibilidad, setErrorDisponibilidad] = useState('')
  const [celdasNuevas, setCeldasNuevas] = useState({})
  const [isSubmittingDisponibilidad, setIsSubmittingDisponibilidad] = useState(false)
  const [errorGuardarDisponibilidad, setErrorGuardarDisponibilidad] = useState('')
  const [exitoGuardarDisponibilidad, setExitoGuardarDisponibilidad] = useState('')

  const fetchDatos = useCallback(async () => {
    setIsLoading(true)
    setErrorCarga('')

    try {
      const [materiasResp, bloquesResp, docentesResp] = await Promise.all([
        materiasService.listarMaterias(id),
        bloquesService.listarBloques(id),
        docentesService.listarDocentes(id),
      ])
      setMaterias(materiasResp ?? [])
      setBloques(bloquesResp ?? [])
      setDocentes(docentesResp ?? [])
    } catch (error) {
      setErrorCarga(DOCENTES_TEXT.mensajes.errorCargar)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchDatos()
  }, [fetchDatos])

  const fetchDisponibilidad = useCallback(async () => {
    if (!docenteSeleccionadoId) return

    setIsLoadingDisponibilidad(true)
    setErrorDisponibilidad('')
    setCeldasNuevas({})

    try {
      const respuesta = await docentesService.listarDisponibilidad(id, docenteSeleccionadoId)
      setDisponibilidad(respuesta ?? [])
    } catch (error) {
      setErrorDisponibilidad(DOCENTES_TEXT.mensajes.errorCargarDisponibilidad)
    } finally {
      setIsLoadingDisponibilidad(false)
    }
  }, [id, docenteSeleccionadoId])

  useEffect(() => {
    fetchDisponibilidad()
  }, [fetchDisponibilidad])

  const nombreMateria = (materiaId) => materias.find((materia) => materia.id === materiaId)?.nombre ?? '—'

  // --- Datos de docentes ---

  const actualizarFilaDocente = (clave, campo) => (valor) => {
    setFilasDocentes((anteriores) => anteriores.map((fila) => (fila.clave === clave ? { ...fila, [campo]: valor } : fila)))
  }

  const agregarFilaDocente = () => {
    setFilasDocentes((anteriores) => [...anteriores, crearFilaVacia()])
  }

  const quitarFilaDocente = (clave) => {
    setFilasDocentes((anteriores) => anteriores.filter((fila) => fila.clave !== clave))
  }

  const handleGuardarDocentes = async (event) => {
    event.preventDefault()
    setErrorDocentes('')
    setExitoDocentes('')

    if (filasDocentes.length === 0) {
      setErrorDocentes(DOCENTES_TEXT.mensajes.sinFilas)
      return
    }

    const hayFilaIncompleta = filasDocentes.some((fila) => !fila.nombre.trim() || !fila.materiaId || fila.cargo === '')
    if (hayFilaIncompleta) {
      setErrorDocentes(DOCENTES_TEXT.mensajes.camposIncompletos)
      return
    }

    const hayCargoInvalido = filasDocentes.some((fila) => Number(fila.cargo) < 0)
    if (hayCargoInvalido) {
      setErrorDocentes(DOCENTES_TEXT.mensajes.cargoInvalido)
      return
    }

    setIsSubmittingDocentes(true)

    const payload = filasDocentes.map((fila) => ({
      nombre: fila.nombre.trim(),
      materia_id: Number(fila.materiaId),
      cargo_modulos: Number(fila.cargo),
    }))

    try {
      await docentesService.crearDocentes(id, payload)
      setExitoDocentes(DOCENTES_TEXT.mensajes.exitoGuardarDocentes)
      setFilasDocentes([crearFilaVacia()])
      await fetchDatos()
    } catch (error) {
      setErrorDocentes(DOCENTES_TEXT.mensajes.errorGuardarDocentes)
    } finally {
      setIsSubmittingDocentes(false)
    }
  }

  // --- Disponibilidad ---

  const bloquesModulo = bloques.filter((bloque) => bloque.tipo_bloque === 'modulo')

  const estaDisponible = (diaSemana, bloqueId) =>
    disponibilidad.some((franja) => franja.dia_semana === diaSemana && franja.bloque_id === bloqueId)

  const alternarCelda = (diaSemana, bloqueId) => {
    const clave = claveCelda(diaSemana, bloqueId)
    setCeldasNuevas((anteriores) => ({ ...anteriores, [clave]: !anteriores[clave] }))
  }

  const handleGuardarDisponibilidad = async (event) => {
    event.preventDefault()
    setErrorGuardarDisponibilidad('')
    setExitoGuardarDisponibilidad('')

    const payload = Object.entries(celdasNuevas)
      .filter(([, tildado]) => tildado)
      .map(([clave]) => {
        const [diaSemana, bloqueId] = clave.split(':')
        return { dia_semana: Number(diaSemana), bloque_id: Number(bloqueId) }
      })

    if (payload.length === 0) {
      setErrorGuardarDisponibilidad(DOCENTES_TEXT.mensajes.sinCambiosDisponibilidad)
      return
    }

    setIsSubmittingDisponibilidad(true)

    try {
      await docentesService.guardarDisponibilidad(id, docenteSeleccionadoId, payload)
      setExitoGuardarDisponibilidad(DOCENTES_TEXT.mensajes.exitoGuardarDisponibilidad)
      await fetchDisponibilidad()
    } catch (error) {
      setErrorGuardarDisponibilidad(DOCENTES_TEXT.mensajes.errorGuardarDisponibilidad)
    } finally {
      setIsSubmittingDisponibilidad(false)
    }
  }

  const opcionesMaterias = materias.map((materia) => ({ value: String(materia.id), label: materia.nombre }))
  const opcionesDocentes = docentes.map((docente) => ({ value: String(docente.id), label: docente.nombre }))

  const mostrarDisponibilidad = !isLoading && !errorCarga && docentes.length > 0 && bloquesModulo.length > 0

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
          ← {DOCENTES_TEXT.volver}
        </Link>

        <div>
          <Title as="h1">{DOCENTES_TEXT.title}</Title>
          <p style={{ color: APP_COLORS.textMuted, marginTop: '0.5rem' }}>{DOCENTES_TEXT.description}</p>
        </div>

        {isLoading && <p style={{ color: APP_COLORS.textMuted }}>{DOCENTES_TEXT.mensajes.cargando}</p>}

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
              <Title as="h2">{DOCENTES_TEXT.datos.title}</Title>

              {materias.length === 0 ? (
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ color: APP_COLORS.textMuted, margin: 0 }}>{DOCENTES_TEXT.datos.faltanMaterias}</p>
                  <Link
                    to={rutaMateriasEscuela(id)}
                    style={{ color: APP_COLORS.primary, fontWeight: 600, textDecoration: 'none' }}
                  >
                    {DOCENTES_TEXT.datos.irAMaterias} →
                  </Link>
                </div>
              ) : (
                <>
                  {docentes.length === 0 ? (
                    <p style={{ color: APP_COLORS.textMuted, marginTop: '1rem' }}>{DOCENTES_TEXT.datos.vacio}</p>
                  ) : (
                    <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={celdaEncabezado}>{DOCENTES_TEXT.tabla.nombre}</th>
                            <th style={celdaEncabezado}>{DOCENTES_TEXT.tabla.materia}</th>
                            <th style={celdaEncabezado}>{DOCENTES_TEXT.tabla.cargo}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {docentes.map((docente) => (
                            <tr key={docente.id}>
                              <td style={celda}>{docente.nombre}</td>
                              <td style={celda}>{nombreMateria(docente.materia_id)}</td>
                              <td style={celda}>{docente.cargo_modulos}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <Title as="h3" align="left">
                    {DOCENTES_TEXT.datos.editorTitle}
                  </Title>
                  <p style={{ color: APP_COLORS.textMuted, marginTop: '0.25rem' }}>{DOCENTES_TEXT.datos.editorAyuda}</p>

                  <form
                    onSubmit={handleGuardarDocentes}
                    style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                  >
                    {filasDocentes.map((fila) => (
                      <div
                        key={fila.clave}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr auto',
                          gap: '1rem',
                          alignItems: 'end',
                          padding: '1rem',
                          borderRadius: '12px',
                          background: APP_COLORS.background,
                          border: `1px solid ${APP_COLORS.border}`,
                        }}
                      >
                        <Input
                          label={DOCENTES_TEXT.labels.nombre}
                          valor={fila.nombre}
                          onChange={actualizarFilaDocente(fila.clave, 'nombre')}
                          placeholder={DOCENTES_TEXT.placeholders.nombre}
                          disabled={isSubmittingDocentes}
                        />

                        <Select
                          label={DOCENTES_TEXT.labels.materia}
                          opciones={opcionesMaterias}
                          valor={fila.materiaId}
                          onChange={actualizarFilaDocente(fila.clave, 'materiaId')}
                          placeholder={DOCENTES_TEXT.selectPlaceholder}
                          disabled={isSubmittingDocentes}
                        />

                        <Input
                          type="number"
                          min="0"
                          label={DOCENTES_TEXT.labels.cargo}
                          valor={fila.cargo}
                          onChange={actualizarFilaDocente(fila.clave, 'cargo')}
                          disabled={isSubmittingDocentes}
                        />

                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => quitarFilaDocente(fila.clave)}
                          disabled={isSubmittingDocentes}
                        >
                          {DOCENTES_TEXT.buttons.quitarFila}
                        </Button>
                      </div>
                    ))}

                    <div>
                      <Button type="button" variant="secondary" onClick={agregarFilaDocente} disabled={isSubmittingDocentes}>
                        {DOCENTES_TEXT.buttons.agregarFila}
                      </Button>
                    </div>

                    {errorDocentes && <p style={{ color: APP_COLORS.error, margin: 0 }}>{errorDocentes}</p>}
                    {exitoDocentes && <p style={{ color: APP_COLORS.success, margin: 0 }}>{exitoDocentes}</p>}

                    <div>
                      <Button type="submit" variant="primary" disabled={isSubmittingDocentes}>
                        {isSubmittingDocentes ? DOCENTES_TEXT.buttons.guardando : DOCENTES_TEXT.buttons.guardarDocentes}
                      </Button>
                    </div>
                  </form>
                </>
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
              <Title as="h2">{DOCENTES_TEXT.disponibilidad.title}</Title>

              {docentes.length === 0 && (
                <p style={{ color: APP_COLORS.textMuted, marginTop: '1rem' }}>{DOCENTES_TEXT.disponibilidad.faltanDocentes}</p>
              )}

              {docentes.length > 0 && bloquesModulo.length === 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ color: APP_COLORS.textMuted, margin: 0 }}>{DOCENTES_TEXT.disponibilidad.faltanBloques}</p>
                  <Link
                    to={rutaBloquesEscuela(id)}
                    style={{ color: APP_COLORS.primary, fontWeight: 600, textDecoration: 'none' }}
                  >
                    {DOCENTES_TEXT.disponibilidad.irABloques} →
                  </Link>
                </div>
              )}

              {mostrarDisponibilidad && (
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ color: APP_COLORS.textMuted }}>{DOCENTES_TEXT.disponibilidad.ayuda}</p>

                  <div style={{ maxWidth: '360px' }}>
                    <Select
                      label={DOCENTES_TEXT.disponibilidad.elegirDocente}
                      opciones={opcionesDocentes}
                      valor={docenteSeleccionadoId}
                      onChange={setDocenteSeleccionadoId}
                      placeholder={DOCENTES_TEXT.disponibilidad.selectDocentePlaceholder}
                      disabled={isSubmittingDisponibilidad}
                    />
                  </div>

                  {docenteSeleccionadoId && isLoadingDisponibilidad && (
                    <p style={{ color: APP_COLORS.textMuted, marginTop: '1rem' }}>{DOCENTES_TEXT.disponibilidad.cargando}</p>
                  )}

                  {docenteSeleccionadoId && !isLoadingDisponibilidad && errorDisponibilidad && (
                    <p style={{ color: APP_COLORS.error, marginTop: '1rem' }}>{errorDisponibilidad}</p>
                  )}

                  {docenteSeleccionadoId && !isLoadingDisponibilidad && !errorDisponibilidad && (
                    <form onSubmit={handleGuardarDisponibilidad} style={{ marginTop: '1.5rem' }}>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr>
                              <th style={celdaEncabezado}>{DOCENTES_TEXT.disponibilidad.columnaBloque}</th>
                              {DIAS_SEMANA.map((dia) => (
                                <th key={dia.value} style={{ ...celdaEncabezado, textAlign: 'center' }}>
                                  {dia.label}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {bloquesModulo.map((bloque) => (
                              <tr key={bloque.id}>
                                <td style={{ ...celda, fontWeight: 600, whiteSpace: 'nowrap' }}>
                                  {formatearHoraCorta(bloque.hora_inicio)} - {formatearHoraCorta(bloque.hora_fin)}
                                </td>
                                {DIAS_SEMANA.map((dia) => {
                                  const yaDisponible = estaDisponible(dia.value, bloque.id)
                                  const clave = claveCelda(dia.value, bloque.id)
                                  return (
                                    <td key={dia.value} style={{ ...celda, textAlign: 'center' }}>
                                      <Checkbox
                                        checked={yaDisponible || Boolean(celdasNuevas[clave])}
                                        onChange={() => alternarCelda(dia.value, bloque.id)}
                                        disabled={yaDisponible || isSubmittingDisponibilidad}
                                      />
                                    </td>
                                  )
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {errorGuardarDisponibilidad && (
                        <p style={{ color: APP_COLORS.error, margin: '1rem 0 0' }}>{errorGuardarDisponibilidad}</p>
                      )}
                      {exitoGuardarDisponibilidad && (
                        <p style={{ color: APP_COLORS.success, margin: '1rem 0 0' }}>{exitoGuardarDisponibilidad}</p>
                      )}

                      <div style={{ marginTop: '1rem' }}>
                        <Button type="submit" variant="primary" disabled={isSubmittingDisponibilidad}>
                          {isSubmittingDisponibilidad
                            ? DOCENTES_TEXT.buttons.guardando
                            : DOCENTES_TEXT.buttons.guardarDisponibilidad}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
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

export default DocentesPage
