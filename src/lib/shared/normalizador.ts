/**
 * Funciones de normalización para RUTs y teléfonos
 * CRÍTICO: La normalización de RUTs es esencial para el cruce de datos
 */

/**
 * Normaliza un RUT chileno eliminando guiones, puntos y espacios
 * Convierte todo a mayúsculas para consistencia
 *
 * Ejemplos:
 * - "12.345.678-9" -> "123456789"
 * - "6447300-K" -> "6447300K"
 * - "258126041" -> "258126041"
 * - "13012870K" -> "13012870K"
 *
 * @param rut - RUT en cualquier formato
 * @returns RUT normalizado (solo números y dígito verificador)
 */
export function normalizarRUT(rut: string | number | null | undefined): string {
  if (!rut) return '';

  const rutStr = String(rut).trim().toUpperCase();

  // Eliminar guiones, puntos y espacios
  const rutLimpio = rutStr.replace(/[-.\s]/g, '');

  return rutLimpio;
}

/**
 * Limpia un número de teléfono extrayendo solo los dígitos principales
 * Maneja casos donde el teléfono tiene texto adicional
 *
 * Ejemplos:
 * - "942444115 esposa hilda" -> "942444115"
 * - "9 8765 4321" -> "987654321"
 * - "+56912345678" -> "56912345678"
 *
 * @param telefono - Teléfono en cualquier formato
 * @returns Solo los números del teléfono
 */
export function limpiarTelefono(telefono: string | null | undefined): string {
  if (!telefono) return '';

  const telefonoStr = String(telefono).trim();

  // Extraer todos los números
  const numeros = telefonoStr.match(/\d+/g);

  // Tomar el primer grupo de números (generalmente el número real)
  return numeros ? numeros[0] : '';
}

/**
 * Formatea un RUT para visualización con puntos y guión
 *
 * Ejemplo: "123456789" -> "12.345.678-9"
 *
 * @param rut - RUT normalizado
 * @returns RUT formateado para visualización
 */
export function formatearRUT(rut: string): string {
  if (!rut) return '';

  const rutLimpio = normalizarRUT(rut);
  if (rutLimpio.length < 2) return rut;

  const dv = rutLimpio.slice(-1);
  const numero = rutLimpio.slice(0, -1);

  // Agregar puntos cada 3 dígitos desde la derecha
  const numeroFormateado = numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${numeroFormateado}-${dv}`;
}

/**
 * Valida formato básico de RUT chileno
 * No valida el dígito verificador, solo el formato
 *
 * @param rut - RUT a validar
 * @returns true si el formato es válido
 */
export function validarFormatoRUT(rut: string): boolean {
  if (!rut) return false;

  const rutLimpio = normalizarRUT(rut);

  // Debe tener entre 8 y 9 caracteres (7-8 dígitos + dígito verificador)
  if (rutLimpio.length < 8 || rutLimpio.length > 9) return false;

  // Los primeros caracteres deben ser números
  const numero = rutLimpio.slice(0, -1);
  if (!/^\d+$/.test(numero)) return false;

  // El último carácter debe ser número o K
  const dv = rutLimpio.slice(-1);
  if (!/^[0-9K]$/.test(dv)) return false;

  return true;
}

/**
 * Formatea un número de teléfono para visualización
 *
 * Ejemplo: "987654321" -> "+56 9 8765 4321"
 *
 * @param telefono - Teléfono limpio
 * @returns Teléfono formateado
 */
export function formatearTelefono(telefono: string): string {
  if (!telefono) return '';

  const telefonoLimpio = limpiarTelefono(telefono);

  // Si tiene 9 dígitos, es un móvil chileno
  if (telefonoLimpio.length === 9 && telefonoLimpio.startsWith('9')) {
    return `+56 ${telefonoLimpio[0]} ${telefonoLimpio.slice(1, 5)} ${telefonoLimpio.slice(5)}`;
  }

  // Si tiene 8 dígitos, es un fijo chileno
  if (telefonoLimpio.length === 8) {
    return `+56 ${telefonoLimpio.slice(0, 2)} ${telefonoLimpio.slice(2)}`;
  }

  // Formato por defecto
  return telefonoLimpio;
}
