// Acceso a localStorage tolerante a fallos: en modo privado de Safari, con el
// almacenamiento deshabilitado o con la cuota llena, la app sigue funcionando
// en memoria en lugar de lanzar y romper el render.
export const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export const safeSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Sin almacenamiento disponible: se pierde la persistencia, no la sesión.
  }
}

export const safeRemoveItem = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch {
    // Ignorado por la misma razón que safeSetItem.
  }
}
