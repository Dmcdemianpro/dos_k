# 🛠️ GUÍA DE DESARROLLO - Sistema de Notificación de Recetas

## Para desarrolladores que necesiten modificar o extender el sistema

---

## 📚 Conceptos Clave

### 1. Normalización de RUTs (CRÍTICO)

**Problema original:**
Los archivos tienen formatos diferentes de RUT que impiden el cruce directo:
- Dispensaciones: `258126041`, `13012870K` (sin guión)
- Citas: `6447300-K`, `18062050-8` (con guión)

**Solución implementada:**

```typescript
// src/lib/normalizador.ts
export function normalizarRUT(rut: string | number | null | undefined): string {
  if (!rut) return '';
  const rutStr = String(rut).trim().toUpperCase();
  return rutStr.replace(/[-.\s]/g, '');
}

// Ejemplos de uso:
normalizarRUT("12.345.678-9")  // → "123456789"
normalizarRUT("6447300-K")     // → "6447300K"
normalizarRUT(258126041)       // → "258126041"
```

**⚠️ IMPORTANTE:** Esta función es crítica. No modificar sin probar exhaustivamente.

---

## 🔄 Flujo de Datos

### 1. Usuario sube archivos (page.tsx)
```typescript
const handleProcesar = async () => {
  const formData = new FormData();
  formData.append('dispensaciones', archivoDispensaciones);
  formData.append('citas', archivoCitas);

  const response = await fetch('/api/procesar', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  // Guardar en sessionStorage y navegar a resultados
};
```

### 2. API procesa archivos (api/procesar/route.ts)
```typescript
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const archivoDispensaciones = formData.get('dispensaciones') as File;
  const archivoCitas = formData.get('citas') as File;

  // Validar archivos
  validarArchivoExcel(archivoDispensaciones);

  // Procesar
  const { resultados, estadisticas } = await procesarArchivos(
    archivoDispensaciones,
    archivoCitas
  );

  return NextResponse.json({ success: true, resultados, estadisticas });
}
```

### 3. Procesador principal (lib/procesador.ts)
```typescript
export async function procesarArchivos(
  archivoDispensaciones: File,
  archivoCitas: File
) {
  // 1. Leer archivos con SheetJS
  const wbDispensaciones = XLSX.read(await archivoDispensaciones.arrayBuffer());

  // 2. Normalizar y agrupar dispensaciones
  const recetasMap = new Map();
  dataDispensaciones.forEach(row => {
    const rutLimpio = normalizarRUT(row['RUT PACIENTE']);
    const key = `${rutLimpio}-${row['Id RECETA']}`;
    // Agrupar medicamentos de la misma receta
  });

  // 3. Filtrar solo citas validadas
  const citasValidadas = dataCitas
    .filter(row => row['Estado_Cita'] === 'Validada')
    .map(row => ({
      RUT_LIMPIO: normalizarRUT(row['Run_Paciente']),
      // ...otros campos
    }));

  // 4. Cruzar por RUT
  const resultados = recetas
    .filter(receta =>
      citasValidadas.find(cita => cita.RUT_LIMPIO === receta.RUT_LIMPIO)
    );

  // 5. Calcular estadísticas
  // ...

  return { resultados, estadisticas };
}
```

---

## 🎨 Cómo Modificar el Diseño

### Cambiar Colores Principales

**Opción 1: Variables CSS** (globals.css)
```css
:root {
  --primary: #1976D2;      /* Azul principal */
  --secondary: #388E3C;    /* Verde secundario */
  --error: #D32F2F;        /* Rojo error */
  /* Cambiar estos valores */
}
```

**Opción 2: Tailwind Config** (tailwind.config.ts)
```typescript
extend: {
  colors: {
    primary: {
      DEFAULT: '#1976D2',  // Cambiar aquí
      dark: '#1565C0',
      light: '#42A5F5',
    },
  },
}
```

### Agregar Nuevas Estadísticas

**1. Modificar interfaz** (types/resultado.ts)
```typescript
export interface Estadisticas {
  totalPacientes: number;
  totalRecetas: number;
  // Agregar nuevo campo:
  recetasUrgentes: number;
}
```

**2. Calcular en procesador** (lib/procesador.ts)
```typescript
const estadisticas: Estadisticas = {
  totalPacientes: pacientesUnicos,
  totalRecetas: resultados.length,
  // Calcular nuevo campo:
  recetasUrgentes: resultados.filter(r => esUrgente(r)).length,
};
```

**3. Mostrar en UI** (components/StatsCards.tsx)
```typescript
const stats = [
  // Stats existentes...
  {
    label: 'URGENTES',
    value: estadisticas.recetasUrgentes,
    icon: AlertCircle,
    color: 'bg-red-500',
    lightColor: 'bg-red-50',
    textColor: 'text-red-700'
  }
];
```

---

## 📊 Agregar Nuevas Columnas al Excel

