/**
 * Generador de archivos Excel para el módulo de Controles
 * Genera estructura dinámica de hojas por especialidad
 * Elimina columnas vacías automáticamente
 */

import * as XLSX from 'xlsx';
import type { ResultadosControles, RegistroControlProcesado } from '@/types/controles';

/**
 * Filtra columnas vacías de un conjunto de registros
 */
function filtrarColumnasVacias(registros: RegistroControlProcesado[]): any[] {
  if (registros.length === 0) return [];

  // Obtener todas las claves
  const todasLasClaves = Object.keys(registros[0]);

  // Identificar columnas que tienen al menos un valor no vacío
  const columnasConValor = todasLasClaves.filter(clave => {
    return registros.some(reg => {
      const valor = reg[clave as keyof RegistroControlProcesado];
      return valor !== '' && valor !== null && valor !== undefined;
    });
  });

  // Crear registros filtrados solo con columnas que tienen valores
  return registros.map(reg => {
    const registroFiltrado: any = {};
    columnasConValor.forEach(clave => {
      registroFiltrado[clave] = reg[clave as keyof RegistroControlProcesado];
    });
    return registroFiltrado;
  });
}

/**
 * Genera archivo Excel con estructura dinámica de hojas
 * 3 hojas base + N hojas por especialidad + M hojas _PCP
 * Elimina automáticamente columnas vacías
 */
export function generarExcelControles(resultados: ResultadosControles): Buffer {
  const workbook = XLSX.utils.book_new();

  console.log('📦 Generando Excel con estructura dinámica...');

  // Filtrar columnas vacías para cada conjunto
  const masterFiltrado = filtrarColumnasVacias(resultados.master);
  const masterPCPFiltrado = filtrarColumnasVacias(resultados.masterPCP);
  const otrasComunasFiltrado = filtrarColumnasVacias(resultados.otrasComunas);

  // Hoja 1: MASTER (todos los registros)
  const wsMaster = XLSX.utils.json_to_sheet(masterFiltrado);
  aplicarEstilosDinamicos(wsMaster);
  XLSX.utils.book_append_sheet(workbook, wsMaster, 'MASTER');
  console.log(`✅ Hoja "MASTER" creada (${resultados.master.length} registros, ${Object.keys(masterFiltrado[0] || {}).length} columnas)`);

  // Hoja 2: MASTER_PCP (solo presenciales)
  const wsMasterPCP = XLSX.utils.json_to_sheet(masterPCPFiltrado);
  aplicarEstilosDinamicos(wsMasterPCP);
  XLSX.utils.book_append_sheet(workbook, wsMasterPCP, 'MASTER_PCP');
  console.log(`✅ Hoja "MASTER_PCP" creada (${resultados.masterPCP.length} registros, ${Object.keys(masterPCPFiltrado[0] || {}).length} columnas)`);

  // Hoja 3: OTRAS_COMUNAS
  const wsOtrasComunas = XLSX.utils.json_to_sheet(otrasComunasFiltrado);
  aplicarEstilosDinamicos(wsOtrasComunas);
  XLSX.utils.book_append_sheet(workbook, wsOtrasComunas, 'OTRAS_COMUNAS');
  console.log(`✅ Hoja "OTRAS_COMUNAS" creada (${resultados.otrasComunas.length} registros, ${Object.keys(otrasComunasFiltrado[0] || {}).length} columnas)`);

  // Hojas 4-N: Por especialidad (ordenadas alfabéticamente)
  const especialidades = Object.keys(resultados.porEspecialidad).sort();

  let contadorHojas = 3;

  especialidades.forEach(esp => {
    const data = resultados.porEspecialidad[esp];

    // Hoja normal (sin _PCP)
    if (data.normal.length > 0) {
      const datosFiltrados = filtrarColumnasVacias(data.normal);
      const ws = XLSX.utils.json_to_sheet(datosFiltrados);
      aplicarEstilosDinamicos(ws);
      const nombreHoja = truncarNombreHoja(esp);
      XLSX.utils.book_append_sheet(workbook, ws, nombreHoja);
      contadorHojas++;
      console.log(`✅ Hoja "${nombreHoja}" creada (${data.normal.length} registros, ${Object.keys(datosFiltrados[0] || {}).length} columnas)`);
    }

    // Hoja PCP (solo si hay registros presenciales)
    if (data.pcp.length > 0) {
      const datosFiltrados = filtrarColumnasVacias(data.pcp);
      const wsPCP = XLSX.utils.json_to_sheet(datosFiltrados);
      aplicarEstilosDinamicos(wsPCP);
      const nombreHojaPCP = truncarNombreHoja(`${esp}_PCP`);
      XLSX.utils.book_append_sheet(workbook, wsPCP, nombreHojaPCP);
      contadorHojas++;
      console.log(`✅ Hoja "${nombreHojaPCP}" creada (${data.pcp.length} registros, ${Object.keys(datosFiltrados[0] || {}).length} columnas)`);
    }
  });

  console.log(`📊 Total de hojas generadas: ${contadorHojas}`);

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Trunca nombre de hoja a máximo 31 caracteres
 * Limitación de Excel
 */
function truncarNombreHoja(nombre: string): string {
  if (nombre.length <= 31) {
    return nombre;
  }
  return nombre.substring(0, 31);
}

/**
 * Aplica estilos a una hoja de forma dinámica
 * Ajusta ancho de columnas automáticamente según el contenido
 */
function aplicarEstilosDinamicos(worksheet: XLSX.WorkSheet): void {
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  const columnas: { wch: number }[] = [];

  // Calcular ancho óptimo para cada columna
  for (let C = range.s.c; C <= range.e.c; ++C) {
    let maxWidth = 10; // Ancho mínimo

    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[cellAddress];

      if (cell && cell.v) {
        const cellValue = String(cell.v);
        const cellWidth = cellValue.length;
        maxWidth = Math.max(maxWidth, cellWidth);
      }
    }

    // Limitar ancho máximo a 50 caracteres
    columnas.push({ wch: Math.min(maxWidth + 2, 50) });
  }

  worksheet['!cols'] = columnas;
}
