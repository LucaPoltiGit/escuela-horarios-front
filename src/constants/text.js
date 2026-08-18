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
    ayudaFilaClickeable: 'Hacé clic en una escuela para ver su detalle.',
    secciones: {
      bloques: 'Bloques horarios',
      grados: 'Grados',
      materias: 'Materias',
      docentes: 'Docentes',
      generarHorario: 'Generar horario',
    },
    detalle: {
      volver: 'Volver a escuelas',
      cargando: 'Cargando escuela…',
      errorCargar: 'No se pudo obtener la escuela solicitada.',
      noEncontrada: 'No encontramos esa escuela.',
      seccionesTitle: 'Secciones de la escuela',
      labels: {
        tipo: 'Tipo de jornada',
        turno: 'Turno',
      },
    },
  },
  enConstruccion: {
    title: 'Sección en construcción',
    description: 'Todavía estamos trabajando en esta sección. Volvé a intentarlo más adelante.',
    volver: 'Volver a la escuela',
  },
  bloques: {
    title: 'Bloques horarios',
    description: 'La grilla del día se repite igual toda la semana. Cargala una sola vez.',
    volver: 'Volver a la escuela',
    tabla: {
      orden: 'Orden',
      horaInicio: 'Hora inicio',
      horaFin: 'Hora fin',
      tipo: 'Tipo',
    },
    editor: {
      title: 'Cargar el día',
      ayuda: 'Agregá una fila por cada bloque del día, en el orden en que ocurren.',
    },
    labels: {
      horaInicio: 'Hora inicio',
      horaFin: 'Hora fin',
      tipo: 'Tipo de bloque',
    },
    selectPlaceholder: 'Seleccioná un tipo',
    buttons: {
      agregarFila: 'Agregar bloque',
      quitarFila: 'Quitar',
      guardarDia: 'Guardar día',
      guardando: 'Guardando…',
    },
    mensajes: {
      cargando: 'Cargando bloques…',
      errorListar: 'No se pudo obtener los bloques de esta escuela.',
      sinFilas: 'Agregá al menos un bloque antes de guardar.',
      camposIncompletos: 'Completá hora inicio, hora fin y tipo en todas las filas.',
      errorGuardar: 'No se pudo guardar el día. Revisá los datos e intentá de nuevo.',
      exitoGuardar: 'Día guardado correctamente.',
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
