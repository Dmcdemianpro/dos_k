import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utilidad para combinar clases de Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea una fecha para visualización
 */
export function formatearFecha(fecha: Date | string): string {
  if (!fecha) return '';

  try {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;

    if (isNaN(fechaObj.getTime())) return String(fecha);

    return fechaObj.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return String(fecha);
  }
}

/**
 * Formatea un número con separadores de miles
 */
export function formatearNumero(num: number): string {
  return num.toLocaleString('es-CL');
}

/**
 * Calcula el porcentaje con 1 decimal
 */
export function calcularPorcentaje(parte: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((parte / total) * 1000) / 10;
}

/**
 * Descarga un archivo blob
 */
export function descargarArchivo(blob: Blob, nombreArchivo: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
