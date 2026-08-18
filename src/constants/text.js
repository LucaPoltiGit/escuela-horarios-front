export const APP_TEXT = {
  appTitle: 'Horarios escolares',
  backendStatus: {
    connected: 'Backend conectado',
    disconnected: 'Sin conexión',
    checking: 'Verificando conexión…',
  },
  health: {
    title: 'Estado del backend',
    description: 'Comprobación inicial de la conexión con la API.',
  },
  buttons: {
    retry: 'Reintentar',
  },
  nav: {
    salud: 'Estado del sistema',
    escuelas: 'Escuelas',
  },
  escuelas: {
    title: 'Gestión de escuelas',
    description: 'Consultá las escuelas cargadas y agregá nuevas.',
    listTitle: 'Escuelas cargadas',
    formTitle: 'Nueva escuela',
    labels: {
      nombre: 'Nombre de la escuela',
      tipo: 'Tipo de jornada',
      turno: 'Turno',
    },
    placeholders: {
      nombre: 'Ej: Escuela N.º 5',
    },
    selectPlaceholder: 'Seleccioná una opción',
    buttons: {
      crear: 'Crear escuela',
      creando: 'Creando…',
    },
    mensajes: {
      cargando: 'Cargando escuelas…',
      vacio: 'Todavía no hay escuelas cargadas.',
      errorListar: 'No se pudo obtener la lista de escuelas. Intentá nuevamente.',
      errorCrear: 'No se pudo crear la escuela. Revisá los datos e intentá de nuevo.',
      exitoCrear: 'Escuela creada correctamente.',
      camposRequeridos: 'Completá todos los campos antes de crear la escuela.',
    },
    tabla: {
      nombre: 'Nombre',
      tipo: 'Tipo',
      turno: 'Turno',
    },
  },
}

export const APP_COLORS = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  success: '#16a34a',
  error: '#dc2626',
  text: '#0f172a',
  textMuted: '#475569',
  background: '#f8fafc',
  surface: '#ffffff',
  border: '#e2e8f0',
}
