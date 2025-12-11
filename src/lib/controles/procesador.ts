/**
 * Procesador principal para el módulo de Controles de Telemedicina
 * Genera estructura dinámica de hojas por especialidad
 * Basado en interconsultas_to_teleic.py
 */

import * as XLSX from 'xlsx';
import { normalizarRUT } from '../shared/normalizador';
import {
  detectarFilaEncabezado,
  normalizarTexto,
  normalizarComuna,
  requierePresencial,
  esConsultaTelemedicina,
  esEspecialidadPermitida
} from './normalizacion';
import type {
  RegistroProduccionAmbulatoria,
  RegistroControlProcesado,
  ResultadosControles,
  EstadisticasControles
} from '@/types/controles';

/**
 * Valida que el archivo sea un Excel válido
 */
export function validarArchivoExcel(archivo: File): boolean {
  const extensionesValidas = ['.xlsx', '.xls'];
  const nombreArchivo = archivo.name.toLowerCase();
  const tieneExtensionValida = extensionesValidas.some(ext => nombreArchivo.endsWith(ext));

  if (!tieneExtensionValida) {
    return false;
  }

  // Tamaño máximo: 50 MB
  const maxSize = 50 * 1024 * 1024;
  if (archivo.size > maxSize) {
    return false;
  }

  return true;
}

/**
 * Procesa el archivo de producción ambulatoria
 * Genera estructura dinámica de hojas
 */
export async function procesarArchivoControles(
  archivo: File
): Promise<{ resultados: ResultadosControles; estadisticas: EstadisticasControles }> {
  console.log('🚀 Iniciando procesamiento de controles de telemedicina...');
  console.log(`📄 Archivo: ${archivo.name} (${(archivo.size / 1024).toFixed(2)} KB)`);

  // 1. Leer archivo Excel
  const buffer = await archivo.arrayBuffer();
  const workbook = XLSX.read(buffer);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  // 2. Detectar fila del encabezado (NO asumir fila fija)
  const headerRow = detectarFilaEncabezado(worksheet);
  console.log('🚀 Iniciando procesamiento de controles de telemedicina...');

  // 3. Convertir a JSON a partir del encabezado detectado
  const data = XLSX.utils.sheet_to_json(worksheet, {
    range: headerRow,
    defval: ''
  }) as Record<string, any>[];

  console.log(`📊 Registros totales leídos: ${data.length}`);

  // 4. Filtrar por telemedicina y especialidad
  const registrosFiltrados = data.filter(row => {
    const esTelemedicina = esConsultaTelemedicina(row['CONSULTA']);
    const especialidadValida = esEspecialidadPermitida(row['ESPECIALIDAD']);
    return esTelemedicina && especialidadValida;
  });

  console.log(`✅ Registros filtrados (telemedicina + especialidad): ${registrosFiltrados.length}`);

  // 5. Procesar y normalizar registros
  const registrosProcesados: RegistroControlProcesado[] = registrosFiltrados.map(row => {
    const observaciones = String(row['Observaciones'] || '');
    const esPCP = requierePresencial(observaciones);
    const comuna = String(row['COMUNA'] || '');
    const comunaNorm = normalizarComuna(comuna);

    return {
      'FECHA CITA': String(row['FECHA CITA'] || ''),
      'ESPECIALIDAD': String(row['ESPECIALIDAD'] || '').trim(),
      'CONSULTA': String(row['CONSULTA'] || ''),
      'AGENDA': String(row['AGENDA'] || ''),
      'TIPO DE CONSULTA PROGRAMADA': String(row['TIPO DE CONSULTA PROGRAMADA'] || ''),
      'NOMBRE PROFESIONAL ATIENDE': String(row['NOMBRE PROFESIONAL ATIENDE'] || ''),
      'NOMBRE PACIENTE': String(row['NOMBRE PACIENTE'] || ''),
      'RUN': String(row['RUN'] || ''),
      'COMUNA': comuna,
      'TELEFONO': String(row['TELEFONO'] || ''),
      'RESPONSABLE CITACION': String(row['RESPONSABLE CITACION'] || ''),
      'FECHA PROXIMO CONTROL': row['FECHA PROXIMO CONTROL'] || '',
      'RECETA': String(row['RECETA'] || ''),
      'EXAMEN DE ENDOSCOPIA SOLICITADO DURANTE LA ATENCION': String(row['EXAMEN DE ENDOSCOPIA SOLICITADO DURANTE LA ATENCION'] || ''),
      'EXAMEN DE IMAGENOLOGIA SOLICITADO DURANTE LA ATENCION': String(row['EXAMEN DE IMAGENOLOGIA SOLICITADO DURANTE LA ATENCION'] || ''),
      'EXAMEN DE LABORATORIO SOLICITADO DURANTE LA ATENCION': String(row['EXAMEN DE LABORATORIO SOLICITADO DURANTE LA ATENCION'] || ''),
      'EXAMEN DE OTRAS PRUEBAS SOLICITADO DURANTE LA ATENCION': String(row['EXAMEN DE OTRAS PRUEBAS SOLICITADO DURANTE LA ATENCION'] || ''),
      'Observaciones': observaciones,
      'COM_CLEAN': comunaNorm,
      '_PCP_': esPCP,
      'EsPresencial': esPCP ? 'Sí' : 'No'
    };
  });

  // 6. Eliminar duplicados por RUT
  const registrosUnicos = eliminarDuplicadosPorRUT(registrosProcesados);
  console.log(`🔄 Registros únicos (después de eliminar duplicados): ${registrosUnicos.length}`);

  // 7. Ordenar por fecha de próximo control
  const registrosOrdenados = [...registrosUnicos].sort((a, b) =>
    compareFechas(a['FECHA PROXIMO CONTROL'], b['FECHA PROXIMO CONTROL'])
  );

  // 8. Clasificar en grupos
  const resultados = clasificarRegistros(registrosOrdenados);

  // 9. Calcular estadísticas
  const estadisticas = calcularEstadisticas(resultados);

  console.log('📈 Estadísticas:', estadisticas);
  console.log('✅ Procesamiento completado exitosamente');

  return { resultados, estadisticas };
}

