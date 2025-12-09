'use client';

import Link from 'next/link';
import { Hospital, Pill, ClipboardList, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-lg p-2">
              <Hospital className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sistema de Automatización - Telemedicina HEC
              </h1>
              <p className="text-sm text-gray-600">
                Herramientas para optimizar procesos de atención
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Selecciona el módulo que necesitas
          </h2>
          <p className="text-lg text-gray-600">
            Elige entre nuestros sistemas automatizados para gestionar recetas o controles médicos
          </p>
        </div>

        {/* Módulos Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Módulo 1: Recetas */}
          <Link href="/recetas" className="block group">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 rounded-lg p-3 group-hover:bg-blue-200 transition-colors">
                  <Pill className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Recetas</h3>
              </div>

              <p className="text-gray-600 mb-6">
                Cruza datos de recetas de dispensación con atenciones de telemedicina para identificar pacientes a notificar
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                  <span>Identifica pacientes que requieren notificación</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                  <span>Genera planilla con datos de contacto</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                  <span>Normalización automática de RUTs</span>
                </div>
              </div>

              <div className="flex items-center justify-end text-blue-600 font-semibold group-hover:gap-3 transition-all">
                <span>Acceder al módulo</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Módulo 2: Controles */}
          <Link href="/controles" className="block group">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 rounded-lg p-3 group-hover:bg-green-200 transition-colors">
                  <ClipboardList className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Controles de Telemedicina</h3>
              </div>

              <p className="text-gray-600 mb-6">
                Procesa el informe de producción ambulatoria para generar registro de controles médicos programados
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0"></div>
                  <span>Filtra por especialidad y tipo de consulta</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0"></div>
                  <span>Separa por estado y ubicación del paciente</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0"></div>
                  <span>Genera 4 hojas con categorización automática</span>
                </div>
              </div>

              <div className="flex items-center justify-end text-green-600 font-semibold group-hover:gap-3 transition-all">
                <span>Acceder al módulo</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 max-w-3xl mx-auto">
            <h4 className="font-semibold text-gray-900 mb-2">
              Acerca de este sistema
            </h4>
            <p className="text-sm text-gray-600">
              Sistema desarrollado para automatizar y optimizar los procesos de gestión de telemedicina del Hospital El Carmen.
              Cada módulo está diseñado para simplificar tareas específicas y mejorar la eficiencia del personal de salud.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
