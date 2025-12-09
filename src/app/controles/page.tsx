'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ClipboardList, Upload, AlertCircle, ArrowLeft, FileText } from 'lucide-react';
import FileUploader from '@/components/controles/FileUploader';
import ProcessingStatus from '@/components/controles/ProcessingStatus';
import type { ResultadoProcesamiento } from '@/types/controles';

export default function ControlesPage() {
  const router = useRouter();
  const [archivoProduccion, setArchivoProduccion] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcesar = async () => {
    if (!archivoProduccion) {
      setError('Debe seleccionar el archivo de producción ambulatoria');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('produccion', archivoProduccion);

      const response = await fetch('/controles/api/procesar', {
        method: 'POST',
        body: formData
      });

      const data: ResultadoProcesamiento = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al procesar el archivo');
      }

      // Guardar resultados en sessionStorage para la página de resultados
      sessionStorage.setItem('controlesResultados', JSON.stringify(data.resultados));
      sessionStorage.setItem('controlesEstadisticas', JSON.stringify(data.estadisticas));

      // Navegar a página de resultados
      router.push('/controles/resultados');

    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al procesar el archivo');
      setIsProcessing(false);
    }
  };

  const puedeProc = archivoProduccion;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {isProcessing && <ProcessingStatus />}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 rounded-lg p-2">
                <ClipboardList className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Control de Pacientes de Telemedicina
                </h1>
                <p className="text-sm text-gray-600">
                  Procesamiento de Informe de Producción Ambulatoria
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Volver al inicio</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Card Principal */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Procesar Informe de Producción
              </h2>
              <p className="text-gray-600">
                Sube el archivo de producción ambulatoria para generar el registro de controles
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* File Uploader */}
            <div className="space-y-6 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-bold text-sm">
                    1
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Archivo de Producción Ambulatoria
                  </h3>
                </div>
                <FileUploader
                  label=""
                  description="INFORME_PRODUCCIÓN_AMBULATORIO_*.xlsx"
                  selectedFile={archivoProduccion}
                  onFileSelect={setArchivoProduccion}
                />
              </div>
            </div>

            {/* Botón Procesar */}
            <button
              onClick={handleProcesar}
              disabled={!puedeProc || isProcessing}
              className={`
                w-full py-4 rounded-lg font-bold text-lg transition-all duration-200
                flex items-center justify-center gap-3
                ${puedeProc && !isProcessing
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <Upload className="w-6 h-6" />
              {isProcessing ? 'Procesando...' : 'Procesar Archivo'}
            </button>

            {/* Info adicional */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Información del procesamiento
              </h4>
              <ul className="text-sm text-green-800 space-y-1 ml-6 list-disc">
                <li>El archivo debe estar en formato Excel (.xlsx o .xls)</li>
                <li>Tamaño máximo: 50 MB</li>
                <li>Se filtrarán solo consultas de telemedicina médicas</li>
                <li>Se generarán 4 hojas: Controles, Altas, Otras Comunas e Inasistencias</li>
              </ul>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Este módulo automatiza el registro de controles médicos programados de telemedicina
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
