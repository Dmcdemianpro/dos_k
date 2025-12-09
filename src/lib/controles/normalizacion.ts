/**
 * Funciones de normalización para el módulo de controles
 * Basadas en el script interconsultas_to_teleic.py
 */

import * as XLSX from 'xlsx';

/**
 * Detecta dinámicamente la fila del encabezado
 * NO asumir que siempre está en la misma posición
 * Busca la fila que contiene palabras clave como "FECHA CITA" o "ESPECIALIDAD"
 */
export function detectarFilaEncabezado(
  worksheet: XLSX.WorkSheet,
  keywords: string[] = ['FECHA CITA', 'ESPECIALIDAD', 'COMUNA', 'NOMBRE PACIENTE'],
  maxFilas: number = 10
): number {
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

  for (let i = 0; i < Math.min(maxFilas, data.length); i++) {
    const fila = data[i].map(cell => String(cell || '').toUpperCase());
    const tieneKeyword = keywords.some(kw =>
      fila.some(cell => cell.includes(kw))
    );
    if (tieneKeyword) {
      console.log(`📍 Encabezado detectado en fila ${i}`);
      return i;
    }
  }

  console.warn('⚠️ No se detectó encabezado, usando fila 0 por defecto');
  return 0; // default
}

/**
 * Normaliza texto: MAYÚSCULAS + sin tildes + trim
 * Similar a la función _norm() del script Python
 */
export function normalizarTexto(texto: string | null | undefined): string {
  if (!texto) return '';

  const str = String(texto).trim().toUpperCase();

  // Remover tildes/diacríticos
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Determina si un registro requiere control presencial
 * Busca palabra "presencial" en Observaciones (case-insensitive, sin tildes)
 */
export function requierePresencial(observaciones: string): boolean {
  if (!observaciones) return false;

  const obsNorm = normalizarTexto(observaciones);
  return obsNorm.includes('PRESENCIAL') || obsNorm.includes('PCP');
}

/**
 * Verifica si una consulta es de telemedicina
 * Usa normalización para comparación robusta
 */
export function esConsultaTelemedicina(consulta: string): boolean {
  if (!consulta) return false;

  const CONSULTAS_VALIDAS = [
    'TELEMEDICINA',
    'TELECONTROL',
    'BR TELEMEDICINA',
    'TELEMEDICINA EXTRA',
    'TELEMEDICINA CONTROL',
    'TELEMEDICINA POLI CHOQUE',
    'TELEMEDICINA PSICOTERAPIA',
    'TELEMEDICINA T.S',
    'TELEMEDICINA T.O',
    'TELEMEDICINA LEY IVE',
    'TELEINFORMES'  // Nueva consulta agregada
  ];

  const consultaNorm = normalizarTexto(consulta);
  return CONSULTAS_VALIDAS.some(kw => consultaNorm.includes(kw));
}

/**
 * Verifica si una especialidad está permitida
 * NO usa normalización estricta para evitar falsos negativos
 */
export function esEspecialidadPermitida(especialidad: string): boolean {
  if (!especialidad) return false;

  const ESPECIALIDADES_PERMITIDAS = [
    'ARO - Broncopulmonar',
    'Cirugía Pediátrica - Broncopulmonar adulto',
    'Broncopulmonar infantil',
    'Broncopulmonar Adulto',
    'Broncopulmonar',
    'Cardiología',
    'Diabetología',
    'Endocrinología',
    'Fisiatría',
    'Gastroenterología',
    'Gastroenterología Adulto',
    'Geriatría',
    'Ginecología - Urología',
    'Medicina Interna',
    'Neurología Adulto',
    'Neurología Pediátrica',
    'NEUROLOGÍA PEDIÁTRICA',
    'Pediatría',
    'Urología'
  ];

  const espNorm = normalizarTexto(especialidad);

  return ESPECIALIDADES_PERMITIDAS.some(esp => {
    const espPermitidaNorm = normalizarTexto(esp);
    return espNorm.includes(espPermitidaNorm) || espPermitidaNorm.includes(espNorm);
  });
}

/**
 * Normaliza nombre de comuna
 * Retorna en MAYÚSCULAS sin tildes
 */
export function normalizarComuna(comuna: string): string {
  return normalizarTexto(comuna);
}
