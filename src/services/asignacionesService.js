import { getApiBaseUrl } from '../config/api'
import { apiClient } from './apiClient'

export const asignacionesService = {
  async generarHorario(escuelaId) {
    return apiClient.post(`/escuelas/${escuelaId}/asignaciones/generar`)
  },

  async listarAsignaciones(escuelaId) {
    return apiClient.get(`/escuelas/${escuelaId}/asignaciones/`)
  },

  urlPdfGrado(gradoId) {
    return `${getApiBaseUrl()}/pdf/grado/${gradoId}`
  },

  urlPdfDocente(docenteId) {
    return `${getApiBaseUrl()}/pdf/docente/${docenteId}`
  },
}
