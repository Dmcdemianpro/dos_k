/**
 * API Route para procesar archivos de dispensaciones y citas
 * POST /api/procesar
 */

import { NextRequest, NextResponse } from 'next/server';
import { procesarArchivos, validarArchivoExcel } from '@/lib/recetas/procesador';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Iniciando procesamiento de archivos...');

    // Obtener FormData del request
    const formData = await request.formData();

    // Obtener archivos
    const archivoDispensaciones = formData.get('dispensaciones') as File;
    const archivoCitas = formData.get('citas') as File;

    // Validar que se recibieron ambos archivos
    if (!archivoDispensaciones || !archivoCitas) {
      return NextResponse.json(
        {
          success: false,
          error: 'Debe proporcionar ambos archivos: dispensaciones y citas'
        },
        { status: 400 }
      );
    }

    // Validar que sean archivos Excel válidos
    if (!validarArchivoExcel(archivoDispensaciones)) {
      return NextResponse.json(
        {
          success: false,
          error: 'El archivo de dispensaciones no es un Excel válido o excede el tamaño máximo (10MB)'
        },
        { status: 400 }
      );
    }

    if (!validarArchivoExcel(archivoCitas)) {
      return NextResponse.json(
        {
          success: false,
          error: 'El archivo de citas no es un Excel válido o excede el tamaño máximo (10MB)'
        },
        { status: 400 }
      );
    }

    console.log(`📄 Archivo dispensaciones: ${archivoDispensaciones.name} (${(archivoDispensaciones.size / 1024).toFixed(2)} KB)`);
    console.log(`📄 Archivo citas: ${archivoCitas.name} (${(archivoCitas.size / 1024).toFixed(2)} KB)`);

    // Procesar archivos
    const { resultados, estadisticas } = await procesarArchivos(
      archivoDispensaciones,
      archivoCitas
    );

    console.log('✅ Procesamiento completado exitosamente');

    // Retornar resultados
    return NextResponse.json({
      success: true,
      resultados,
      estadisticas
    });

  } catch (error) {
    console.error('❌ Error al procesar archivos:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al procesar los archivos'
      },
      { status: 500 }
    );
  }
}

// Método OPTIONS para CORS (si es necesario)
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
