'use client';

import React from 'react';
import { Award, Users } from 'lucide-react';
import type { ProfesionalCount } from '@/types/recetas/resultado';

interface TopProfesionalesProps {
  profesionales: ProfesionalCount[];
}

export default function TopProfesionales({ profesionales }: TopProfesionalesProps) {
  if (profesionales.length === 0) return null;

  // Calcular total de recetas
  const totalRecetas = profesionales.reduce((sum, prof) => sum + prof.cantidad, 0);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Award className="w-5 h-5 text-yellow-500" />
          <h3 className="text-base font-bold text-gray-900">
            Profesionales
          </h3>
        </div>
        <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
          <Users className="w-3 h-3 text-gray-600" />
          <span className="font-semibold text-gray-700">{profesionales.length}</span>
        </div>
      </div>

      {/* Estadística total */}
      <div className="mb-3 p-2.5 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs text-blue-700 font-medium mb-0.5">Total de recetas</div>
        <div className="text-xl font-bold text-blue-900">{totalRecetas}</div>
      </div>

      {/* Lista scrolleable */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1" style={{ maxHeight: '350px' }}>
        {profesionales.map((prof, index) => {
          const porcentaje = ((prof.cantidad / totalRecetas) * 100).toFixed(1);
          return (
            <div
              key={index}
              className="group relative"
            >
              {/* Barra de progreso de fondo */}
              <div className="absolute inset-0 bg-gray-100 rounded-lg">
                <div
                  className="h-full rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 transition-all duration-500"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>

              {/* Contenido */}
              <div className="relative flex items-center justify-between p-2 rounded-lg hover:bg-white/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`
                    flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs flex-shrink-0
                    ${index === 0 ? 'bg-yellow-400 text-yellow-900 ring-2 ring-yellow-500' :
                      index === 1 ? 'bg-gray-300 text-gray-700 ring-2 ring-gray-400' :
                      index === 2 ? 'bg-orange-300 text-orange-900 ring-2 ring-orange-400' :
                      'bg-blue-100 text-blue-700'}
                  `}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-xs truncate">
                      {prof.profesional}
                    </div>
                    <div className="text-xs text-gray-500">
                      {porcentaje}%
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary text-white font-semibold text-xs">
                    {prof.cantidad}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leyenda */}
      {profesionales.length > 3 && (
        <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500 text-center">
          {profesionales.length} profesionales
        </div>
      )}
    </div>
  );
}
