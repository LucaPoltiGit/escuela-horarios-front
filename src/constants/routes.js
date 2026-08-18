export const ROUTES = {
  salud: '/',
  escuelas: '/escuelas',
  escuelaDetalle: '/escuelas/:id',
  escuelaBloques: '/escuelas/:id/bloques',
  escuelaGrados: '/escuelas/:id/grados',
  escuelaMaterias: '/escuelas/:id/materias',
  escuelaDocentes: '/escuelas/:id/docentes',
  escuelaGenerarHorario: '/escuelas/:id/generar-horario',
}

export const rutaDetalleEscuela = (id) => `/escuelas/${id}`
export const rutaBloquesEscuela = (id) => `/escuelas/${id}/bloques`
export const rutaGradosEscuela = (id) => `/escuelas/${id}/grados`
export const rutaMateriasEscuela = (id) => `/escuelas/${id}/materias`
export const rutaDocentesEscuela = (id) => `/escuelas/${id}/docentes`
export const rutaGenerarHorarioEscuela = (id) => `/escuelas/${id}/generar-horario`
