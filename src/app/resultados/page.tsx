'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Hospital, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import StatsCards from '@/components/StatsCards';
import ResultsTable from '@/components/ResultsTable';
import DownloadButton from '@/components/DownloadButton';
import TopProfesionales from '@/components/TopProfesionales';
import type { Resultado, Estadisticas } from '@/types/resultado';

export default function ResultadosPage() {
  const router = useRouter();
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'resumen' | 'pacientes'>('resumen');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    // Cargar resultados desde sessionStorage
    const resultadosStr = sessionStorage.getItem('resultados');
    const estadisticasStr = sessionStorage.getItem('estadisticas');

    if (!resultadosStr || !estadisticasStr) {
      // No hay datos, redirigir a home
      router.push('/');
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
      router.push('/');
    }
  }, [router]);

  const handleNuevoProcesamiento = () => {
    // Limpiar sessionStorage y redirigir a home
    sessionStorage.removeItem('resultados');
    sessionStorage.removeItem('estadisticas');
    router.push('/');
  };

  if (isLoading || !estadisticas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-lg p-2">
                <Hospital className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Resultados del Procesamiento
                </h1>
                <p className="text-sm text-gray-600">
                  Pacientes con recetas disponibles y citas validadas
                </p>
              </div>
            </div>
            <button
              onClick={handleNuevoProcesamiento}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Procesar Nuevos Archivos
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-12 py-4">
        {/* Banner de éxito - Compacto */}
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-green-900">Procesamiento Completado:</span>
              <span className="text-sm text-green-800">
                <strong>{estadisticas.totalPacientes} pacientes</strong> con{' '}
                <strong>{estadisticas.totalRecetas} recetas</strong> disponibles
              </span>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-t-xl shadow-lg border border-gray-200 border-b-0">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('resumen')}
              className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'resumen'
                  ? 'text-primary border-b-2 border-primary bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Resumen y Estadísticas
            </button>
            <button
              onClick={() => setActiveTab('pacientes')}
              className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'pacientes'
                  ? 'text-primary border-b-2 border-primary bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Pacientes a Notificar ({resultados.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-xl shadow-lg border border-gray-200 p-4">
          {activeTab === 'resumen' && (
            <div className="space-y-4">
              {/* Estadísticas */}
              <StatsCards estadisticas={estadisticas} />

              {/* Grid de contenido */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Top Profesionales */}
                <div className="lg:col-span-1">
                  <TopProfesionales profesionales={estadisticas.topProfesionales} />
                </div>

                {/* Guía de Notificación */}
                <div className="lg:col-span-3">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-300 p-4 h-full">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-700" />
                        <h3 className="text-lg font-bold text-gray-900">
                          Guía de Notificación Telefónica
                        </h3>
                      </div>
                      <span className="text-xs bg-blue-200 text-blue-800 px-2.5 py-1 rounded-full font-semibold">
                        Protocolo de contacto
                      </span>
                    </div>

                    {/* Gráfico de Cobertura Telefónica */}
                    <div className="mb-3 p-3 bg-white/80 rounded-lg">
                      <h4 className="text-xs font-bold text-gray-900 mb-2">Cobertura Telefónica</h4>
                      <div className="space-y-2">
                        {/* Móvil */}
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                              <span className="text-xs font-medium text-gray-700">Móvil</span>
                            </div>
                            <span className="text-xs font-bold text-gray-900">
                              {estadisticas.conMovil} ({estadisticas.porcentajeMovil}%)
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 rounded-full"
                              style={{ width: `${estadisticas.porcentajeMovil}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Fijo */}
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                              <span className="text-xs font-medium text-gray-700">Fijo</span>
                            </div>
                            <span className="text-xs font-bold text-gray-900">
                              {estadisticas.conFijo} ({estadisticas.porcentajeFijo}%)
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 rounded-full"
                              style={{ width: `${estadisticas.porcentajeFijo}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progreso del Protocolo */}
                    <div className="mb-3 p-2.5 bg-white/80 rounded-lg">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-gray-700">Progreso</span>
                        <span className="text-xs font-bold text-primary">
                          {completedSteps.length}/4
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                              completedSteps.includes(step) ? 'bg-primary' : 'bg-gray-300'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>

                    {/* Pasos del protocolo - Interactivos */}
                    <div className="space-y-2">
                      {[
                        {
                          num: 1,
                          color: 'green',
                          title: 'Identificación',
                          script: '"Buenos días/tardes, hablo con [Nombre Paciente]? Llamo del centro de salud..."'
                        },
                        {
                          num: 2,
                          color: 'blue',
                          title: 'Información de Receta',
                          script: '"Le informo que tiene una receta médica disponible prescrita por el/la Dr(a). [Profesional]"'
                        },
                        {
                          num: 3,
                          color: 'purple',
                          title: 'Medicamentos y Retiro',
                          script: '"Los medicamentos son: [Ver columna MEDICAMENTOS]. Puede retirarlos en farmacia con su RUT"'
                        },
                        {
                          num: 4,
                          color: 'orange',
                          title: 'Registrar Llamada',
                          script: 'Anotar resultado del contacto en columna DESCRIPCION: "Contactado OK", "No contesta", "Teléfono erróneo", etc.'
                        }
                      ].map((step) => {
                        const isCompleted = completedSteps.includes(step.num);
                        return (
                          <div
                            key={step.num}
                            onClick={() => {
                              if (isCompleted) {
                                setCompletedSteps(completedSteps.filter(s => s !== step.num));
                              } else {
                                setCompletedSteps([...completedSteps, step.num]);
                              }
                            }}
                            className={`flex gap-2.5 p-2.5 bg-white rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md ${
                              isCompleted ? 'ring-2 ring-green-400' : ''
                            }`}
                          >
                            <div className={`flex items-center justify-center w-7 h-7 bg-${step.color}-500 text-white rounded-full text-xs font-bold flex-shrink-0 relative`}>
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                step.num
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-bold mb-0.5 text-sm ${isCompleted ? 'text-green-700' : 'text-gray-900'}`}>
                                {step.title}
                              </p>
                              <p className="text-xs text-gray-600 leading-snug">
                                {step.script}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Nota importante */}
                    <div className="mt-3 p-2.5 bg-yellow-50 border border-yellow-300 rounded-lg">
                      <p className="text-xs text-yellow-800">
                        <strong>💡 Tip:</strong> Prioriza llamar a pacientes del profesional <strong>{estadisticas.topProfesionales[0]?.profesional}</strong> ({estadisticas.topProfesionales[0]?.cantidad} recetas pendientes). Haz clic en cada paso para marcarlo como completado.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pacientes' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Pacientes a Notificar</h2>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Lista completa de pacientes con recetas disponibles
                  </p>
                </div>
                <div className="flex gap-3">
                  <DownloadButton resultados={resultados} />
                </div>
              </div>

              {/* Tabla de resultados */}
              <ResultsTable resultados={resultados} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>
            Los datos se procesan localmente en tu navegador y no se almacenan en ningún servidor
          </p>
        </div>
      </main>
    </div>
  );
}
