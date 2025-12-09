import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { RegistroControlProcesado } from '@/types/controles';

interface ResultsTableProps {
  registros: RegistroControlProcesado[];
  titulo: string;
}

export default function ResultsTable({ registros, titulo }: ResultsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrar registros por búsqueda (usando los nombres con espacios)
  const registrosFiltrados = registros.filter(registro => {
    const nombrePaciente = String(registro['NOMBRE PACIENTE'] || '').toLowerCase();
    const run = String(registro['RUN'] || '').toLowerCase();
    const especialidad = String(registro['ESPECIALIDAD'] || '').toLowerCase();
    const search = searchTerm.toLowerCase();

    return nombrePaciente.includes(search) ||
           run.includes(search) ||
           especialidad.includes(search);
  });

  // Calcular paginación
  const totalPages = Math.ceil(registrosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const registrosPaginados = registrosFiltrados.slice(startIndex, endIndex);

  // Formatear fecha
  const formatearFecha = (fecha: Date | string): string => {
    if (!fecha) return '-';
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('es-CL');
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">
          {titulo} ({registrosFiltrados.length})
        </h3>

        {/* Buscador */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, RUT..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Fecha Control
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                RUN
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Especialidad
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Comuna
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                PCP
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {registrosPaginados.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No se encontraron registros
                </td>
              </tr>
            ) : (
              registrosPaginados.map((registro, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {formatearFecha(registro['FECHA PROXIMO CONTROL'])}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {registro['NOMBRE PACIENTE']}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-700">
                    {registro['RUN']}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {registro['ESPECIALIDAD']}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {registro['COMUNA']}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {registro['TELEFONO'] || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {registro['_PCP_'] ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Sí
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        No
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostrando {startIndex + 1} a {Math.min(endIndex, registrosFiltrados.length)} de {registrosFiltrados.length} registros
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
