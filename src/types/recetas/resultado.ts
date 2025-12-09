/**
 * Tipos de datos para los resultados del cruce
 */

export interface Resultado {
  RUT: string;
  NOMBRE_PACIENTE: string;
  PROFESIONAL: string;
  TELEFONO_MOVIL: string;
  TELEFONO_FIJO: string;
  ID_RECETA: string | number;
  FECHA_RECETA: Date;
  ESTADO_TELECONSULTA: string;
  FECHA_ATENCION: string;
  DESCRIPCION: string;
  MEDICAMENTOS: string;
}

export interface ProfesionalCount {
  profesional: string;
  cantidad: number;
}

export interface Estadisticas {
  totalPacientes: number;
  totalRecetas: number;
  conMovil: number;
  conFijo: number;
  porcentajeMovil: number;
  porcentajeFijo: number;
  topProfesionales: ProfesionalCount[];
}

export interface ResultadoProcesamiento {
  resultados: Resultado[];
  estadisticas: Estadisticas;
  success: boolean;
  error?: string;
}
