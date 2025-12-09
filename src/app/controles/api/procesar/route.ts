/**
 * API Route para procesar archivos de controles de telemedicina
 * POST /controles/api/procesar
 */

import { NextRequest, NextResponse } from 'next/server';
import { procesarArchivoControles, validarArchivoExcel } from '@/lib/controles/procesador';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Iniciando procesamiento de controles de telemedicina...');

    // Obtener FormData del request
    const formData = await request.formData();

    // Obtener archivo
    const archivoProduccion = formData.get('produccion') as File;

    // Validar que se recibió el archivo
    if (!archivoProduccion) {
      return NextResponse.json(
        {
          success: false,
          error: 'Debe proporcionar el archivo de producción ambulatoria'
        },
        { status: 400 }
      );
    }

    // Validar que sea un archivo Excel válido
    if (!validarArchivoExcel(archivoProduccion)) {
      return NextResponse.json(
        {
          success: false,
          error: 'El archivo no es un Excel válido o excede el tamaño máximo (50MB)'
        },
        { status: 400 }
      );
    }

    console.log(`📄 Archivo: ${archivoProduccion.name} (${(archivoProduccion.size / 1024).toFixed(2)} KB)`);

    // Procesar archivo
    const { resultados, estadisticas } = await procesarArchivoControles(archivoProduccion);

    console.log('✅ Procesamiento completado exitosamente');

    // Retornar resultados
    return NextResponse.json({
      success: true,
      resultados,
      estadisticas
    });

  } catch (error) {
    console.error('❌ Error al procesar archivo:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al procesar el archivo'
      },
      { status: 500 }
    );
  }
}

// Método OPTIONS para CORS (si es necesario)
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
