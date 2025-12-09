/**
 * Procesador principal para cruce de datos de dispensaciones y citas
 * Este archivo contiene la lógica central del sistema
 */

import * as XLSX from 'xlsx';
import { normalizarRUT, limpiarTelefono } from '../shared/normalizador';
import { calcularPorcentaje } from '../shared/utils';
import type { Dispensacion, DispensacionRaw } from '@/types/recetas/dispensacion';
import type { Cita, CitaRaw } from '@/types/recetas/cita';
import type { Resultado, Estadisticas } from '@/types/recetas/resultado';

/**
 * Procesa los archivos Excel de dispensaciones y citas
 * Realiza el cruce de datos y genera resultados con estadísticas
 *
 * @param archivoDispensaciones - Archivo Excel de dispensaciones
 * @param archivoCitas - Archivo Excel de citas
 * @returns Objeto con resultados y estadísticas
 */
export async function procesarArchivos(
  archivoDispensaciones: File,
  archivoCitas: File
): Promise<{ resultados: Resultado[]; estadisticas: Estadisticas }> {

  // 1. Leer archivos Excel
  const dispensacionesBuffer = await archivoDispensaciones.arrayBuffer();
  const citasBuffer = await archivoCitas.arrayBuffer();

  const wbDispensaciones = XLSX.read(dispensacionesBuffer);
  const wbCitas = XLSX.read(citasBuffer);

  // 2. Procesar dispensaciones (header en fila 2, datos desde fila 3)
  const wsDispensaciones = wbDispensaciones.Sheets[wbDispensaciones.SheetNames[0]];
  const dataDispensaciones = XLSX.utils.sheet_to_json<DispensacionRaw>(wsDispensaciones, {
    range: 2, // Empezar desde fila 3 (0-indexed, fila 2 tiene los headers)
    defval: '',
    raw: false // Para obtener fechas como strings
  });

  console.log(`📊 Dispensaciones leídas: ${dataDispensaciones.length} registros`);

  // 3. Procesar citas
  const wsCitas = wbCitas.Sheets[wbCitas.SheetNames[0]];
  const dataCitas = XLSX.utils.sheet_to_json<CitaRaw>(wsCitas, {
    defval: '',
    raw: false
  });

  console.log(`📊 Citas leídas: ${dataCitas.length} registros`);

  // 4. Normalizar y agrupar dispensaciones
  // Agrupamos por RUT + ID_RECETA para eliminar duplicados de medicamentos
  // Concatenamos las prescripciones de la misma receta
  const recetasMap = new Map<string, Dispensacion>();

  dataDispensaciones.forEach((row) => {
    const rutLimpio = normalizarRUT(row['RUT PACIENTE']);
    const idReceta = row['Id RECETA'];

    // Validar que tengamos datos mínimos
    if (!rutLimpio || !idReceta) {
      console.warn('⚠️ Registro sin RUT o ID_RECETA:', row);
      return;
    }

    const key = `${rutLimpio}-${idReceta}`;

    if (!recetasMap.has(key)) {
      // Primera vez que vemos esta receta, crear entrada
      recetasMap.set(key, {
        RUT_LIMPIO: rutLimpio,
        ID_RECETA: idReceta,
        NOMBRE_PACIENTE: row['NOMBRE PACIENTE'] || '',
        APELLIDO_PATERNO: row['APELLIDO PATERNO'] || '',
        APELLIDO_MATERNO: row['APELLIDO MATERNO'] || '',
        FUNCIONARIO_PRESCRIBE: row['FUNCIONARIO PRESCRIBE'] || '',
        FECHA_GENERACION_RECETA: new Date(row['FECHA GENERACION RECETA'] || Date.now()),
        PRESCRIPCION: row['PRESCRIPCION'] || ''
      });
    } else {
      // Ya existe esta receta, agregar medicamento
      const receta = recetasMap.get(key)!;
      if (row['PRESCRIPCION']) {
        receta.PRESCRIPCION += ' | ' + row['PRESCRIPCION'];
      }
    }
  });

  const recetas = Array.from(recetasMap.values());
  console.log(`📦 Recetas únicas: ${recetas.length} (de ${dataDispensaciones.length} registros)`);

  // 5. Normalizar y filtrar citas (solo validadas)
  const citasValidadas: Cita[] = dataCitas
    .filter((row) => {
      const estadoCita = String(row['Estado_Cita']).trim();
      return estadoCita === 'Validada';
    })
    .map((row) => ({
      RUT_LIMPIO: normalizarRUT(row['Run_Paciente']),
      nombre_paciente: row['nombre_paciente'] || '',
      Nombre_Profesional: row['Nombre_Profesional'] || '',
      Estado_Cita: row['Estado_Cita'],
      TELEFONO_MOVIL_LIMPIO: limpiarTelefono(row['Fono_movil']),
      TELEFONO_FIJO_LIMPIO: limpiarTelefono(row['Fono_fijo']),
      fecha_atencion: row['fecha_atencion'] || '',
      Estado_Teleconsulta: row['Estado_Teleconsulta'] || '',
      Descripcion: row['Descripcion'] || ''
    }));

  console.log(`✅ Citas validadas: ${citasValidadas.length} (de ${dataCitas.length} citas)`);

  // 6. Cruzar datos por RUT normalizado
  const resultados: Resultado[] = [];

  recetas.forEach(receta => {
    const citaEncontrada = citasValidadas.find(
      cita => cita.RUT_LIMPIO === receta.RUT_LIMPIO
    );

    if (citaEncontrada) {
      resultados.push({
        RUT: receta.RUT_LIMPIO,
        NOMBRE_PACIENTE: `${receta.NOMBRE_PACIENTE} ${receta.APELLIDO_PATERNO} ${receta.APELLIDO_MATERNO}`.trim(),
        PROFESIONAL: citaEncontrada.Nombre_Profesional,
        TELEFONO_MOVIL: citaEncontrada.TELEFONO_MOVIL_LIMPIO,
        TELEFONO_FIJO: citaEncontrada.TELEFONO_FIJO_LIMPIO,
        ID_RECETA: receta.ID_RECETA,
        FECHA_RECETA: receta.FECHA_GENERACION_RECETA,
        ESTADO_TELECONSULTA: citaEncontrada.Estado_Teleconsulta,
        FECHA_ATENCION: citaEncontrada.fecha_atencion,
        DESCRIPCION: citaEncontrada.Descripcion,
        MEDICAMENTOS: receta.PRESCRIPCION
      });
    }
  });

  console.log(`🎯 Resultados del cruce: ${resultados.length} recetas con citas validadas`);

  // 7. Calcular estadísticas
  const pacientesUnicos = new Set(resultados.map(r => r.RUT)).size;
  const conMovil = resultados.filter(r => r.TELEFONO_MOVIL !== '').length;
  const conFijo = resultados.filter(r => r.TELEFONO_FIJO !== '').length;

  // Top profesionales (contar recetas por profesional)
  const profesionalesCount = new Map<string, number>();
  resultados.forEach(r => {
    const profesional = r.PROFESIONAL || 'Sin profesional';
    profesionalesCount.set(
      profesional,
      (profesionalesCount.get(profesional) || 0) + 1
    );
  });

  const topProfesionales = Array.from(profesionalesCount.entries())
    .map(([profesional, cantidad]) => ({ profesional, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad);

  const estadisticas: Estadisticas = {
    totalPacientes: pacientesUnicos,
    totalRecetas: resultados.length,
    conMovil,
    conFijo,
    porcentajeMovil: calcularPorcentaje(conMovil, resultados.length),
    porcentajeFijo: calcularPorcentaje(conFijo, resultados.length),
    topProfesionales
  };

  console.log('📈 Estadísticas:', estadisticas);

  return { resultados, estadisticas };
}

/**
 * Genera archivo Excel con los resultados del procesamiento
 *
 * @param resultados - Array de resultados a exportar
 * @returns Buffer del archivo Excel
 */
export function generarExcel(resultados: Resultado[]): ArrayBuffer {
  // Preparar datos para exportación
  const datosExport = resultados.map(r => ({
    'RUT': r.RUT,
    'NOMBRE_PACIENTE': r.NOMBRE_PACIENTE,
    'PROFESIONAL': r.PROFESIONAL,
    'TELEFONO_MOVIL': r.TELEFONO_MOVIL,
    'TELEFONO_FIJO': r.TELEFONO_FIJO,
    'ID_RECETA': r.ID_RECETA,
    'FECHA_RECETA': r.FECHA_RECETA,
    'ESTADO_TELECONSULTA': r.ESTADO_TELECONSULTA,
    'FECHA_ATENCION': r.FECHA_ATENCION,
    'DESCRIPCION': r.DESCRIPCION,
    'MEDICAMENTOS': r.MEDICAMENTOS
  }));

  // Crear worksheet
  const ws = XLSX.utils.json_to_sheet(datosExport);

  // Ajustar ancho de columnas
  const columnWidths = [
    { wch: 12 }, // RUT
    { wch: 35 }, // NOMBRE_PACIENTE
    { wch: 25 }, // PROFESIONAL
    { wch: 15 }, // TELEFONO_MOVIL
    { wch: 15 }, // TELEFONO_FIJO
    { wch: 12 }, // ID_RECETA
    { wch: 18 }, // FECHA_RECETA
    { wch: 18 }, // ESTADO_TELECONSULTA
    { wch: 15 }, // FECHA_ATENCION
    { wch: 30 }, // DESCRIPCION
    { wch: 50 }  // MEDICAMENTOS
  ];
  ws['!cols'] = columnWidths;

  // Crear workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Notificaciones');

  // Generar buffer
  const buffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });

  return buffer;
}

/**
 * Valida que un archivo sea un Excel válido
 *
 * @param archivo - Archivo a validar
 * @returns true si es válido
 */
export function validarArchivoExcel(archivo: File): boolean {
  const extensionesValidas = ['.xlsx', '.xls'];
  const extension = archivo.name.toLowerCase().slice(archivo.name.lastIndexOf('.'));

  if (!extensionesValidas.includes(extension)) {
    return false;
  }

  // Verificar tamaño (máximo 50MB)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (archivo.size > maxSize) {
    return false;
  }

  return true;
}
