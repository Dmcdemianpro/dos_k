/**
 * Types para el módulo de Controles de Telemedicina
 */

// Registro raw del archivo de producción ambulatoria
export interface RegistroProduccionAmbulatoria {
  'FECHA CITA': string;
  'HORA CITA': string;
  'FECHA ATENCION': Date | string;
  'HORA ATENCION': string;
  'ESPECIALIDAD': string;
  'CONSULTA': string;
  'AGENDA': string;
  'TIPO DE CONSULTA PROGRAMADA': string;
  'TIPO DE CONSULTA CITADA': string;
  'NOMBRE PROFESIONAL ATIENDE': string;  // Nueva columna
  'NOMBRE PACIENTE': string;
  'RUN': string;
  'TELEFONO': string;
  'COMUNA': string;
  'ESTADO ATENCION': string;
  'RESPONSABLE CITACION': string;
  'FECHA PROXIMO CONTROL': Date | string;
  'RECETA': string;  // Nueva columna
  'EXAMEN DE ENDOSCOPIA SOLICITADO DURANTE LA ATENCION': string;
  'EXAMEN DE IMAGENOLOGIA SOLICITADO DURANTE LA ATENCION': string;
  'EXAMEN DE LABORATORIO SOLICITADO DURANTE LA ATENCION': string;
  'EXAMEN DE OTRAS PRUEBAS SOLICITADO DURANTE LA ATENCION': string;
  'Observaciones': string;
}

// Registro procesado y normalizado (20 columnas según spec)
export interface RegistroControlProcesado {
  'FECHA CITA': string;
  'ESPECIALIDAD': string;
  'CONSULTA': string;
  'AGENDA': string;
  'TIPO DE CONSULTA PROGRAMADA': string;
  'NOMBRE PROFESIONAL ATIENDE': string;
  'NOMBRE PACIENTE': string;
  'RUN': string;
  'COMUNA': string;
  'TELEFONO': string;
  'FECHA PROXIMO CONTROL': Date | string;
  'RECETA': string;
  'EXAMEN DE ENDOSCOPIA SOLICITADO DURANTE LA ATENCION': string;
  'EXAMEN DE IMAGENOLOGIA SOLICITADO DURANTE LA ATENCION': string;
  'EXAMEN DE LABORATORIO SOLICITADO DURANTE LA ATENCION': string;
  'EXAMEN DE OTRAS PRUEBAS SOLICITADO DURANTE LA ATENCION': string;
  'Observaciones': string;
  'COM_CLEAN': string;      // Comuna normalizada (MAIPU, CERRILLOS, etc)
  '_PCP_': boolean;         // Requiere presencial (true/false)
  'EsPresencial': string;   // "Sí" o "No"
}

// Resultados agrupados - estructura dinámica
export interface ResultadosControles {
  master: RegistroControlProcesado[];               // TODOS los registros
  masterPCP: RegistroControlProcesado[];            // Solo _PCP_ = true
  otrasComunas: RegistroControlProcesado[];         // COM_CLEAN != MAIPU && != CERRILLOS
  porEspecialidad: {                                // Agrupado por especialidad
    [especialidad: string]: {
      normal: RegistroControlProcesado[];           // _PCP_ = false
      pcp: RegistroControlProcesado[];              // _PCP_ = true
    };
  };
}

// Estadísticas del procesamiento
export interface EstadisticasControles {
  totalRegistros: number;
  totalPCP: number;
  totalOtrasComunas: number;
  totalHojas: number;  // 3 base + N especialidades + M especialidades_PCP
  topEspecialidades: Array<{
    especialidad: string;
    total: number;
    pcp: number;
  }>;
  topProfesionales: Array<{
    profesional: string;
    total: number;
    pcp: number;
  }>;
}

// Respuesta del API
export interface ResultadoProcesamiento {
  success: boolean;
  resultados?: ResultadosControles;
  estadisticas?: EstadisticasControles;
  error?: string;
}
