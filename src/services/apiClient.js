import { getApiBaseUrl } from '../config/api'

const buildUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getApiBaseUrl()}${normalizedPath}`
}

export const apiClient = {
  async get(path) {
    const response = await fetch(buildUrl(path), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorMessage = `HTTP ${response.status}`
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async post(path, body) {
    const response = await fetch(buildUrl(path), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`
      try {
        const cuerpo = await response.json()
        if (cuerpo?.detail) {
          errorMessage = cuerpo.detail
        }
      } catch (error) {
        // El cuerpo del error no era JSON: se usa el mensaje genérico.
      }
      throw new Error(errorMessage)
    }

    return response.json()
  },
}
