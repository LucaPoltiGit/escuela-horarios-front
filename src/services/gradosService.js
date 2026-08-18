import { apiClient } from './apiClient'

export const gradosService = {
  async listarGrados(escuelaId) {
    return apiClient.get(`/escuelas/${escuelaId}/grados/`)
  },

  async crearGrados(escuelaId, grados) {
    return apiClient.post(`/escuelas/${escuelaId}/grados/`, grados)
  },
}
