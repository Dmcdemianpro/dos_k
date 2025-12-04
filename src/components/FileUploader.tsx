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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragActive
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
          }
          ${selectedFile ? 'bg-green-50 border-green-300' : ''}
        `}
      >
        <input {...getInputProps()} />

        {!selectedFile ? (
          <div className="flex flex-col items-center gap-2">
            <Upload className={`w-12 h-12 ${isDragActive ? 'text-primary' : 'text-gray-400'}`} />
            <p className="text-sm text-gray-600 font-medium">
              {isDragActive ? '¡Suelta el archivo aquí!' : 'Arrastra aquí o haz clic para seleccionar'}
            </p>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <File className="w-8 h-8 text-green-600" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-2 hover:bg-red-50 rounded-full transition-colors"
              type="button"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