/**
 * Elimina registros duplicados por RUT normalizado
 * Mantiene el registro con fecha de próximo control más cercana
 * Consolida exámenes de todos los registros del mismo paciente
 */
function eliminarDuplicadosPorRUT(
  registros: RegistroControlProcesado[]
): RegistroControlProcesado[] {
  const porRUT = new Map<string, RegistroControlProcesado[]>();

  // Agrupar por RUT normalizado
  registros.forEach(reg => {
    const rutLimpio = normalizarRUT(reg.RUN);
    if (!rutLimpio) return;

    if (!porRUT.has(rutLimpio)) {
      porRUT.set(rutLimpio, []);
    }
    porRUT.get(rutLimpio)!.push(reg);
  });

  // Para cada RUT, mantener el mejor registro
  const resultado: RegistroControlProcesado[] = [];

  porRUT.forEach(regs => {
    if (regs.length === 1) {
      resultado.push(regs[0]);
    } else {
      // Ordenar por fecha de próximo control (más cercana primero)
      const ordenados = regs.sort((a, b) =>
        compareFechas(a['FECHA PROXIMO CONTROL'], b['FECHA PROXIMO CONTROL'])
      );

      // Consolidar exámenes
      const consolidado = { ...ordenados[0] };
      const examenes = {
        endoscopia: new Set<string>(),
        imagenologia: new Set<string>(),
        laboratorio: new Set<string>(),
        otras: new Set<string>()
      };

      regs.forEach(reg => {
        const endo = reg['EXAMEN DE ENDOSCOPIA SOLICITADO DURANTE LA ATENCION'];
        const imag = reg['EXAMEN DE IMAGENOLOGIA SOLICITADO DURANTE LA ATENCION'];
        const lab = reg['EXAMEN DE LABORATORIO SOLICITADO DURANTE LA ATENCION'];
        const otras = reg['EXAMEN DE OTRAS PRUEBAS SOLICITADO DURANTE LA ATENCION'];

        if (endo) examenes.endoscopia.add(endo);
        if (imag) examenes.imagenologia.add(imag);
        if (lab) examenes.laboratorio.add(lab);
        if (otras) examenes.otras.add(otras);
      });

      consolidado['EXAMEN DE ENDOSCOPIA SOLICITADO DURANTE LA ATENCION'] =
        Array.from(examenes.endoscopia).join(' | ');
      consolidado['EXAMEN DE IMAGENOLOGIA SOLICITADO DURANTE LA ATENCION'] =
        Array.from(examenes.imagenologia).join(' | ');
      consolidado['EXAMEN DE LABORATORIO SOLICITADO DURANTE LA ATENCION'] =
        Array.from(examenes.laboratorio).join(' | ');
      consolidado['EXAMEN DE OTRAS PRUEBAS SOLICITADO DURANTE LA ATENCION'] =
        Array.from(examenes.otras).join(' | ');

      resultado.push(consolidado);
    }
  });

  return resultado;
}

