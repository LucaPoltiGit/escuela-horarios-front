import { apiClient } from './apiClient'

export const docentesService = {
  async listarDocentes(escuelaId) {
    return apiClient.get(`/escuelas/${escuelaId}/docentes/`)
  },

  async crearDocentes(escuelaId, docentes) {
    return apiClient.post(`/escuelas/${escuelaId}/docentes/`, docentes)
  },

  async listarDisponibilidad(escuelaId, docenteId) {
    return apiClient.get(`/escuelas/${escuelaId}/docentes/${docenteId}/disponibilidad`)
  },

  async guardarDisponibilidad(escuelaId, docenteId, disponibilidad) {
    return apiClient.post(`/escuelas/${escuelaId}/docentes/${docenteId}/disponibilidad`, disponibilidad)
  },
}
