'use client';

import React from 'react';
import { Users, FileText, Phone, PhoneCall } from 'lucide-react';
import type { Estadisticas } from '@/types/resultado';

interface StatsCardsProps {
  estadisticas: Estadisticas;
}

export default function StatsCards({ estadisticas }: StatsCardsProps) {
  const stats = [
    {
      label: 'PACIENTES',
      value: estadisticas.totalPacientes,
      icon: Users,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      label: 'RECETAS',
      value: estadisticas.totalRecetas,
      icon: FileText,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      label: 'CON MÓVIL',
      value: `${estadisticas.conMovil} (${estadisticas.porcentajeMovil}%)`,
      icon: Phone,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      label: 'CON FIJO',
      value: `${estadisticas.conFijo} (${estadisticas.porcentajeFijo}%)`,
      icon: PhoneCall,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.lightColor} rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-semibold ${stat.textColor} uppercase tracking-wide`}>
                {stat.label}
              </span>
              <div className={`${stat.color} rounded-full p-1.5`}>
                <Icon className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <p className={`text-xl font-bold ${stat.textColor}`}>
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
