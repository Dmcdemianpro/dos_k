# 🎨 DESCRIPCIÓN DE LA INTERFAZ DE USUARIO

## Vista general de las pantallas del sistema

---

## 🏠 PÁGINA PRINCIPAL (/)

### Header
```
┌─────────────────────────────────────────────────────────────────┐
│  [🏥]  Sistema de Notificación de Recetas                      │
│        Telemedicina - Cruce de Dispensaciones y Citas          │
└─────────────────────────────────────────────────────────────────┘
```

### Contenido Principal
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    PROCESAR ARCHIVOS                            │
│      Sube los archivos de dispensaciones y citas para          │
│      generar la lista de pacientes a notificar                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [1] ARCHIVO DE DISPENSACIONES                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │          📤 [ICONO DE UPLOAD]                             │ │
│  │                                                           │ │
│  │   Arrastra aquí o haz clic para seleccionar              │ │
│  │   Informe_de_dispensaciones_*.xlsx                        │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  (cuando está cargado:)                                         │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  📄 archivo_dispensaciones.xlsx                      [X]  │ │
│  │  1.2 MB                                                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [2] ARCHIVO DE CITAS                                           │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │          📤 [ICONO DE UPLOAD]                             │ │
│  │                                                           │ │
│  │   Arrastra aquí o haz clic para seleccionar              │ │
│  │   GeneralCitas_export_*.xlsx                             │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [  🚀 PROCESAR ARCHIVOS  ]  (botón grande, azul)              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  💡 INFORMACIÓN IMPORTANTE                                      │
│  • Los archivos deben estar en formato Excel (.xlsx o .xls)    │
│  • Tamaño máximo por archivo: 10 MB                            │
│  • Se cruzarán automáticamente las recetas con citas validadas │
│  • El resultado incluirá datos de contacto para notificaciones │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Colores
- **Background**: Gradiente azul claro → blanco → verde claro
- **Header**: Blanco con sombra
- **Icono hospital**: Fondo azul (#1976D2), icono blanco
- **Áreas de upload**: Borde gris punteado, hover azul
- **Archivos cargados**: Fondo verde claro, borde verde
- **Botón procesar**: Azul (#1976D2) cuando activo, gris cuando deshabilitado
- **Info box**: Fondo azul claro, borde azul, texto azul oscuro

---

## ⏳ MODAL DE PROCESAMIENTO

```
┌─────────────────────────────────────────────────────────────────┐
│  (Fondo oscuro semi-transparente)                              │
│                                                                 │
│         ┌─────────────────────────────────────┐                │
│         │                                     │                │
│         │      [⚙️ ICONO GIRANDO]             │                │
│         │                                     │                │
│         │    PROCESANDO ARCHIVOS...           │                │
│         │                                     │                │
│         │  Estamos cruzando los datos de     │                │
│         │  dispensaciones con las citas      │                │
│         │  validadas. Esto puede tomar       │                │
│         │  unos segundos...                  │                │
│         │                                     │                │
│         │  [═════════════════]                │                │
│         │  (barra de progreso animada)       │                │
│         │                                     │                │
│         └─────────────────────────────────────┘                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Animación
- **Icono**: Rotación continua
- **Barra de progreso**: Animación de izquierda a derecha (infinita)
- **Duración típica**: 2-5 segundos

---

## 📊 PÁGINA DE RESULTADOS (/resultados)

### Header
```
┌─────────────────────────────────────────────────────────────────┐
│  [🏥]  Resultados del Procesamiento        [🔄 Procesar Nuevos]│
│        Pacientes con recetas disponibles y citas validadas      │
└─────────────────────────────────────────────────────────────────┘
```

### Banner de Éxito
```
┌─────────────────────────────────────────────────────────────────┐
│  ✅  PROCESAMIENTO COMPLETADO EXITOSAMENTE                      │
│                                                                 │
│  Se han identificado 26 PACIENTES con 29 RECETAS disponibles   │
│  para notificación.                                             │
└─────────────────────────────────────────────────────────────────┘
```

### Cards de Estadísticas
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ PACIENTES [👥]│ │ RECETAS  [📄]│ │CON MÓVIL [📱]│ │CON FIJO  [☎️]│
│              │ │              │ │              │ │              │
│      26      │ │      29      │ │24 (92%)      │ │21 (81%)      │
│              │ │              │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
   (Azul)           (Verde)         (Morado)          (Naranja)
```

### Grid de Contenido
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌────────────────────┐  ┌──────────────────────────────────┐  │
│  │ 🏆 TOP             │  │ ℹ️  PRÓXIMOS PASOS                │  │
│  │ PROFESIONALES      │  │                                   │  │
│  │                    │  │ [1] Descargar la planilla Excel  │  │
│  ├────────────────────┤  │     con los datos de contacto    │  │
│  │ [1] Roxana Est... │  │                                   │  │
│  │     8 recetas      │  │ [2] Contactar a los pacientes    │  │
│  │                    │  │     vía teléfono móvil (92%) o   │  │
│  │ [2] Francisco R... │  │     fijo (81%)                   │  │
│  │     6 recetas      │  │                                   │  │
│  │                    │  │ [3] Informar al paciente que     │  │
│  │ [3] Cristián H...  │  │     tiene receta(s) disponible   │  │
│  │     6 recetas      │  │                                   │  │
│  │                    │  │                                   │  │
│  │ [4] Paola F...     │  │                                   │  │
│  │     2 recetas      │  │                                   │  │
│  │                    │  │                                   │  │
│  │ [5] Miguel O...    │  │                                   │  │
│  │     2 recetas      │  │                                   │  │
│  │                    │  │                                   │  │
│  └────────────────────┘  └──────────────────────────────────┘  │
│      (1/3 ancho)              (2/3 ancho)                       │
└─────────────────────────────────────────────────────────────────┘
```

### Tabla de Resultados
```
┌─────────────────────────────────────────────────────────────────┐
│  📋 PACIENTES A NOTIFICAR (26)      [🔍 Buscar por RUT...]      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  RUT         │ Nombre        │ Profesional  │ Móvil │ Fijo    │
│──────────────┼───────────────┼──────────────┼───────┼─────────│
│ 15.722.545-6 │ Romina Mora   │ Dra. Flores  │ 965...│ 234...  │
│ 8.109.273-7  │ Elisa Rojas   │ Dr. Rozas    │ 979...│ -       │
│ 18.062.050-8 │ Camila Silva  │ Dr. Holth... │ 956...│ 222...  │
│ ...          │ ...           │ ...          │ ...   │ ...     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Mostrando 1-10 de 26       [◄] Página 1 de 3 [►]              │
└─────────────────────────────────────────────────────────────────┘
```

### Características de la Tabla
- **Búsqueda**: En tiempo real, filtra por RUT, nombre o profesional
- **Paginación**: 10 items por página
- **Teléfonos**: Con badges de color (verde para móvil, azul para fijo)
- **Hover**: Fila resaltada al pasar el mouse
- **Responsive**: Se convierte en cards en móvil

### Botones de Acción
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│         [📥 DESCARGAR PLANILLA EXCEL]  [🔄 PROCESAR OTROS]      │
│                (Verde)                       (Gris)             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 PALETA DE COLORES

### Colores Principales
```
PRIMARY (Azul profesional médico)
  ████ #1976D2  - Principal
  ████ #1565C0  - Oscuro (hover)
  ████ #42A5F5  - Claro

SECONDARY (Verde éxito)
  ████ #388E3C  - Principal
  ████ #2E7D32  - Oscuro (hover)
  ████ #66BB6A  - Claro

ERROR (Rojo advertencia)
  ████ #D32F2F

WARNING (Naranja)
  ████ #F57C00

BACKGROUND
  ████ #F5F5F5  - Fondo general
  ████ #FFFFFF  - Tarjetas/superficies

TEXT
  ████ #212121  - Texto principal
  ████ #666666  - Texto secundario
```

### Uso de Colores en Componentes
- **Header**: Blanco con sombra sutil
- **Cards de stats**: Fondos claros con iconos en color
- **Botón principal**: Azul #1976D2
- **Botón secundario**: Verde #388E3C
- **Badges teléfono móvil**: Verde claro
- **Badges teléfono fijo**: Azul claro
- **Mensajes de error**: Rojo #D32F2F
- **Mensajes de éxito**: Verde claro

---

## 📱 RESPONSIVE DESIGN

### Desktop (> 1024px)
- Grid de 4 columnas para stats cards
- Tabla completa visible
- Top profesionales en sidebar

### Tablet (768px - 1024px)
- Grid de 2 columnas para stats cards
- Tabla con scroll horizontal
- Top profesionales debajo de stats

### Mobile (< 768px)
- Stats cards en columna única
- Tabla se convierte en cards verticales
- Navegación simplificada
- Botones de ancho completo

---

## 🎭 ANIMACIONES

### Entrada de elementos
- **Fade in**: Cards y tabla aparecen gradualmente
- **Slide up**: Elementos suben suavemente

### Interacciones
- **Hover**: Cambio de color suave (transition 200ms)
- **Click**: Efecto de escala leve
- **Loading**: Spinner rotatorio + barra de progreso animada

### Transiciones
- **Navegación**: Fade entre páginas
- **Modales**: Fade in del overlay + scale del contenido

---

## 🔤 TIPOGRAFÍA

### Fuentes
```
Sans-serif stack:
-apple-system, BlinkMacSystemFont,
'Segoe UI', 'Roboto', 'Oxygen',
'Ubuntu', 'Cantarell', 'Fira Sans',
'Droid Sans', 'Helvetica Neue'
```

### Tamaños
- **H1**: 2rem (32px) - Títulos principales
- **H2**: 1.5rem (24px) - Subtítulos
- **H3**: 1.25rem (20px) - Títulos de sección
- **Body**: 1rem (16px) - Texto normal
- **Small**: 0.875rem (14px) - Texto secundario
- **Tiny**: 0.75rem (12px) - Labels

### Pesos
- **Bold** (700): Títulos, botones
- **Semibold** (600): Subtítulos
- **Medium** (500): Labels
- **Regular** (400): Texto normal

---

## 🖱️ INTERACCIONES

### Drag & Drop
1. **Estado normal**: Borde gris punteado
2. **Hover**: Borde azul, fondo gris claro
3. **Drag over**: Borde azul sólido, fondo azul claro
4. **Drop**: Animación de escala + aparición del archivo

### Botones
1. **Normal**: Color sólido
2. **Hover**: Color más oscuro + sombra más grande
3. **Active**: Escala 98%
4. **Disabled**: Gris, cursor not-allowed

### Inputs de búsqueda
1. **Normal**: Borde gris
2. **Focus**: Borde azul, ring azul
3. **Con contenido**: Icono X para limpiar

---

## 📊 ESTADOS DE LA APLICACIÓN

### Loading
- Modal con spinner giratorio
- Barra de progreso animada
- Mensaje descriptivo

### Success
- Banner verde con checkmark
- Mensaje de confirmación
- Estadísticas destacadas

### Error
- Banner rojo con icono de alerta
- Mensaje de error claro
- Sugerencias de solución

### Empty State
- Icono grande centrado
- Mensaje amigable
- Botón de acción

---

## 🎯 ACCESIBILIDAD

### Implementado
- ✅ Contraste WCAG AA (mínimo 4.5:1)
- ✅ Labels en todos los inputs
- ✅ Navegación por teclado
- ✅ Focus visible
- ✅ Textos alternativos en iconos
- ✅ Aria labels donde corresponde
- ✅ Mensajes de error claros

### Navegación por teclado
- **Tab**: Navegar entre elementos
- **Enter/Space**: Activar botones
- **Escape**: Cerrar modales
- **Arrow keys**: Navegar paginación

---

## 📸 FLUJO VISUAL COMPLETO

```
INICIO
  ↓
[Página Principal]
  - Sube archivo 1
  - Sube archivo 2
  - Click "Procesar"
  ↓
[Modal de Procesamiento]
  - Spinner giratorio
  - Barra de progreso
  - Mensaje "Procesando..."
  ↓
[Página de Resultados]
  - Banner de éxito
  - 4 cards de estadísticas
  - Top profesionales (sidebar)
  - Próximos pasos (info)
  - Tabla de pacientes
  - Búsqueda y paginación
  - Botón descargar Excel
  ↓
[Descarga Excel]
  - Archivo descargado
  - Listo para notificar
```

---

**La interfaz está diseñada para ser:**
- ✅ Intuitiva y fácil de usar
- ✅ Profesional y confiable
- ✅ Rápida y responsive
- ✅ Accesible para todos
- ✅ Visualmente atractiva
