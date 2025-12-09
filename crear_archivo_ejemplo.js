/**
 * Script para crear un archivo Excel de ejemplo
 * para probar el módulo de controles de telemedicina
 */

const XLSX = require('xlsx');

// Datos de ejemplo simulando el informe de producción ambulatoria
const datosEjemplo = [
  // Fila 1: Título
  ['INFORME DE PRODUCCIÓN AMBULATORIO CON DIRECCION'],
  // Fila 2: Headers (índice 2 en el procesador)
  [
    'FECHA CITA',
    'HORA CITA',
    'FECHA ATENCION',
    'HORA ATENCION',
    'ESPECIALIDAD',
    'CONSULTA',
    'AGENDA',
    'TIPO DE CONSULTA PROGRAMADA',
    'TIPO DE CONSULTA CITADA',
    'NOMBRE PACIENTE',
    'RUN',
    'TELEFONO',
    'COMUNA',
    'ESTADO ATENCION',
    'RESPONSABLE CITACION',
    'FECHA PROXIMO CONTROL',
    'EXAMEN DE ENDOSCOPIA SOLICITADO DURANTE LA ATE...',
    'EXAMEN DE IMAGENOLOGIA SOLICITADO DURANTE LA A...',
    'EXAMEN DE LABORATORIO SOLICITADO DURANTE LA AT...',
    'EXAMEN DE OTRAS PRUEBAS SOLICITADO DURANTE LA ...',
    'Observaciones'
  ],
  // Datos de ejemplo
  [
    '05-12-2025', '10:00', '05-12-2025', '10:15',
    'Cardiología', 'TELEMEDICINA CONTROL', 'AGENDA CARDIOLOGIA',
    'Control', 'Control',
    'Juan Pérez González', '12.345.678-9', '987654321',
    'Maipu', 'PACIENTE ATENDIDO', 'Dr. García',
    '10-01-2026',
    '', 'Electrocardiograma', 'Hemograma completo', '', 'Paciente controlado'
  ],
  [
    '06-12-2025', '11:00', '06-12-2025', '11:20',
    'Diabetología', 'TELEMEDICINA', 'AGENDA DIABETES',
    'Control', 'Control',
    'María González López', '23.456.789-0', '965432187',
    'Cerrillos', 'PACIENTE ATENDIDO', 'Dra. Martínez',
    '15-01-2026',
    '', '', 'Glicemia, HbA1c', '', 'Control diabetes'
  ],
  [
    '07-12-2025', '14:00', '07-12-2025', '14:30',
    'Medicina Interna', 'BR TELEMEDICINA', 'AGENDA MEDICINA',
    'Control', 'Control',
    'Pedro Sánchez Rojas', '34.567.890-1', '956781234',
    'Santiago', 'PACIENTE ATENDIDO', 'Dr. López',
    '20-01-2026',
    '', 'Rx Tórax', '', '', 'Derivado de SAPU'
  ],
  [
    '08-12-2025', '09:00', '08-12-2025', '09:15',
    'Neurología Adulto', 'TELEMEDICINA CONTROL', 'AGENDA NEUROLOGIA',
    'Control', 'Control',
    'Ana Torres Muñoz', '45.678.901-2', '978123456',
    'Maipu', 'PACIENTE ATENDIDO', 'Dra. Silva',
    '', // Sin fecha - dado de alta
    '', '', '', '', 'Alta médica'
  ],
  [
    '09-12-2025', '15:00', '', '',
    'Gastroenterología', 'TELEMEDICINA', 'AGENDA GASTRO',
    'Control', 'Control',
    'Carlos Ramírez Díaz', '56.789.012-3', '943567890',
    'Maipu', 'NO ASISTE', 'Dr. Morales',
    '25-01-2026',
    'Endoscopia digestiva', '', '', '', 'No asistió a control'
  ],
  [
    '10-12-2025', '10:30', '10-12-2025', '10:45',
    'Endocrinología', 'TELECONTROL', 'AGENDA ENDOCRINO',
    'Control', 'Control',
    'Laura Fernández Castro', '67.890.123-4', '932456789',
    'Cerrillos', 'PACIENTE ATENDIDO', 'Dra. Vega',
    '05-02-2026',
    '', 'Ecografía tiroides', 'TSH, T4 libre', '', 'Control tiroides'
  ],
  [
    '11-12-2025', '11:30', '11-12-2025', '11:50',
    'Fisiatría', 'TELEMEDICINA EXTRA', 'AGENDA FISIATRA',
    'Control', 'Control',
    'Roberto Jiménez Soto', '78.901.234-5', '921345678',
    'Pudahuel', 'PACIENTE ATENDIDO', 'Dr. Navarro',
    '12-02-2026',
    '', 'Rx columna', '', '', 'Derivado traumatología'
  ],
  [
    '12-12-2025', '13:00', '12-12-2025', '13:25',
    'Pediatría', 'TELEMEDICINA', 'AGENDA PEDIATRIA',
    'Control', 'Control',
    'Sofía Morales Herrera', '89.012.345-6', '910234567',
    'Maipu', 'PACIENTE ATENDIDO', 'Dra. Campos',
    '08-01-2026',
    '', '', 'Hemograma', '', 'Control niño sano'
  ],
  [
    '13-12-2025', '14:30', '13-12-2025', '14:50',
    'Urología', 'BR TELEMEDICINA', 'AGENDA UROLOGIA',
    'Control', 'Control',
    'Diego Vargas Reyes', '90.123.456-7', '998765432',
    'Cerrillos', 'PACIENTE ATENDIDO', 'Dr. Rojas',
    '18-01-2026',
    '', 'Ecografía renal', 'Creatinina, Urea', '', 'Control post operatorio'
  ],
  [
    '14-12-2025', '16:00', '', '',
    'Cardiología', 'TELEMEDICINA CONTROL', 'AGENDA CARDIOLOGIA',
    'Control', 'Control',
    'Isabel Cruz Pinto', '01.234.567-8', '987123456',
    'Maipu', 'NO ASISTE', 'Dr. García',
    '22-01-2026',
    '', 'Holter 24hrs', '', '', 'No contactado'
  ],
  // Registro duplicado (mismo RUT que el primero)
  [
    '15-12-2025', '10:00', '15-12-2025', '10:20',
    'Cardiología', 'TELEMEDICINA', 'AGENDA CARDIOLOGIA',
    'Control', 'Control',
    'Juan Pérez González', '12.345.678-9', '987654321',
    'Maipu', 'PACIENTE ATENDIDO', 'Dr. García',
    '05-01-2026', // Fecha más cercana que el registro anterior
    '', '', '', 'Ecocardiograma', 'Examen adicional solicitado'
  ]
];

