'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardList, RefreshCw, CheckCircle, FileText, Award, Home } from 'lucide-react';
import StatsCards from '@/components/controles/StatsCards';
import DownloadButton from '@/components/controles/DownloadButton';
import TopEspecialidades from '@/components/controles/TopEspecialidades';
import type { ResultadosControles, EstadisticasControles } from '@/types/controles';

export default function ResultadosControlesPage() {
  const router = useRouter();
  const [resultados, setResultados] = useState<ResultadosControles | null>(null);
  const [estadisticas, setEstadisticas] = useState<EstadisticasControles | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar resultados desde sessionStorage
    const resultadosStr = sessionStorage.getItem('controlesResultados');
    const estadisticasStr = sessionStorage.getItem('controlesEstadisticas');

    if (!resultadosStr || !estadisticasStr) {
      // No hay datos, redirigir a controles
      router.push('/controles');
      return;
    }

    try {
      const resultadosData = JSON.parse(resultadosStr);
      const estadisticasData = JSON.parse(estadisticasStr);

      setResultados(resultadosData);
      setEstadisticas(estadisticasData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al cargar resultados:', error);
      router.push('/controles');
    }
  }, [router]);

  const handleNuevoProcesamiento = () => {
    // Limpiar sessionStorage y redirigir
    sessionStorage.removeItem('controlesResultados');
    sessionStorage.removeItem('controlesEstadisticas');
    router.push('/controles');
  };

  if (isLoading || !estadisticas || !resultados) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  const especialidades = Object.keys(resultados.porEspecialidad).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-2">
                <ClipboardList className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Resultados del Procesamiento
                </h1>
                <p className="text-sm text-gray-600">
                  Controles de Telemedicina procesados exitosamente
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Home className="w-4 h-4" />
                Volver al Menú
              </button>
              <button
                onClick={handleNuevoProcesamiento}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Procesar Nuevo Archivo
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-12 py-4">
        {/* Banner de éxito */}
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-green-900">Procesamiento Completado:</span>
              <span className="text-sm text-green-800">
                <strong>{estadisticas.totalRegistros}</strong> registros procesados en{' '}
                <strong>{estadisticas.totalHojas}</strong> hojas
              </span>
            </div>
          </div>
        </div>

        {/* Contenedor principal */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
          {/* Estadísticas */}
          <div className="mb-4">
            <StatsCards estadisticas={estadisticas} />
          </div>

          {/* Botón de descarga destacado */}
          <div className="mb-4 flex justify-end">
            <DownloadButton resultados={resultados} />
          </div>

          {/* Grid de tablas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Tabla de Profesionales Médicos */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-300 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-700" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Profesionales Médicos
                  </h3>
                </div>
                <span className="text-xs bg-blue-200 text-blue-800 px-2.5 py-1 rounded-full font-semibold">
                  Top 15
                </span>
              </div>

              <div className="bg-white/80 rounded-lg max-h-96 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-white border-b border-gray-200">
                    <tr>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">#</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Profesional</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-600">Atenciones</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-600">PCP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {estadisticas.topProfesionales.map((prof, index) => (
                      <tr key={index} className="hover:bg-blue-50 transition-colors">
                        <td className="py-2 px-3">
                          <div className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold">
                            {index + 1}
                          </div>
                        </td>
                        <td className="py-2 px-3 font-semibold text-gray-900">
                          {prof.profesional}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="inline-flex px-2.5 py-1 bg-gray-100 text-gray-900 rounded-full font-bold">
                            {prof.total}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          {prof.pcp > 0 ? (
                            <span className="inline-flex px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-bold">
                              {prof.pcp}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Nota informativa */}
              <div className="mt-3 p-2.5 bg-blue-50 border border-blue-300 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>💡 Información:</strong> El profesional con más atenciones es{' '}
                  <strong>{estadisticas.topProfesionales[0]?.profesional}</strong> con{' '}
                  <strong>{estadisticas.topProfesionales[0]?.total}</strong> controles.
                </p>
              </div>
            </div>

            {/* Tabla de Especialidades */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-300 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-700" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Todas las Especialidades
                  </h3>
                </div>
                <span className="text-xs bg-green-200 text-green-800 px-2.5 py-1 rounded-full font-semibold">
                  {especialidades.length} especialidades
                </span>
              </div>

              <div className="bg-white/80 rounded-lg max-h-96 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-white border-b border-gray-200">
                    <tr>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">#</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Especialidad</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-600">Total</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-600">PCP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {especialidades.map((esp, index) => {
                      const data = resultados.porEspecialidad[esp];
                      const total = data.normal.length + data.pcp.length;
                      return (
                        <tr key={index} className="hover:bg-green-50 transition-colors">
                          <td className="py-2 px-3">
                            <div className="flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full text-xs font-bold">
                              {index + 1}
                            </div>
                          </td>
                          <td className="py-2 px-3 font-semibold text-gray-900">
                            {esp.trim()}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className="inline-flex px-2.5 py-1 bg-gray-100 text-gray-900 rounded-full font-bold">
                              {total}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center">
                            {data.pcp.length > 0 ? (
                              <span className="inline-flex px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-bold">
                                {data.pcp.length}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Nota informativa */}
              <div className="mt-3 p-2.5 bg-green-50 border border-green-300 rounded-lg">
                <p className="text-xs text-green-800">
                  <strong>📊 Estadística:</strong> Se procesaron controles de{' '}
                  <strong>{especialidades.length}</strong> especialidades diferentes, con un total de{' '}
                  <strong>{estadisticas.totalPCP}</strong> controles presenciales (PCP).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Los datos se procesan localmente en tu navegador y no se almacenan en ningún servidor
          </p>
        </div>
      </main>
    </div>
  );
}
