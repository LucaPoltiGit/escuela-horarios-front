import { apiClient } from './apiClient'

export const bloquesService = {
  async listarBloques(escuelaId) {
    return apiClient.get(`/escuelas/${escuelaId}/bloques/`)
  },

  async crearBloques(escuelaId, bloques) {
    return apiClient.post(`/escuelas/${escuelaId}/bloques/`, bloques)
  },
}
