/**
 * Tipos de datos para el archivo de Citas
 */

export interface CitaRaw {
  'Run_Paciente': string | number;
  'nombre_paciente': string;
  'Nombre_Profesional': string;
  'Estado_Cita': string;
  'Fono_movil': string;
  'Fono_fijo': string;
  'fecha_atencion': string;
  'Estado_Teleconsulta': string;
  'Descripcion': string;
}

export interface Cita {
  RUT_LIMPIO: string;
  nombre_paciente: string;
  Nombre_Profesional: string;
  Estado_Cita: string;
  TELEFONO_MOVIL_LIMPIO: string;
  TELEFONO_FIJO_LIMPIO: string;
  fecha_atencion: string;
  Estado_Teleconsulta: string;
  Descripcion: string;
}
