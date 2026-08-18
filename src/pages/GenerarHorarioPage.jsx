import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { Title } from '../components/common/Title'
import { APP_COLORS, APP_TEXT } from '../constants/text'
import { DIAS_SEMANA } from '../constants/diasSemana'
import { rutaDetalleEscuela } from '../constants/routes'
import { asignacionesService } from '../services/asignacionesService'
import { bloquesService } from '../services/bloquesService'
import { docentesService } from '../services/docentesService'
import { gradosService } from '../services/gradosService'
import { materiasService } from '../services/materiasService'
import { formatearHoraCorta } from '../utils/horario'

const GENERAR_TEXT = APP_TEXT.generar

function GenerarHorarioPage() {
  const { id } = useParams()

  const [grados, setGrados] = useState([])
  const [materias, setMaterias] = useState([])
  const [docentes, setDocentes] = useState([])
  const [bloques, setBloques] = useState([])
  const [asignaciones, setAsignaciones] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')

  const [isGenerando, setIsGenerando] = useState(false)
  const [errorGenerar, setErrorGenerar] = useState('')
  const [exitoGenerar, setExitoGenerar] = useState('')

  const fetchDatos = useCallback(async () => {
    setIsLoading(true)
    setErrorCarga('')

    try {
      const [gradosResp, materiasResp, docentesResp, bloquesResp, asignacionesResp] = await Promise.all([
        gradosService.listarGrados(id),
        materiasService.listarMaterias(id),
        docentesService.listarDocentes(id),
        bloquesService.listarBloques(id),
        asignacionesService.listarAsignaciones(id),
      ])
      setGrados(gradosResp ?? [])
      setMaterias(materiasResp ?? [])
      setDocentes(docentesResp ?? [])
      setBloques(bloquesResp ?? [])
      setAsignaciones(asignacionesResp ?? [])
    } catch (error) {
      setErrorCarga(GENERAR_TEXT.mensajes.errorCargar)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchDatos()
  }, [fetchDatos])

  const nombreMateria = (materiaId) => materias.find((materia) => materia.id === materiaId)?.nombre ?? '—'
  const nombreDocente = (docenteId) => docentes.find((docente) => docente.id === docenteId)?.nombre ?? '—'

  const obtenerAsignacion = (gradoId, diaSemana, bloqueId) =>
    asignaciones.find(
      (asignacion) =>
        asignacion.grado_id === gradoId && asignacion.dia_semana === diaSemana && asignacion.bloque_id === bloqueId,
    )

  const handleGenerar = async () => {
    if (asignaciones.length > 0) {
      const confirmado = window.confirm(GENERAR_TEXT.confirmarRegenerar)
      if (!confirmado) return
    }

    setErrorGenerar('')
    setExitoGenerar('')
    setIsGenerando(true)

    try {
      const respuesta = await asignacionesService.generarHorario(id)
      setAsignaciones(respuesta ?? [])
      setExitoGenerar(GENERAR_TEXT.mensajes.exitoGenerar)
    } catch (error) {
      const esMensajeDelSolver = error.message && !error.message.startsWith('HTTP ')
      setErrorGenerar(esMensajeDelSolver ? error.message : GENERAR_TEXT.mensajes.errorGenerar)
    } finally {
      setIsGenerando(false)
    }
  }

  const bloquesModulo = bloques.filter((bloque) => bloque.tipo_bloque === 'modulo')
  const hayHorario = !isLoading && !errorCarga && asignaciones.length > 0

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
          ← {GENERAR_TEXT.volver}
        </Link>

        <div>
          <Title as="h1">{GENERAR_TEXT.title}</Title>
          <p style={{ color: APP_COLORS.textMuted, marginTop: '0.5rem' }}>{GENERAR_TEXT.description}</p>
        </div>

        {isLoading && <p style={{ color: APP_COLORS.textMuted }}>{GENERAR_TEXT.mensajes.cargando}</p>}

        {!isLoading && errorCarga && <p style={{ color: APP_COLORS.error }}>{errorCarga}</p>}

        {!isLoading && !errorCarga && (
          <section
            style={{
              background: APP_COLORS.surface,
              border: `1px solid ${APP_COLORS.border}`,
              borderRadius: '18px',
              padding: '2rem',
            }}
          >
            {asignaciones.length === 0 && (
              <p style={{ color: APP_COLORS.textMuted, marginTop: 0 }}>{GENERAR_TEXT.estadoInicial}</p>
            )}

            <Button type="button" variant="primary" onClick={handleGenerar} disabled={isGenerando}>
              {isGenerando
                ? GENERAR_TEXT.buttons.generando
                : asignaciones.length > 0
                  ? GENERAR_TEXT.buttons.regenerar
                  : GENERAR_TEXT.buttons.generar}
            </Button>

            {errorGenerar && <p style={{ color: APP_COLORS.error, marginTop: '1rem' }}>{errorGenerar}</p>}
            {exitoGenerar && <p style={{ color: APP_COLORS.success, marginTop: '1rem' }}>{exitoGenerar}</p>}
          </section>
        )}

        {hayHorario && (
          <section
            style={{
              background: APP_COLORS.surface,
              border: `1px solid ${APP_COLORS.border}`,
              borderRadius: '18px',
              padding: '2rem',
            }}
          >
            <Title as="h2">{GENERAR_TEXT.resultado.title}</Title>

            {grados.map((grado) => (
              <div key={grado.id} style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <Title as="h3" align="left">
                    {grado.nombre}
                  </Title>
                  <a
                    href={asignacionesService.urlPdfGrado(grado.id)}
                    target="_blank"
                    rel="noreferrer"
                    style={enlacePdf}
                  >
                    {GENERAR_TEXT.resultado.pdfGrado}
                  </a>
                </div>

                <div style={{ overflowX: 'auto', marginTop: '0.75rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={celdaEncabezado}>{GENERAR_TEXT.resultado.columnaBloque}</th>
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
                            const asignacion = obtenerAsignacion(grado.id, dia.value, bloque.id)
                            return (
                              <td key={dia.value} style={{ ...celda, textAlign: 'center' }}>
                                {asignacion ? (
                                  <div>
                                    <div>{nombreMateria(asignacion.materia_id)}</div>
                                    <div style={{ color: APP_COLORS.textMuted, fontSize: '0.85rem' }}>
                                      {nombreDocente(asignacion.docente_id)}
                                    </div>
                                  </div>
                                ) : (
                                  GENERAR_TEXT.resultado.celdaVacia
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            <Title as="h3" align="left">
              {GENERAR_TEXT.resultado.pdfDocentesTitle}
            </Title>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
              {docentes.map((docente) => (
                <a
                  key={docente.id}
                  href={asignacionesService.urlPdfDocente(docente.id)}
                  target="_blank"
                  rel="noreferrer"
                  style={enlacePdf}
                >
                  {docente.nombre} — {GENERAR_TEXT.resultado.pdfDocente}
                </a>
              ))}
            </div>
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

const enlacePdf = {
  padding: '0.5rem 1rem',
  borderRadius: '10px',
  border: `1px solid ${APP_COLORS.border}`,
  color: APP_COLORS.primary,
  fontWeight: 600,
  textDecoration: 'none',
  fontSize: '0.9rem',
}

export default GenerarHorarioPage
