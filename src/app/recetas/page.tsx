'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Hospital, Upload, AlertCircle } from 'lucide-react';
import FileUploader from '@/components/recetas/FileUploader';
import ProcessingStatus from '@/components/recetas/ProcessingStatus';
import type { ResultadoProcesamiento } from '@/types/recetas/resultado';

export default function HomePage() {
  const router = useRouter();
  const [archivoDispensaciones, setArchivoDispensaciones] = useState<File | null>(null);
  const [archivoCitas, setArchivoCitas] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcesar = async () => {
    if (!archivoDispensaciones || !archivoCitas) {
      setError('Debe seleccionar ambos archivos antes de continuar');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('dispensaciones', archivoDispensaciones);
      formData.append('citas', archivoCitas);

      const response = await fetch('/recetas/api/procesar', {
        method: 'POST',
        body: formData
      });

      const data: ResultadoProcesamiento = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al procesar los archivos');
      }

      // Guardar resultados en sessionStorage para la página de resultados
      sessionStorage.setItem('resultados', JSON.stringify(data.resultados));
      sessionStorage.setItem('estadisticas', JSON.stringify(data.estadisticas));

      // Navegar a página de resultados
      router.push('/recetas/resultados');

    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al procesar los archivos');
      setIsProcessing(false);
    }
  };

  const puedeProc = archivoDispensaciones && archivoCitas;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {isProcessing && <ProcessingStatus />}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-lg p-2">
              <Hospital className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sistema de Notificación de Recetas
              </h1>
              <p className="text-sm text-gray-600">
                Telemedicina - Cruce de Dispensaciones y Citas
              </p>
            </div>
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
                Procesar Archivos
              </h2>
              <p className="text-gray-600">
                Sube los archivos de dispensaciones y citas para generar la lista de pacientes a notificar
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

            {/* File Uploaders */}
            <div className="space-y-6 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full font-bold text-sm">
                    1
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Archivo de Dispensaciones
                  </h3>
                </div>
                <FileUploader
                  label=""
                  description="Informe_de_dispensaciones_*.xlsx"
                  selectedFile={archivoDispensaciones}
                  onFileSelect={setArchivoDispensaciones}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full font-bold text-sm">
                    2
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Archivo de Citas
                  </h3>
                </div>
                <FileUploader
                  label=""
                  description="GeneralCitas_export_*.xlsx"
                  selectedFile={archivoCitas}
                  onFileSelect={setArchivoCitas}
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
                  ? 'bg-primary text-white hover:bg-primary-dark shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <Upload className="w-6 h-6" />
              {isProcessing ? 'Procesando...' : 'Procesar Archivos'}
            </button>

            {/* Info adicional */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Información importante
              </h4>
              <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
                <li>Los archivos deben estar en formato Excel (.xlsx o .xls)</li>
                <li>Tamaño máximo por archivo: 10 MB</li>
                <li>Se cruzarán automáticamente las recetas con las citas validadas</li>
                <li>El resultado incluirá datos de contacto para notificaciones</li>
              </ul>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Sistema desarrollado para automatizar el proceso de notificación de recetas disponibles
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
