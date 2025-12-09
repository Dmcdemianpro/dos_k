# PROMPT: AGREGAR MÓDULO DE CONTROLES DE TELEMEDICINA AL PROYECTO dos_k

## 🎯 RUTA DEL PROYECTO

**UBICACIÓN**: `/Users/darioperez/Desktop/HEC/Proyecto Hec/Proyectos Tele/dos_k`

**IMPORTANTE**: Todo el trabajo se realizará dentro de esta carpeta del proyecto existente.

**Verificar ubicación antes de empezar**:
```bash
cd "/Users/darioperez/Desktop/HEC/Proyecto Hec/Proyectos Tele/dos_k"
pwd
ls -la
```

---

## 🎯 OBJETIVO

Agregar un **NUEVO MÓDULO INDEPENDIENTE** al proyecto existente `dos_k` para automatizar el procesamiento del "Informe de Producción Ambulatoria" y generar registro de controles de pacientes de Telemedicina.

**CRÍTICO**: Este módulo debe ser **COMPLETAMENTE INDEPENDIENTE** del módulo de recetas existente. Ambos módulos deben coexistir sin interferirse.

---

## 📂 CONTEXTO DEL PROYECTO ACTUAL

El proyecto `dos_k` ya tiene implementado un módulo de **cruce de recetas y telemedicina**:

```
dos_k/
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Página principal (recetas)
│   │   ├── api/procesar/         ← Procesa recetas
│   │   └── resultados/           ← Resultados recetas
│   ├── components/               ← Componentes del módulo recetas
│   ├── lib/
│   │   ├── procesador.ts         ← Procesador de recetas
│   │   └── normalizador.ts       ← Funciones compartidas
│   └── types/                    ← Types del módulo recetas
```

---

## 🆕 NUEVO MÓDULO A IMPLEMENTAR

### Nombre del módulo: `controles-telemedicina`

### Arquitectura Modular:

```
dos_k/
├── src/
│   ├── app/
│   │   ├── page.tsx                          ← Landing page (nueva - ver diseño)
│   │   ├── recetas/                          ← Módulo 1: Recetas (existente)
│   │   │   ├── page.tsx
│   │   │   ├── api/procesar/route.ts
│   │   │   └── resultados/page.tsx
│   │   └── controles/                        ← Módulo 2: Controles (NUEVO)
│   │       ├── page.tsx                      ← Upload de archivo ambulatoria
│   │       ├── api/procesar/route.ts         ← Procesamiento nuevo
│   │       └── resultados/page.tsx           ← Resultados con 4 pestañas
│   ├── components/
│   │   ├── recetas/                          ← Componentes módulo recetas
│   │   ├── controles/                        ← Componentes módulo controles (NUEVO)
│   │   └── shared/                           ← Componentes compartidos
│   ├── lib/
│   │   ├── recetas/                          ← Lógica módulo recetas
│   │   ├── controles/                        ← Lógica módulo controles (NUEVO)
│   │   └── shared/                           ← Utilidades compartidas (normalizar RUT, etc)
│   └── types/
│       ├── recetas/                          ← Types módulo recetas
│       └── controles/                        ← Types módulo controles (NUEVO)
```

---

## 📋 ESPECIFICACIÓN DEL NUEVO MÓDULO

### ENTRADA

**Archivo:** `INFORME_PRODUCCIÓN_AMBULATORIO_CON_DIRECCION.xlsx`

**Estructura:**
- Header en fila 2 (row index 2)
- 30,000+ registros
- 65 columnas
- Campo clave: `CONSULTA` (para filtrar telemedicina)

**Datos del archivo de ejemplo:**
- Total registros: 30,684
- Registros de Telemedicina: 3,128
- Comunas principales: Maipú (25,274), Cerrillos (3,526)
- Estados: PACIENTE ATENDIDO (25,759), NO SE PASO CONSULTA (3,379), NO ASISTE (1,545)

---

### PROCESO DE FILTRADO

#### 1. Filtrar por CONSULTA (solo médicas de Telemedicina)

Incluir registros donde el campo `CONSULTA` contenga:
- `TELEMEDICINA`
- `TELEMEDICINA CONTROL`
- `TELECONTROL`
- `BR TELEMEDICINA`
- `TELEMEDICINA EXTRA`
- `TELEMEDICINA POLI CHOQUE`
- `TELEMEDICINA PSICOTERAPIA`
- `TELEMEDICINA T.S`
- `TELEMEDICINA T.O`
- `TELEMEDICINA LEY IVE`

