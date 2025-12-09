# 🧪 GUÍA DE PRUEBAS - Sistema de Automatización Telemedicina

## ✅ Estado: Servidor Corriendo

**URL del servidor:** http://localhost:3000

---

## 📋 PRUEBAS A REALIZAR

### 1️⃣ Prueba de Landing Page

**URL:** http://localhost:3000

**Qué verificar:**
- ✅ Se muestra la página con el título "Sistema de Automatización - Telemedicina HEC"
- ✅ Se ven 2 cards: "Recetas" y "Controles de Telemedicina"
- ✅ El card de Recetas tiene ícono de píldora (azul)
- ✅ El card de Controles tiene ícono de clipboard (verde)
- ✅ Los cards tienen efecto hover (elevan al pasar el mouse)
- ✅ Los botones "Acceder al módulo" son clickeables

**Resultado esperado:** Página de inicio funcional con diseño atractivo

---

### 2️⃣ Prueba del Módulo de Recetas

**URL:** http://localhost:3000/recetas

**Qué verificar:**
- ✅ Se muestra la página de upload con 2 secciones de archivos
- ✅ Header muestra "Sistema de Notificación de Recetas"
- ✅ Hay 2 áreas de drag & drop para archivos
- ✅ Botón "Procesar Archivos" está deshabilitado hasta subir ambos archivos

**Archivos para probar:**
- Dispensaciones: `Informe de dispensaciones por paciente y profesional.xlsx`
- Citas: `GeneralCitas_export_1763651742099.xlsx`

**Resultado esperado:** Módulo de recetas funciona como antes (sin cambios)

---

### 3️⃣ Prueba del Módulo de Controles (NUEVO)

#### Paso 1: Acceder al módulo

**URL:** http://localhost:3000/controles

**Qué verificar:**
- ✅ Se muestra la página con header "Control de Pacientes de Telemedicina"
- ✅ Hay un botón "Volver al inicio" en la esquina superior derecha
- ✅ Se muestra 1 área de drag & drop para el archivo de producción
- ✅ Color predominante es verde (diferente al módulo de recetas)
- ✅ Botón "Procesar Archivo" está deshabilitado hasta subir archivo

#### Paso 2: Subir archivo de ejemplo

**Archivo:** `INFORME_PRODUCCIÓN_AMBULATORIO_EJEMPLO.xlsx`

**Cómo subir:**
1. Click en el área de drag & drop
2. Selecciona el archivo `INFORME_PRODUCCIÓN_AMBULATORIO_EJEMPLO.xlsx`
3. O arrastra el archivo al área

**Qué verificar:**
- ✅ Se muestra el nombre del archivo subido
- ✅ Se muestra el tamaño del archivo (27KB aprox)
- ✅ Botón "Procesar Archivo" se habilita
- ✅ El botón cambia de gris a verde

#### Paso 3: Procesar archivo

**Acción:** Click en "Procesar Archivo"

**Qué verificar:**
- ✅ Aparece un indicador de "Procesando..."
- ✅ El botón se deshabilita durante el procesamiento
- ✅ Después de unos segundos, redirige a la página de resultados

#### Paso 4: Verificar resultados

**URL automática:** http://localhost:3000/controles/resultados

**Qué verificar - Estadísticas Generales:**
- ✅ 4 cards de estadísticas:
  - **Controles Programados:** 6 (después de eliminar duplicado)
  - **Dados de Alta:** 1
  - **Otras Comunas:** 1-2 (dependiendo de filtros)
  - **Inasistencias:** 2

**Qué verificar - Pestañas:**
- ✅ Se muestran 4 pestañas: Controles, Altas, Otras Comunas, Inasistencias
- ✅ Cada pestaña muestra el número de registros
- ✅ Al hacer click en cada pestaña, cambia el contenido

**Qué verificar - Tabla de Resultados:**
- ✅ Se muestran los pacientes en formato tabla
- ✅ Columnas visibles: Fecha Control, Nombre, RUN, Especialidad, Teléfono
- ✅ Hay un buscador en la parte superior derecha
- ✅ La tabla tiene paginación (si hay más de 10 registros)

**Qué verificar - Top Especialidades:**
- ✅ Se muestra el ranking de Top 5 especialidades
- ✅ Cada especialidad tiene una barra de progreso
- ✅ Se muestra el número de pacientes por especialidad

**Qué verificar - Botón de Descarga:**
- ✅ Hay un botón verde "Descargar Excel Completo"
- ✅ Al hacer click, descarga un archivo Excel
- ✅ El archivo se llama `Control_Telemedicina_2025-12-05.xlsx`

#### Paso 5: Verificar archivo Excel descargado

**Abrir el archivo descargado**

**Qué verificar:**
- ✅ El Excel tiene 4 hojas (pestañas):
  1. Controles Programados
  2. Dados de Alta
  3. Otras Comunas
  4. Inasistencias