// Crear workbook
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(datosEjemplo);

// Ajustar ancho de columnas
const colWidths = [
  { wch: 12 }, { wch: 10 }, { wch: 15 }, { wch: 10 },
  { wch: 25 }, { wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
  { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 },
  { wch: 25 }, { wch: 18 }, { wch: 30 }, { wch: 30 }, { wch: 30 },
  { wch: 30 }, { wch: 40 }
];
ws['!cols'] = colWidths;

// Agregar worksheet al workbook
XLSX.utils.book_append_sheet(wb, ws, 'Producción');

// Guardar archivo
XLSX.writeFile(wb, 'INFORME_PRODUCCIÓN_AMBULATORIO_EJEMPLO.xlsx');

console.log('✅ Archivo de ejemplo creado: INFORME_PRODUCCIÓN_AMBULATORIO_EJEMPLO.xlsx');
console.log('📊 Contiene 12 registros de ejemplo:');
console.log('   • 7 Controles Programados (Maipu/Cerrillos con fecha)');
console.log('   • 1 Dado de Alta (sin fecha de control)');
console.log('   • 1 Otra Comuna (Pudahuel/Santiago)');
console.log('   • 2 Inasistencias (NO ASISTE)');
console.log('   • 1 Registro duplicado (para probar eliminación)');
console.log('');
console.log('🎯 Especialidades incluidas:');
console.log('   • Cardiología, Diabetología, Medicina Interna');
console.log('   • Neurología Adulto, Gastroenterología, Endocrinología');
console.log('   • Fisiatría, Pediatría, Urología');