```typescript
const filtroConsultas = [
  'TELEMEDICINA',
  'TELECONTROL',
  'BR TELEMEDICINA',
  'TELEMEDICINA EXTRA'
];

const esTelemed = filtroConsultas.some(keyword => 
  consulta?.toString().toUpperCase().includes(keyword)
);
```

#### 2. Filtrar por ESPECIALIDAD

Incluir **solo** las siguientes especialidades:
- ARO - Broncopulmonar
- Cirugía Pediátrica - Broncopulmonar adulto
- Broncopulmonar infantil
- Cardiología
- Diabetología
- Endocrinología
- Fisiatría
- Gastroenterología
- Geriatría
- Ginecología - Urología
- Medicina Interna
- Neurología Adulto
- Neurología Pediátrica
- Pediatría
- Urología

```typescript
const especialidadesPermitidas = [
  'ARO - Broncopulmonar',
  'Cirugía Pediátrica - Broncopulmonar adulto',
  'Broncopulmonar infantil',
  'Cardiología',
  'Diabetología',
  'Endocrinología',
  'Fisiatría',
  'Gastroenterología',
  'Geriatría',
  'Ginecología - Urología',
  'Medicina Interna',
  'Neurología Adulto',
  'Neurología Pediátrica',
  'Pediatría',
  'Urología'
];
```

#### 3. Eliminar duplicados por solicitudes de exámenes

Si un paciente tiene **múltiples registros** solo por solicitudes de exámenes diferentes, consolidar en un solo registro manteniendo:
- El registro con `FECHA PROXIMO CONTROL` más cercana (si existe)
- Concatenar los exámenes en las columnas correspondientes

#### 4. Separar en 4 grupos

**HOJA 1: Pacientes para Control (principal)**
- `ESTADO ATENCION` == "PACIENTE ATENDIDO"
- `COMUNA` == "Maipu" OR "Cerrillos"
- Tiene `FECHA PROXIMO CONTROL` registrada

**HOJA 2: Pacientes Dados de Alta**
- Identificar por observaciones o campos que indiquen alta
- O pacientes sin `FECHA PROXIMO CONTROL` pero con estado "PACIENTE ATENDIDO"

**HOJA 3: Pacientes de Otras Comunas**
- `COMUNA` != "Maipu" AND != "Cerrillos"
- Cualquier estado de atención

**HOJA 4: Pacientes que No Asistieron**
- `ESTADO ATENCION` == "NO ASISTE"

#### 5. Ordenar por FECHA PROXIMO CONTROL

Dentro de cada grupo, ordenar ascendentemente por `FECHA PROXIMO CONTROL`.

---

### COLUMNAS A MANTENER EN EL EXCEL DE SALIDA

```typescript
const columnasSalida = [
  'FECHA ATENCION',
  'ESPECIALIDAD',
  'AGENDA',
  'TIPO DE CONSULTA CITADA',
  'NOMBRE PACIENTE',
  'RUN',
  'TELEFONO',
  'RESPONSABLE CITACION',
  'FECHA PROXIMO CONTROL',
  'EXAMEN DE ENDOSCOPIA',  // Campo: "EXAMEN DE ENDOSCOPIA SOLICITADO DURANTE LA ATE..."
  'EXAMEN DE IMAGENOLOGIA', // Campo: "EXAMEN DE IMAGENOLOGIA SOLICITADO DURANTE LA A..."
  'EXAMEN DE LABORATORIO',  // Campo: "EXAMEN DE LABORATORIO SOLICITADO DURANTE LA AT..."
  'EXAMEN DE OTRAS PRUEBAS', // Campo: "EXAMEN DE OTRAS PRUEBAS SOLICITADO DURANTE LA ..."
  'Observaciones'
];
```

---

### SALIDA

**Archivo Excel:** `Control_Telemedicina_[FECHA].xlsx`

**Estructura:**
- **Hoja 1:** "Controles Programados" (pacientes para control)
- **Hoja 2:** "Dados de Alta" (pacientes que ya no requieren control)
- **Hoja 3:** "Otras Comunas" (pacientes fuera de Maipú/Cerrillos)
- **Hoja 4:** "Inasistencias" (pacientes que no asistieron)

