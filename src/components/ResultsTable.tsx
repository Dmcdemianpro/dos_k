'use client';

import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Resultado } from '@/types/resultado';
import { formatearRUT, formatearTelefono } from '@/lib/normalizador';
import { formatearFecha } from '@/lib/utils';

interface ResultsTableProps {
  resultados: Resultado[];
}

export default function ResultsTable({ resultados }: ResultsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrar resultados por búsqueda
  const filteredResults = resultados.filter(r =>
    r.RUT.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.NOMBRE_PACIENTE.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.PROFESIONAL.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = filteredResults.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header con búsqueda */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-gray-900">
            Pacientes a Notificar ({filteredResults.length})
          </h3>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por RUT, nombre o profesional..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset a primera página al buscar
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                RUT
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Profesional
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Teléfono Móvil
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Teléfono Fijo
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID Receta
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Fecha Receta
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentResults.map((resultado, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {formatearRUT(resultado.RUT)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {resultado.NOMBRE_PACIENTE}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {resultado.PROFESIONAL}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {resultado.TELEFONO_MOVIL ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                      {formatearTelefono(resultado.TELEFONO_MOVIL)}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">Sin teléfono</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {resultado.TELEFONO_FIJO ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                      {formatearTelefono(resultado.TELEFONO_FIJO)}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">Sin teléfono</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {resultado.ID_RECETA}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {formatearFecha(resultado.FECHA_RECETA)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostrando {startIndex + 1} - {Math.min(endIndex, filteredResults.length)} de {filteredResults.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-700 font-medium">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {filteredResults.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No se encontraron resultados para la búsqueda
        </div>
      )}
    </div>
  );
}
