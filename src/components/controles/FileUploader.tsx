'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  accept?: string;
  label: string;
  description: string;
}

export default function FileUploader({
  onFileSelect,
  selectedFile,
  accept = '.xlsx,.xls',
  label,
  description
}: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Mensajes de error */}
      {fileRejections.length > 0 && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-semibold text-red-900 mb-1">Error al cargar archivo:</p>
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name} className="text-xs text-red-700">
              {errors.map(e => (
                <p key={e.code}>
                  {e.code === 'file-too-large'
                    ? `El archivo es demasiado grande (máx. 50 MB)`
                    : e.code === 'file-invalid-type'
                    ? 'Tipo de archivo no válido (solo .xlsx o .xls)'
                    : e.message}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}

      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragActive
            ? 'border-green-500 bg-green-50 scale-[1.02]'
            : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
          }
          ${selectedFile ? 'bg-green-50 border-green-400' : ''}
        `}
      >
        <input {...getInputProps()} />

        {!selectedFile ? (
          <div className="flex flex-col items-center gap-2">
            <Upload className={`w-12 h-12 ${isDragActive ? 'text-green-600' : 'text-gray-400'}`} />
            <p className="text-sm text-gray-600 font-medium">
              {isDragActive ? '¡Suelta el archivo aquí!' : 'Arrastra aquí o haz clic para seleccionar'}
            </p>
            <p className="text-xs text-gray-500">{description}</p>
            <p className="text-xs text-gray-400 mt-1">Formatos: .xlsx, .xls • Máx: 50 MB</p>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border-2 border-green-500">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-lg p-2">
                <File className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  <span className="mx-2">•</span>
                  <span className="text-green-600 font-medium">✓ Archivo cargado</span>
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-2 hover:bg-red-50 rounded-full transition-colors"
              type="button"
              title="Eliminar archivo"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