/**
 * Compara dos fechas para ordenamiento
 */
function compareFechas(fecha1: Date | string, fecha2: Date | string): number {
  if (!fecha1 && !fecha2) return 0;
  if (!fecha1) return 1;
  if (!fecha2) return -1;

  const d1 = new Date(fecha1);
  const d2 = new Date(fecha2);

  return d1.getTime() - d2.getTime();
}

/**
 * Clasifica registros en estructura dinámica
 */
function clasificarRegistros(
  registros: RegistroControlProcesado[]
): ResultadosControles {
  // Master: TODOS los registros ordenados
  const master = registros;

  // Master PCP: Solo registros que requieren presencial
  const masterPCP = registros.filter(r => r._PCP_);

  // Otras Comunas: COM_CLEAN != MAIPU && != CERRILLOS
  const otrasComunas = registros.filter(r =>
    r.COM_CLEAN !== 'MAIPU' && r.COM_CLEAN !== 'CERRILLOS'
  );

  // Agrupar por especialidad
  const porEspecialidad = agruparPorEspecialidad(registros);

  console.log(`📋 Hojas a generar: 3 base + ${Object.keys(porEspecialidad).length} especialidades`);

  return {
    master,
    masterPCP,
    otrasComunas,
    porEspecialidad
  };
}

/**
 * Agrupa registros por especialidad
 */
function agruparPorEspecialidad(
  registros: RegistroControlProcesado[]
): ResultadosControles['porEspecialidad'] {
  const grupos: ResultadosControles['porEspecialidad'] = {};

  registros.forEach(reg => {
    const esp = reg.ESPECIALIDAD;
    if (!grupos[esp]) {
      grupos[esp] = { normal: [], pcp: [] };
    }

    if (reg._PCP_) {
      grupos[esp].pcp.push(reg);
    } else {
      grupos[esp].normal.push(reg);
    }
  });

  return grupos;
}

/**
 * Calcula estadísticas del procesamiento
 */
function calcularEstadisticas(resultados: ResultadosControles): EstadisticasControles {
  const { master, masterPCP, otrasComunas, porEspecialidad } = resultados;

  // Contar hojas totales
  const especialidades = Object.keys(porEspecialidad);
  const hojasEspecialidad = especialidades.length;
  const hojasPCP = especialidades.filter(esp => porEspecialidad[esp].pcp.length > 0).length;
  const totalHojas = 3 + hojasEspecialidad + hojasPCP;

  // Top especialidades
  const topEspecialidades = especialidades.map(esp => ({
    especialidad: esp,
    total: porEspecialidad[esp].normal.length + porEspecialidad[esp].pcp.length,
    pcp: porEspecialidad[esp].pcp.length
  }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // Agrupar por profesional
  const profesionalesMap = new Map<string, { total: number; pcp: number }>();

  master.forEach(registro => {
    const profesional = registro['NOMBRE PROFESIONAL ATIENDE'] || 'Sin Profesional';
    const current = profesionalesMap.get(profesional) || { total: 0, pcp: 0 };
    current.total += 1;
    if (registro._PCP_) {
      current.pcp += 1;
    }
    profesionalesMap.set(profesional, current);
  });

  // Top profesionales
  const topProfesionales = Array.from(profesionalesMap.entries())
    .map(([profesional, stats]) => ({
      profesional,
      total: stats.total,
      pcp: stats.pcp
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 15);

  return {
    totalRegistros: master.length,
    totalPCP: masterPCP.length,
    totalOtrasComunas: otrasComunas.length,
    totalHojas,
    topEspecialidades,
    topProfesionales
  };
}
