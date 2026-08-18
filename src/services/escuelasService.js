import { apiClient } from './apiClient'

export const escuelasService = {
  async listarEscuelas() {
    return apiClient.get('/escuelas/')
  },

  async crearEscuela(datos) {
    return apiClient.post('/escuelas/', datos)
  },

  // La API todavía no expone GET /escuelas/{id}/. Cuando exista, sería ideal
  // usarlo directamente en vez de buscar en la lista completa.
  async obtenerEscuela(id) {
    const escuelas = await apiClient.get('/escuelas/')
    return escuelas.find((escuela) => String(escuela.id) === String(id))
  },
}
