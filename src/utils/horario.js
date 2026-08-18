// La API devuelve horas como "HH:MM:SS"; para mostrarlas alcanza con "HH:MM".
export const formatearHoraCorta = (hora) => (typeof hora === 'string' ? hora.slice(0, 5) : hora)
