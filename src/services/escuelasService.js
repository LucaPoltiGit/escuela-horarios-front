import { apiClient } from './apiClient'

export const escuelasService = {
  async listarEscuelas() {
    return apiClient.get('/escuelas/')
  },

  async crearEscuela(datos) {
    return apiClient.post('/escuelas/', datos)
  },
}