- ✅ Cada hoja contiene los pacientes correctamente categorizados
- ✅ Las columnas incluyen: FECHA_ATENCION, ESPECIALIDAD, NOMBRE_PACIENTE, RUN, etc.
- ✅ Los registros duplicados fueron eliminados (solo aparece 1 vez Juan Pérez)
- ✅ Los registros están ordenados por fecha de próximo control

#### Paso 6: Probar búsqueda y filtros

**En la página de resultados:**

1. **Buscar por nombre:**
   - Escribe "Juan" en el buscador
   - ✅ Debe mostrar solo los registros con "Juan" en el nombre

2. **Cambiar de pestaña:**
   - Click en "Inasistencias"
   - ✅ Debe mostrar los 2 pacientes que no asistieron

3. **Navegar páginas:**
   - Si hay paginación, probar botones "Anterior" y "Siguiente"
   - ✅ Debe cambiar de página correctamente

#### Paso 7: Probar botón "Procesar otro archivo"

**Acción:** Click en "Procesar otro archivo"

**Qué verificar:**
- ✅ Redirige a `/controles` (página de upload)
- ✅ Los campos están limpios (sin archivo seleccionado)
- ✅ Listo para procesar un nuevo archivo

---

### 4️⃣ Prueba de Navegación entre Módulos

**Secuencia de prueba:**

1. Ir a http://localhost:3000 (landing page)
2. Click en "Recetas" → Debe ir a `/recetas`
3. Volver al inicio (navegador o logo)
4. Click en "Controles" → Debe ir a `/controles`
5. Procesar archivo y ver resultados
6. Click en "Volver al inicio" → Debe ir a `/`

**Qué verificar:**
- ✅ Todas las navegaciones funcionan sin errores
- ✅ No se pierden datos entre navegaciones
- ✅ Los módulos son independientes

---

## 📊 DATOS DE EJEMPLO INCLUIDOS

El archivo `INFORME_PRODUCCIÓN_AMBULATORIO_EJEMPLO.xlsx` contiene:

### Pacientes por categoría:
- **6 Controles Programados:** Pacientes de Maipú/Cerrillos con fecha de control
- **1 Dado de Alta:** Paciente sin fecha de próximo control
- **1-2 Otras Comunas:** Pacientes de Pudahuel/Santiago
- **2 Inasistencias:** Pacientes con estado "NO ASISTE"
- **1 Duplicado:** Para probar eliminación (Juan Pérez)

### Especialidades incluidas:
- Cardiología (2 registros)
- Diabetología
- Medicina Interna
- Neurología Adulto
- Gastroenterología
- Endocrinología
- Fisiatría
- Pediatría
- Urología

### Tipos de consulta:
- TELEMEDICINA CONTROL
- TELEMEDICINA
- BR TELEMEDICINA
- TELECONTROL
- TELEMEDICINA EXTRA

---

## 🐛 VERIFICACIÓN DE FILTROS

### El procesador debe:
1. ✅ Incluir solo consultas de telemedicina (10 tipos)
2. ✅ Incluir solo especialidades permitidas (15 especialidades)
3. ✅ Eliminar duplicados por RUT (Juan Pérez aparece 1 vez)
4. ✅ Mantener el registro con fecha más cercana
5. ✅ Consolidar exámenes del registro duplicado
6. ✅ Separar en 4 categorías correctamente
7. ✅ Ordenar por fecha de próximo control (ascendente)

---

## ✅ CHECKLIST DE PRUEBAS

### Landing Page
- [ ] Página carga correctamente
- [ ] 2 módulos visibles
- [ ] Links funcionan

### Módulo Recetas
- [ ] Página de upload funciona
- [ ] Mantiene funcionalidad original
- [ ] Navegación correcta

### Módulo Controles
- [ ] Página de upload carga
- [ ] Subir archivo funciona
- [ ] Procesar archivo funciona
- [ ] Página de resultados muestra datos
- [ ] 4 pestañas funcionan
- [ ] Estadísticas son correctas
- [ ] Búsqueda funciona
- [ ] Descarga de Excel funciona
- [ ] Excel tiene 4 hojas
- [ ] Datos están correctamente categorizados
- [ ] Duplicados fueron eliminados
- [ ] Ordenamiento es correcto

### Navegación
- [ ] Entre módulos funciona
- [ ] Botón "Volver" funciona
- [ ] No hay errores en consola

---

## 🎉 RESULTADO ESPERADO

**TODO FUNCIONAL ✅**

Si todas las pruebas pasan, el sistema está listo para:
1. Procesar archivos reales de producción ambulatoria
2. Generar registros de controles automáticamente
3. Exportar resultados categorizados en Excel

---

## 📞 SOPORTE

Si encuentras algún problema:
1. Revisar la consola del navegador (F12)
2. Revisar logs del servidor (terminal donde corre `npm run dev`)
3. Verificar que el archivo tenga el formato correcto

---

**¡Listo para probar!** 🚀
