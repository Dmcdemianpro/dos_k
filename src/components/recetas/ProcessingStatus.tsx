'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingStatusProps {
  message?: string;
}

export default function ProcessingStatus({ message = 'Procesando archivos...' }: ProcessingStatusProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <h3 className="text-xl font-bold text-gray-900">
            {message}
          </h3>
          <p className="text-sm text-gray-600 text-center">
            Estamos cruzando los datos de dispensaciones con las citas validadas.
            Esto puede tomar unos segundos...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-primary h-full rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