**Formato:**
- Headers en negrita
- Filtros automáticos en cada hoja
- Ancho de columnas ajustado
- Formato de fecha: DD-MM-YYYY
- Colores por hoja:
  - Hoja 1: Verde claro (#E8F5E9)
  - Hoja 2: Azul claro (#E3F2FD)
  - Hoja 3: Amarillo claro (#FFF9C4)
  - Hoja 4: Rojo claro (#FFEBEE)

---

## 🎨 DISEÑO DE INTERFAZ

### Landing Page (Nueva - app/page.tsx)

```
┌─────────────────────────────────────────────────────────┐
│  🏥 Sistema de Automatización - Telemedicina HEC        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Selecciona el módulo que necesitas:                   │
│                                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐   │
│  │  💊 RECETAS          │  │  📋 CONTROLES        │   │
│  │                      │  │                      │   │
│  │  Cruza datos de      │  │  Registro de         │   │
│  │  recetas con         │  │  controles de        │   │
│  │  atenciones de       │  │  pacientes           │   │
│  │  telemedicina        │  │  telemedicina        │   │
│  │                      │  │                      │   │
│  │  [ACCEDER]           │  │  [ACCEDER]           │   │
│  └──────────────────────┘  └──────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Página de Upload (app/controles/page.tsx)

```
┌─────────────────────────────────────────────────────────┐
│  📋 Control de Pacientes de Telemedicina                │
│  ← Volver al inicio                                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📤 PASO 1: Sube el Informe de Producción Ambulatoria  │
│  ┌───────────────────────────────────────────────────┐ │
│  │  [Arrastra aquí o haz clic para seleccionar]     │ │
│  │  INFORME_PRODUCCIÓN_AMBULATORIO_*.xlsx            │ │
│  └───────────────────────────────────────────────────┘ │
│  ✅ archivo_produccion.xlsx (1.5 MB)                   │
│                                                         │
│  [🚀 PROCESAR ARCHIVO]                                 │
│                                                         │
│  💡 El archivo debe incluir:                           │
│  • Citas de telemedicina del período                   │
│  • Especialidades médicas                              │
│  • Datos de contacto de pacientes                      │
│                                                         │
│  📥 Descargar plantilla de ejemplo                     │
└─────────────────────────────────────────────────────────┘
```

### Página de Resultados (app/controles/resultados/page.tsx)

```
┌─────────────────────────────────────────────────────────┐
│  🎉 Procesamiento Completado                            │
│  ← Procesar otro archivo                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📊 ESTADÍSTICAS GENERALES                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │ 245         │ │ 38          │ │ 12          │      │
│  │ CONTROLES   │ │ ALTAS       │ │ INASIST.    │      │
│  └─────────────┘ └─────────────┘ └─────────────┘      │
│                                                         │
│  📋 RESULTADOS POR CATEGORÍA                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [Controles] [Altas] [Otras Comunas] [Inasist.] │   │
│  ├─────────────────────────────────────────────────┤   │
│  │                                                 │   │
│  │  Mostrando: Controles Programados (245)        │   │
│  │                                                 │   │
│  │  [Buscar...] [Filtrar por especialidad ▼]      │   │
│  │                                                 │   │
│  │  Fecha     Nombre          Especialidad  Tel   │   │
│  │  ─────────────────────────────────────────────  │   │
│  │  05-12-25  Juan Pérez      Cardiología  958... │   │
│  │  06-12-25  María González  Diabetología 965... │   │
│  │  ...                                            │   │
│  │                                                 │   │
│  │  [← Anterior] Pág 1 de 10 [Siguiente →]        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [📥 DESCARGAR EXCEL COMPLETO]                         │
│                                                         │
│  👨‍⚕️ TOP 5 ESPECIALIDADES CON MÁS CONTROLES             │
│  1. Cardiología - 45 pacientes                         │
│  2. Diabetología - 38 pacientes                        │
│  3. Medicina Interna - 32 pacientes                    │
│  4. Neurología Adulto - 28 pacientes                   │
│  5. Gastroenterología - 25 pacientes                   │
└─────────────────────────────────────────────────────────┘
```

---

## 💻 IMPLEMENTACIÓN TÉCNICA

### 1. Crear estructura de carpetas

```bash
# Módulo controles
mkdir -p src/app/controles/api/procesar
mkdir -p src/app/controles/resultados
mkdir -p src/components/controles
mkdir -p src/lib/controles
mkdir -p src/types/controles

# Compartido
mkdir -p src/components/shared
mkdir -p src/lib/shared

# Reorganizar recetas
mkdir -p src/app/recetas/api/procesar
mkdir -p src/app/recetas/resultados
mkdir -p src/components/recetas
mkdir -p src/lib/recetas
mkdir -p src/types/recetas
```

### 2. Mover archivos existentes del módulo recetas

```bash
# Mover páginas
mv src/app/page.tsx src/app/recetas/page.tsx
mv src/app/api src/app/recetas/api
mv src/app/resultados src/app/recetas/resultados

# Mover componentes
mv src/components/* src/components/recetas/

# Mover lib
mv src/lib/procesador.ts src/lib/recetas/procesador.ts
mv src/lib/validador.ts src/lib/recetas/validador.ts

# Mover types
mv src/types/* src/types/recetas/

# Mantener compartido
mv src/lib/normalizador.ts src/lib/shared/normalizador.ts
```

### 3. Crear nueva Landing Page (src/app/page.tsx)

```typescript
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, ClipboardList } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏥 Sistema de Automatización - Telemedicina HEC
          </h1>
          <p className="text-lg text-gray-600">
            Selecciona el módulo que necesitas
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Módulo 1: Recetas */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Pill className="w-8 h-8 text-blue-600" />
                <CardTitle className="text-2xl">Recetas</CardTitle>
              </div>
              <CardDescription className="text-base">
                Cruza datos de recetas de dispensación con atenciones de telemedicina
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li>✓ Identifica pacientes a notificar</li>
                <li>✓ Genera planilla con datos de contacto</li>
                <li>✓ Normalización automática de RUTs</li>
              </ul>
              <Link href="/recetas">
                <Button className="w-full" size="lg">
                  Acceder al Módulo de Recetas
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Módulo 2: Controles */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <ClipboardList className="w-8 h-8 text-green-600" />
                <CardTitle className="text-2xl">Controles de Telemedicina</CardTitle>
              </div>
              <CardDescription className="text-base">
                Registro y gestión de controles de pacientes de telemedicina
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li>✓ Filtra por especialidad y tipo de consulta</li>
                <li>✓ Separa por estado y ubicación</li>
                <li>✓ Genera 4 hojas con categorización</li>
              </ul>
              <Link href="/controles">
                <Button className="w-full" size="lg" variant="secondary">
                  Acceder al Módulo de Controles
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Sistema desarrollado para optimizar procesos de Telemedicina</p>
        </footer>
      </div>
    </div>
  );
}
```

### 4. Types del módulo controles (src/types/controles/index.ts)

```typescript
export interface RegistroProduccionAmbulatoria {
  'FECHA CITA': string;
  'HORA CITA': string;
  'FECHA ATENCION': Date | string;
  'HORA ATENCION': string;
  'ESPECIALIDAD': string;
  'CONSULTA': string;
  'AGENDA': string;
  'TIPO DE CONSULTA PROGRAMADA': string;
  'TIPO DE CONSULTA CITADA': string;
  'NOMBRE PACIENTE': string;
  'RUN': string;
  'TELEFONO': string;
  'COMUNA': string;
  'ESTADO ATENCION': string;
  'RESPONSABLE CITACION': string;
  'FECHA PROXIMO CONTROL': Date | string;
  'EXAMEN DE ENDOSCOPIA SOLICITADO DURANTE LA ATE...': string;
  'EXAMEN DE IMAGENOLOGIA SOLICITADO DURANTE LA A...': string;
  'EXAMEN DE LABORATORIO SOLICITADO DURANTE LA AT...': string;
  'EXAMEN DE OTRAS PRUEBAS SOLICITADO DURANTE LA ...': string;
  'Observaciones': string;
}

export interface RegistroControlProcesado {
  FECHA_ATENCION: Date | string;
  ESPECIALIDAD: string;
  AGENDA: string;
  TIPO_CONSULTA: string;
  NOMBRE_PACIENTE: string;
  RUN: string;
  RUN_LIMPIO: string;
  TELEFONO: string;
  RESPONSABLE: string;
  FECHA_PROXIMO_CONTROL: Date | string;
  EXAMEN_ENDOSCOPIA: string;
  EXAMEN_IMAGENOLOGIA: string;
  EXAMEN_LABORATORIO: string;
  EXAMEN_OTRAS_PRUEBAS: string;
  OBSERVACIONES: string;
  COMUNA: string;
  ESTADO: string;
}

export interface ResultadosControles {
  controlesPrograma dos: RegistroControlProcesado[];
  dadosAlta: RegistroControlProcesado[];
  otrasComunas: RegistroControlProcesado[];
  inasistencias: RegistroControlProcesado[];
}

export interface EstadisticasControles {
  totalControles: number;
  totalAltas: number;
  totalOtrasComunas: number;
  totalInasistencias: number;
  topEspecialidades: Array<{ especialidad: string; cantidad: number }>;
}
```

### 5. Procesador del módulo controles (src/lib/controles/procesador.ts)

```typescript
import * as XLSX from 'xlsx';
import { normalizarRUT } from '../shared/normalizador';
import {
  RegistroProduccionAmbulatoria,
  RegistroControlProcesado,
  ResultadosControles,
  EstadisticasControles
} from '@/types/controles';

// Filtros de consulta
const CONSULTAS_TELEMEDICINA = [
  'TELEMEDICINA',
  'TELECONTROL',
  'BR TELEMEDICINA',
  'TELEMEDICINA EXTRA',
  'TELEMEDICINA CONTROL',
  'TELEMEDICINA POLI CHOQUE',
  'TELEMEDICINA PSICOTERAPIA',
  'TELEMEDICINA T.S',
  'TELEMEDICINA T.O',
  'TELEMEDICINA LEY IVE'
];

// Especialidades permitidas
const ESPECIALIDADES_PERMITIDAS = [
  'ARO - Broncopulmonar',
  'Cirugía Pediátrica - Broncopulmonar adulto',
  'Broncopulmonar infantil',
  'Cardiología',
  'Diabetología',
  'Endocrinología',
  'Fisiatría',
  'Gastroenterología',
  'Geriatría',
  'Ginecología - Urología',
  'Medicina Interna',
  'Neurología Adulto',
  'Neurología Pediátrica',
  'Pediatría',
  'Urología'
];

/**
 * Verifica si una consulta es de telemedicina
 */
function esConsultaTelemedicina(consulta: string): boolean {
  if (!consulta) return false;
  const consultaUpper = consulta.toString().toUpperCase();
  return CONSULTAS_TELEMEDICINA.some(keyword => consultaUpper.includes(keyword));
}

/**
 * Verifica si una especialidad está permitida
 */
function esEspecialidadPermitida(especialidad: string): boolean {
  if (!especialidad) return false;
  return ESPECIALIDADES_PERMITIDAS.some(esp => 
    especialidad.toString().trim().toUpperCase().includes(esp.toUpperCase())
  );
}

/**
 * Procesa el archivo de producción ambulatoria
 */
export async function procesarArchivoControles(
  archivo: File
): Promise<{ resultados: ResultadosControles; estadisticas: EstadisticasControles }> {
  
  // 1. Leer archivo Excel
  const buffer = await archivo.arrayBuffer();
  const workbook = XLSX.read(buffer);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  
  // 2. Convertir a JSON (header en fila 2, índice 2)
  const data = XLSX.utils.sheet_to_json(worksheet, { 
    range: 2,
    defval: '' 
  }) as RegistroProduccionAmbulatoria[];
  
  // 3. Filtrar por telemedicina y especialidad
  const registrosFiltrados = data.filter(row => {
    const esTelemedicina = esConsultaTelemedicina(row['CONSULTA']);
    const especialidadValida = esEspecialidadPermitida(row['ESPECIALIDAD']);
    return esTelemedicina && especialidadValida;
  });
  
  // 4. Procesar y normalizar registros
  const registrosProcesados = registrosFiltrados.map(row => {
    const registro: RegistroControlProcesado = {
      FECHA_ATENCION: row['FECHA ATENCION'] || '',
      ESPECIALIDAD: row['ESPECIALIDAD'] || '',
      AGENDA: row['AGENDA'] || '',
      TIPO_CONSULTA: row['TIPO DE CONSULTA CITADA'] || '',
      NOMBRE_PACIENTE: row['NOMBRE PACIENTE'] || '',
      RUN: row['RUN'] || '',
      RUN_LIMPIO: normalizarRUT(row['RUN']),
      TELEFONO: row['TELEFONO'] || '',
      RESPONSABLE: row['RESPONSABLE CITACION'] || '',
      FECHA_PROXIMO_CONTROL: row['FECHA PROXIMO CONTROL'] || '',
      EXAMEN_ENDOSCOPIA: row['EXAMEN DE ENDOSCOPIA SOLICITADO DURANTE LA ATE...'] || '',
      EXAMEN_IMAGENOLOGIA: row['EXAMEN DE IMAGENOLOGIA SOLICITADO DURANTE LA A...'] || '',
      EXAMEN_LABORATORIO: row['EXAMEN DE LABORATORIO SOLICITADO DURANTE LA AT...'] || '',
      EXAMEN_OTRAS_PRUEBAS: row['EXAMEN DE OTRAS PRUEBAS SOLICITADO DURANTE LA ...'] || '',
      OBSERVACIONES: row['Observaciones'] || '',
      COMUNA: row['COMUNA'] || '',
      ESTADO: row['ESTADO ATENCION'] || ''
    };
    return registro;
  });
  
  // 5. Eliminar duplicados por RUT (mantener el que tiene fecha de control más cercana)
  const registrosUnicos = eliminarDuplicadosPorRUT(registrosProcesados);
  
  // 6. Categorizar en 4 grupos
  const resultados: ResultadosControles = {
    controlesPrograma dos: registrosUnicos.filter(r => 
      r.ESTADO === 'PACIENTE ATENDIDO' &&
      (r.COMUNA.toUpperCase() === 'MAIPU' || r.COMUNA.toUpperCase() === 'CERRILLOS') &&
      r.FECHA_PROXIMO_CONTROL !== ''
    ).sort((a, b) => compareFechas(a.FECHA_PROXIMO_CONTROL, b.FECHA_PROXIMO_CONTROL)),
    
    dadosAlta: registrosUnicos.filter(r =>
      r.ESTADO === 'PACIENTE ATENDIDO' &&
      r.FECHA_PROXIMO_CONTROL === ''
    ),
    
    otrasComunas: registrosUnicos.filter(r =>
      r.COMUNA.toUpperCase() !== 'MAIPU' && r.COMUNA.toUpperCase() !== 'CERRILLOS'
    ).sort((a, b) => compareFechas(a.FECHA_PROXIMO_CONTROL, b.FECHA_PROXIMO_CONTROL)),
    
    inasistencias: registrosUnicos.filter(r =>
      r.ESTADO === 'NO ASISTE'
    ).sort((a, b) => compareFechas(a.FECHA_PROXIMO_CONTROL, b.FECHA_PROXIMO_CONTROL))
  };
  
  // 7. Calcular estadísticas
  const estadisticas = calcularEstadisticas(resultados);
  
  return { resultados, estadisticas };
}

/**
 * Elimina registros duplicados por RUT
 */
function eliminarDuplicadosPorRUT(
  registros: RegistroControlProcesado[]
): RegistroControlProcesado[] {
  const registrosPorRUT = new Map<string, RegistroControlProcesado>();
  
  registros.forEach(registro => {
    const rutLimpio = registro.RUN_LIMPIO;
    
    if (!registrosPorRUT.has(rutLimpio)) {
      registrosPorRUT.set(rutLimpio, registro);
    } else {
      // Si ya existe, mantener el que tiene fecha de control más cercana
      const existente = registrosPorRUT.get(rutLimpio)!;
      
      if (registro.FECHA_PROXIMO_CONTROL && !existente.FECHA_PROXIMO_CONTROL) {
        registrosPorRUT.set(rutLimpio, registro);
      } else if (
        registro.FECHA_PROXIMO_CONTROL &&
        existente.FECHA_PROXIMO_CONTROL &&
        compareFechas(registro.FECHA_PROXIMO_CONTROL, existente.FECHA_PROXIMO_CONTROL) < 0
      ) {
        registrosPorRUT.set(rutLimpio, registro);
      }
      
      // Consolidar exámenes
      const consolidado = registrosPorRUT.get(rutLimpio)!;
      consolidado.EXAMEN_ENDOSCOPIA = consolidarExamenes(
        consolidado.EXAMEN_ENDOSCOPIA,
        registro.EXAMEN_ENDOSCOPIA
      );
      consolidado.EXAMEN_IMAGENOLOGIA = consolidarExamenes(
        consolidado.EXAMEN_IMAGENOLOGIA,
        registro.EXAMEN_IMAGENOLOGIA
      );
      consolidado.EXAMEN_LABORATORIO = consolidarExamenes(
        consolidado.EXAMEN_LABORATORIO,
        registro.EXAMEN_LABORATORIO
      );
      consolidado.EXAMEN_OTRAS_PRUEBAS = consolidarExamenes(
        consolidado.EXAMEN_OTRAS_PRUEBAS,
        registro.EXAMEN_OTRAS_PRUEBAS
      );
    }
  });
  
  return Array.from(registrosPorRUT.values());
}

/**
 * Consolida exámenes en un solo campo
 */
function consolidarExamenes(examen1: string, examen2: string): string {
  const examenes = [examen1, examen2].filter(e => e !== '');
  return [...new Set(examenes)].join(' | ');
}

/**
 * Compara dos fechas
 */
function compareFechas(fecha1: Date | string, fecha2: Date | string): number {
  if (!fecha1 && !fecha2) return 0;
  if (!fecha1) return 1;
  if (!fecha2) return -1;
  
  const d1 = new Date(fecha1);
  const d2 = new Date(fecha2);
  
  return d1.getTime() - d2.getTime();
}

/**
 * Calcula estadísticas
 */
function calcularEstadisticas(resultados: ResultadosControles): EstadisticasControles {
  const todosRegistros = [
    ...resultados.controlesPrograma dos,
    ...resultados.dadosAlta,
    ...resultados.otrasComunas,
    ...resultados.inasistencias
  ];
  
  // Top especialidades
  const especialidadesCount = new Map<string, number>();
  todosRegistros.forEach(r => {
    especialidadesCount.set(
      r.ESPECIALIDAD,
      (especialidadesCount.get(r.ESPECIALIDAD) || 0) + 1
    );
  });
  
  const topEspecialidades = Array.from(especialidadesCount.entries())
    .map(([especialidad, cantidad]) => ({ especialidad, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);
  
  return {
    totalControles: resultados.controlesPrograma dos.length,
    totalAltas: resultados.dadosAlta.length,
    totalOtrasComunas: resultados.otrasComunas.length,
    totalInasistencias: resultados.inasistencias.length,
    topEspecialidades
  };
}

/**
 * Genera archivo Excel con 4 hojas
 */
export function generarExcelControles(resultados: ResultadosControles): Buffer {
  const workbook = XLSX.utils.book_new();
  
  // Hoja 1: Controles Programados
  const ws1 = XLSX.utils.json_to_sheet(resultados.controlesPrograma dos);
  aplicarEstiloHoja(ws1, '#E8F5E9');
  XLSX.utils.book_append_sheet(workbook, ws1, 'Controles Programados');
  
  // Hoja 2: Dados de Alta
  const ws2 = XLSX.utils.json_to_sheet(resultados.dadosAlta);
  aplicarEstiloHoja(ws2, '#E3F2FD');
  XLSX.utils.book_append_sheet(workbook, ws2, 'Dados de Alta');
  
  // Hoja 3: Otras Comunas
  const ws3 = XLSX.utils.json_to_sheet(resultados.otrasComunas);
  aplicarEstiloHoja(ws3, '#FFF9C4');
  XLSX.utils.book_append_sheet(workbook, ws3, 'Otras Comunas');
  
  // Hoja 4: Inasistencias
  const ws4 = XLSX.utils.json_to_sheet(resultados.inasistencias);
  aplicarEstiloHoja(ws4, '#FFEBEE');
  XLSX.utils.book_append_sheet(workbook, ws4, 'Inasistencias');
  
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Aplica estilos a una hoja
 */
function aplicarEstiloHoja(worksheet: XLSX.WorkSheet, color: string) {
  // Ajustar ancho de columnas
  const columnWidths = [
    { wch: 12 }, // FECHA_ATENCION
    { wch: 25 }, // ESPECIALIDAD
    { wch: 20 }, // AGENDA
    { wch: 20 }, // TIPO_CONSULTA
    { wch: 30 }, // NOMBRE_PACIENTE
    { wch: 12 }, // RUN
    { wch: 15 }, // TELEFONO
    { wch: 25 }, // RESPONSABLE
    { wch: 18 }, // FECHA_PROXIMO_CONTROL
    { wch: 30 }, // EXAMEN_ENDOSCOPIA
    { wch: 30 }, // EXAMEN_IMAGENOLOGIA
    { wch: 30 }, // EXAMEN_LABORATORIO
    { wch: 30 }, // EXAMEN_OTRAS_PRUEBAS
    { wch: 40 }  // OBSERVACIONES
  ];
  worksheet['!cols'] = columnWidths;
}
```

---

## 🔄 ACTUALIZACIONES EN ARCHIVOS EXISTENTES

### Actualizar next.config.js

Asegurarse de que las rutas estén configuradas correctamente:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración existente
};

module.exports = nextConfig;
```

### Actualizar src/lib/shared/normalizador.ts

Este archivo debe permanecer igual, ya que es compartido entre módulos.

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

**Fase 1: Reorganización**
- [ ] Crear nueva estructura de carpetas
- [ ] Mover archivos del módulo recetas a `/recetas/`
- [ ] Crear carpetas para módulo controles
- [ ] Crear carpeta `/shared/` para código compartido

**Fase 2: Landing Page**
- [ ] Crear nueva `src/app/page.tsx` con selector de módulos
- [ ] Diseñar cards para ambos módulos
- [ ] Implementar navegación con Next.js Link

**Fase 3: Módulo Controles**
- [ ] Crear types en `src/types/controles/`
- [ ] Implementar procesador en `src/lib/controles/procesador.ts`
- [ ] Crear API route `src/app/controles/api/procesar/route.ts`
- [ ] Crear página de upload `src/app/controles/page.tsx`
- [ ] Crear página de resultados `src/app/controles/resultados/page.tsx`
- [ ] Crear componentes específicos en `src/components/controles/`

**Fase 4: Testing**
- [ ] Probar módulo de recetas (debe seguir funcionando)
- [ ] Probar módulo de controles con archivo de ejemplo
- [ ] Validar generación de 4 hojas en Excel
- [ ] Verificar filtros y categorizaciones
- [ ] Probar navegación entre módulos

**Fase 5: Refinamiento**
- [ ] Ajustar estilos y diseño
- [ ] Optimizar performance
- [ ] Agregar mensajes de error específicos
- [ ] Documentar código
- [ ] Crear README para cada módulo

---

## 🎯 CRITERIOS DE ÉXITO

✅ Ambos módulos funcionan independientemente  
✅ Landing page permite seleccionar módulo  
✅ Módulo de recetas NO se ve afectado  
✅ Módulo de controles procesa correctamente  
✅ Excel generado tiene 4 hojas con datos correctos  
✅ Filtros de telemedicina y especialidad funcionan  
✅ Duplicados se eliminan correctamente  
✅ Ordenamiento por fecha funciona  
✅ UI es consistente con módulo de recetas  
✅ Navegación entre módulos es fluida  

---

## 📝 NOTAS IMPORTANTES

1. **NO TOCAR** el código existente del módulo de recetas excepto para moverlo a su nueva ubicación
2. **MANTENER** la función `normalizarRUT` en `/shared/` para uso de ambos módulos
3. **USAR** la misma paleta de colores y componentes UI
4. **IMPLEMENTAR** manejo de errores robusto
5. **DOCUMENTAR** las diferencias entre ambos módulos en README

---

## 🚀 COMANDOS PARA EJECUTAR DESPUÉS DE IMPLEMENTAR

```bash
# Instalar dependencias (si se agregaron nuevas)
npm install

# Ejecutar en desarrollo
npm run dev

# Verificar que ambas rutas funcionen:
# - http://localhost:3000 (landing page)
# - http://localhost:3000/recetas (módulo recetas)
# - http://localhost:3000/controles (módulo controles)

# Build para producción
npm run build
```

---

**¡COMIENZA LA IMPLEMENTACIÓN!** 🎉

Sigue el checklist paso a paso y verifica que cada fase funcione antes de avanzar a la siguiente.