**Modificar generarExcel** (lib/procesador.ts)
```typescript
export function generarExcel(resultados: Resultado[]): ArrayBuffer {
  const datosExport = resultados.map(r => ({
    'RUT': r.RUT,
    'NOMBRE': r.NOMBRE_PACIENTE_RECETA,
    // Agregar nueva columna:
    'EMAIL': r.EMAIL || 'Sin email',
    // ...resto de columnas
  }));

  const ws = XLSX.utils.json_to_sheet(datosExport);

  // Actualizar anchos de columnas
  const columnWidths = [
    { wch: 12 }, // RUT
    { wch: 30 }, // NOMBRE
    { wch: 25 }, // EMAIL (nuevo)
    // ...resto
  ];
  ws['!cols'] = columnWidths;

  // ...resto del código
}
```

---

## 🔧 Agregar Validaciones Personalizadas

**Crear función de validación** (lib/validador.ts)
```typescript
export function validarArchivoDispensaciones(archivo: File): {
  valido: boolean;
  errores: string[];
} {
  const errores: string[] = [];

  // Validar nombre de archivo
  if (!archivo.name.includes('dispensaciones')) {
    errores.push('El archivo debe contener "dispensaciones" en su nombre');
  }

  // Validar tamaño
  if (archivo.size > 10 * 1024 * 1024) {
    errores.push('El archivo no debe exceder 10MB');
  }

  return {
    valido: errores.length === 0,
    errores
  };
}
```

**Usar en la página** (app/page.tsx)
```typescript
const handleProcesar = async () => {
  // Validar antes de enviar
  const validacion = validarArchivoDispensaciones(archivoDispensaciones);

  if (!validacion.valido) {
    setError(validacion.errores.join(', '));
    return;
  }

  // Continuar con el procesamiento...
};
```

---

## 🔍 Agregar Filtros a la Tabla

**Modificar ResultsTable** (components/ResultsTable.tsx)
```typescript
export default function ResultsTable({ resultados }: ResultsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroProfesional, setFiltroProfesional] = useState('');

  // Obtener lista única de profesionales
  const profesionales = [...new Set(resultados.map(r => r.PROFESIONAL))];

  // Aplicar filtros
  const filteredResults = resultados.filter(r => {
    const matchSearch = r.RUT.includes(searchTerm) ||
                       r.NOMBRE_PACIENTE_RECETA.includes(searchTerm);
    const matchProfesional = !filtroProfesional ||
                            r.PROFESIONAL === filtroProfesional;
    return matchSearch && matchProfesional;
  });

  return (
    <div>
      {/* Filtro por profesional */}
      <select
        value={filtroProfesional}
        onChange={(e) => setFiltroProfesional(e.target.value)}
      >
        <option value="">Todos los profesionales</option>
        {profesionales.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {/* Resto del componente... */}
    </div>
  );
}
```

---

## 📧 Integrar Notificaciones por Email

**Crear nuevo endpoint** (app/api/enviar-email/route.ts)
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { paciente, receta } = await request.json();

  // Usar servicio de email (ej: SendGrid, AWS SES)
  const resultado = await enviarEmail({
    to: paciente.email,
    subject: 'Tienes una receta disponible',
    body: `
      Estimado/a ${paciente.nombre},

      Tienes disponible la receta #${receta.id} con los siguientes medicamentos:
      ${receta.medicamentos}

      Puedes retirarlos en nuestras instalaciones.
    `
  });

  return NextResponse.json({ success: true });
}
```

**Agregar botón en ResultsTable**
```typescript
<button
  onClick={() => enviarNotificacion(resultado)}
  className="px-3 py-1 bg-blue-500 text-white rounded"
>
  Enviar Email
</button>
```

---

## 💾 Guardar Historial en Base de Datos

**Instalar Prisma**
```bash
npm install prisma @prisma/client
npx prisma init
```

**Definir schema** (prisma/schema.prisma)
```prisma
model Procesamiento {
  id              Int      @id @default(autoincrement())
  fechaProceso    DateTime @default(now())
  totalPacientes  Int
  totalRecetas    Int
  archivo         String
  resultados      Json
  createdAt       DateTime @default(now())
}
```

**Guardar en API** (app/api/procesar/route.ts)
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  // Procesar archivos...
  const { resultados, estadisticas } = await procesarArchivos(...);

  // Guardar en BD
  await prisma.procesamiento.create({
    data: {
      totalPacientes: estadisticas.totalPacientes,
      totalRecetas: estadisticas.totalRecetas,
      archivo: archivoDispensaciones.name,
      resultados: resultados,
    }
  });

  // Retornar...
}
```

---

## 📱 Agregar Notificaciones WhatsApp

**Usar WhatsApp Business API**
```typescript
// lib/whatsapp.ts
export async function enviarWhatsApp(telefono: string, mensaje: string) {
  const response = await fetch('https://api.whatsapp.com/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: telefono,
      type: 'text',
      text: { body: mensaje }
    })
  });

  return response.json();
}
```

