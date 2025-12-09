import React from 'react';
import { Download } from 'lucide-react';
import { generarExcelControles } from '@/lib/controles/generador';
import type { ResultadosControles } from '@/types/controles';

interface DownloadButtonProps {
  resultados: ResultadosControles;
}

export default function DownloadButton({ resultados }: DownloadButtonProps) {
  const handleDownload = () => {
    try {
      // Generar Excel
      const buffer = generarExcelControles(resultados);

      // Crear blob y descargar
      // Crear blob y descargar
      const blob = new Blob([new Uint8Array(buffer.buffer)], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
});

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Nombre del archivo con fecha actual
      const fecha = new Date().toISOString().split('T')[0];
      link.download = `Control_Telemedicina_${fecha}.xlsx`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar archivo:', error);
      alert('Error al generar el archivo. Por favor, intente nuevamente.');
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
    >
      <Download className="w-5 h-5" />
      Descargar Excel Completo
    </button>
  );
}
