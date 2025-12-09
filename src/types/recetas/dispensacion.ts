/**
 * Tipos de datos para el archivo de Dispensaciones
 */

export interface DispensacionRaw {
  'RUT PACIENTE': string | number;
  'Id RECETA': string | number;
  'NOMBRE PACIENTE': string;
  'APELLIDO PATERNO': string;
  'APELLIDO MATERNO': string;
  'FUNCIONARIO PRESCRIBE': string;
  'FECHA GENERACION RECETA': Date | string;
  'PRESCRIPCION': string;
}

export interface Dispensacion {
  RUT_LIMPIO: string;
  ID_RECETA: string | number;
  NOMBRE_PACIENTE: string;
  APELLIDO_PATERNO: string;
  APELLIDO_MATERNO: string;
  FUNCIONARIO_PRESCRIBE: string;
  FECHA_GENERACION_RECETA: Date;
  PRESCRIPCION: string;
}
