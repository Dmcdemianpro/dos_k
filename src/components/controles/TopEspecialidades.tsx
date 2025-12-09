import React from 'react';
import { Award } from 'lucide-react';
import type { EstadisticasControles } from '@/types/controles';

interface TopEspecialidadesProps {
  estadisticas: EstadisticasControles;
}

export default function TopEspecialidades({ estadisticas }: TopEspecialidadesProps) {
  if (!estadisticas.topEspecialidades.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-2">
          <Award className="w-5 h-5 text-green-700" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          Top 10 Especialidades
        </h3>
      </div>

      <div className="space-y-4">
        {estadisticas.topEspecialidades.map((item, index) => {
          const porcentaje = estadisticas.totalRegistros > 0
            ? (item.total / estadisticas.totalRegistros) * 100
            : 0;

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full text-xs font-bold text-green-700">
                    {index + 1}
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {item.especialidad.trim()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-base">
                    {item.total}
                  </span>
                  {item.pcp > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                      {item.pcp} PCP
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 h-2.5 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${porcentaje}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
