'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { generarExcel } from '@/lib/recetas/procesador';
import { descargarArchivo } from '@/lib/utils';
import type { Resultado } from '@/types/recetas/resultado';

interface DownloadButtonProps {
  resultados: Resultado[];
}

export default function DownloadButton({ resultados }: DownloadButtonProps) {
  const handleDownload = () => {
    try {
      const buffer = generarExcel(resultados);
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const fecha = new Date().toISOString().split('T')[0];
      const nombreArchivo = `Planilla_Notificacion_Recetas_${fecha}.xlsx`;

      descargarArchivo(blob, nombreArchivo);
    } catch (error) {
      console.error('Error al generar Excel:', error);
      alert('Error al generar el archivo Excel');
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary-dark transition-colors shadow-md hover:shadow-lg"
    >
      <Download className="w-5 h-5" />
      Descargar Planilla Excel
    </button>
  );
}
