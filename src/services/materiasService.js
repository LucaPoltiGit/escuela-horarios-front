import { apiClient } from './apiClient'

export const materiasService = {
  async listarMaterias(escuelaId) {
    return apiClient.get(`/escuelas/${escuelaId}/materias/`)
  },

  async crearMaterias(escuelaId, materias) {
    return apiClient.post(`/escuelas/${escuelaId}/materias/`, materias)
  },

  async listarAsignaciones(escuelaId) {
    return apiClient.get(`/escuelas/${escuelaId}/materias/asignaciones`)
  },

  async crearAsignaciones(escuelaId, asignaciones) {
    return apiClient.post(`/escuelas/${escuelaId}/materias/asignaciones`, asignaciones)
  },
}