**Integrar en botón**
```typescript
const handleEnviarWhatsApp = async (resultado: Resultado) => {
  const mensaje = `
    Hola ${resultado.NOMBRE_PACIENTE_RECETA},

    Tienes disponible la receta #${resultado.ID_RECETA}.
    Medicamentos: ${resultado.MEDICAMENTOS}

    Puedes retirarlos en nuestras instalaciones.
  `;

  await enviarWhatsApp(resultado.TELEFONO_MOVIL, mensaje);
};
```

---

## 🧪 Agregar Tests

**Instalar Jest y Testing Library**
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

**Test de normalización** (lib/__tests__/normalizador.test.ts)
```typescript
import { normalizarRUT } from '../normalizador';

describe('normalizarRUT', () => {
  it('debe normalizar RUT con guión', () => {
    expect(normalizarRUT('12.345.678-9')).toBe('123456789');
  });

  it('debe normalizar RUT con K', () => {
    expect(normalizarRUT('6447300-K')).toBe('6447300K');
  });

  it('debe manejar RUT sin formato', () => {
    expect(normalizarRUT('258126041')).toBe('258126041');
  });

  it('debe manejar valores nulos', () => {
    expect(normalizarRUT(null)).toBe('');
  });
});
```

**Test de componente** (components/__tests__/StatsCards.test.tsx)
```typescript
import { render, screen } from '@testing-library/react';
import StatsCards from '../StatsCards';

const mockEstadisticas = {
  totalPacientes: 26,
  totalRecetas: 29,
  conMovil: 24,
  conFijo: 21,
  porcentajeMovil: 92,
  porcentajeFijo: 81,
  topProfesionales: []
};

describe('StatsCards', () => {
  it('debe mostrar el total de pacientes', () => {
    render(<StatsCards estadisticas={mockEstadisticas} />);
    expect(screen.getByText('26')).toBeInTheDocument();
  });

  it('debe mostrar el porcentaje de móviles', () => {
    render(<StatsCards estadisticas={mockEstadisticas} />);
    expect(screen.getByText(/92%/)).toBeInTheDocument();
  });
});
```

---

## 🔐 Agregar Autenticación

**Instalar NextAuth**
```bash
npm install next-auth
```

**Configurar** (app/api/auth/[...nextauth]/route.ts)
```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        username: { type: 'text' },
        password: { type: 'password' }
      },
      async authorize(credentials) {
        // Validar credenciales contra BD
        if (credentials.username === 'admin' &&
            credentials.password === 'password') {
          return { id: 1, name: 'Admin' };
        }
        return null;
      }
    })
  ]
});

export { handler as GET, handler as POST };
```

**Proteger rutas** (app/page.tsx)
```typescript
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const { data: session } = useSession();

  if (!session) {
    return <div>Acceso denegado. Por favor inicia sesión.</div>;
  }

  // Resto del componente...
}
```

---

## 📊 Dashboard con Métricas

**Crear nueva página** (app/dashboard/page.tsx)
```typescript
'use client';

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [metricas, setMetricas] = useState(null);

  useEffect(() => {
    // Cargar métricas desde BD
    fetch('/api/metricas')
      .then(res => res.json())
      .then(setMetricas);
  }, []);

  return (
    <div>
      <h1>Dashboard de Métricas</h1>
      {/* Gráficos con Chart.js o Recharts */}
      <div>
        <h2>Procesamiento por mes</h2>
        {/* Gráfico de barras */}
      </div>
      <div>
        <h2>Top profesionales histórico</h2>
        {/* Gráfico de pastel */}
      </div>
    </div>
  );
}
```

---

## 🚀 Mejores Prácticas

### 1. Manejo de Errores
```typescript
try {
  const resultado = await procesarArchivos(file1, file2);
  return resultado;
} catch (error) {
  console.error('Error detallado:', error);

  if (error instanceof ArchivoInvalidoError) {
    return { error: 'Archivo inválido', detalles: error.message };
  }

  return { error: 'Error desconocido' };
}
```

### 2. Logging
```typescript
console.log(`📊 Dispensaciones leídas: ${count}`);
console.log(`✅ Citas validadas: ${count}`);
console.log(`🎯 Resultados: ${count}`);
```

### 3. Tipos TypeScript
```typescript
// Siempre define tipos para props
interface MiComponenteProps {
  datos: Resultado[];
  onAccion: (id: number) => void;
}

export default function MiComponente({ datos, onAccion }: MiComponenteProps) {
  // ...
}
```

### 4. Comentarios
```typescript
/**
 * Normaliza un RUT chileno eliminando guiones, puntos y espacios
 *
 * @param rut - RUT en cualquier formato
 * @returns RUT normalizado sin caracteres especiales
 *
 * @example
 * normalizarRUT("12.345.678-9") // "123456789"
 */
export function normalizarRUT(rut: string): string {
  // Implementación...
}
```

---

## 📚 Recursos Adicionales

- **Next.js Docs**: https://nextjs.org/docs
- **SheetJS Docs**: https://docs.sheetjs.com/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

**Esta guía cubre los escenarios más comunes de modificación y extensión del sistema.**
