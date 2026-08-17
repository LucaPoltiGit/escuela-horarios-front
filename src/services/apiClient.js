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
}
