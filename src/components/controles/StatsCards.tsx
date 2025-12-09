import React from 'react';
import { ClipboardCheck, UserCheck, MapPin, FileSpreadsheet } from 'lucide-react';
import type { EstadisticasControles } from '@/types/controles';

interface StatsCardsProps {
  estadisticas: EstadisticasControles;
}

export default function StatsCards({ estadisticas }: StatsCardsProps) {
  const stats = [
    {
      label: 'Total Registros',
      value: estadisticas.totalRegistros,
      icon: ClipboardCheck,
      color: 'bg-green-100 text-green-600',
      borderColor: 'border-green-200'
    },
    {
      label: 'Controles Presenciales (PCP)',
      value: estadisticas.totalPCP,
      icon: UserCheck,
      color: 'bg-blue-100 text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Otras Comunas',
      value: estadisticas.totalOtrasComunas,
      icon: MapPin,
      color: 'bg-yellow-100 text-yellow-600',
      borderColor: 'border-yellow-200'
    },
    {
      label: 'Hojas Generadas',
      value: estadisticas.totalHojas,
      icon: FileSpreadsheet,
      color: 'bg-purple-100 text-purple-600',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`bg-white rounded-xl border-2 ${stat.borderColor} p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                {stat.label}
              </span>
              <div className={`${stat.color} rounded-lg p-2 shadow-sm`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stat.value.toLocaleString('es-CL')}
            </div>
          </div>
        );
      })}
    </div>
  );
}
