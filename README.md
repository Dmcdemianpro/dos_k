# Sistema de Notificación de Recetas - Telemedicina

Sistema web automatizado para cruzar datos de recetas de dispensación con citas de telemedicina en el sistema de salud de Chile.

## Problema que resuelve

Automatiza el proceso manual de cruce de datos entre:
- **Informe de Dispensaciones**: Recetas emitidas (archivos Excel)
- **GeneralCitas**: Citas de telemedicina validadas (archivos Excel)

Identifica pacientes que tienen receta Y atención validada para notificarles que tienen medicamentos disponibles.

## Características principales

- ✅ Carga de archivos Excel mediante drag & drop
- ✅ Normalización automática de RUTs (formato crítico: con/sin guión)
- ✅ Cruce de datos por RUT del paciente
- ✅ Filtrado automático de citas validadas
- ✅ Eliminación de duplicados de medicamentos
- ✅ Generación de estadísticas en tiempo real
- ✅ Exportación a Excel con un clic
- ✅ Interfaz responsive y moderna
- ✅ Procesamiento 100% local (sin enviar datos a servidor)

## Stack tecnológico

- **Frontend**: Next.js 15, React 19, TypeScript
- **Estilos**: Tailwind CSS
- **Procesamiento Excel**: SheetJS (xlsx)
- **UI Components**: Lucide React icons
- **File Upload**: react-dropzone

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar producción
npm start
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Uso

1. **Subir archivos**:
   - Arrastra o selecciona el archivo de dispensaciones (Informe_de_dispensaciones_*.xlsx)
   - Arrastra o selecciona el archivo de citas (GeneralCitas_export_*.xlsx)

2. **Procesar**:
   - Haz clic en "Procesar Archivos"
   - El sistema cruzará automáticamente los datos

3. **Resultados**:
   - Visualiza estadísticas: pacientes, recetas, teléfonos disponibles
   - Revisa la tabla de pacientes a notificar
   - Ve el top de profesionales con más recetas
   - Descarga la planilla Excel para notificaciones

## Formato de archivos

### Archivo de Dispensaciones
Debe contener las siguientes columnas (header en fila 2):
- RUT PACIENTE
- Id RECETA
- NOMBRE PACIENTE
- APELLIDO PATERNO
- APELLIDO MATERNO
- FUNCIONARIO PRESCRIBE
- FECHA GENERACION RECETA
- PRESCRIPCION

### Archivo de Citas
Debe contener las siguientes columnas:
- Run_Paciente
- nombre_paciente
- Nombre_Profesional
- Estado_Cita
- Fono_movil
- Fono_fijo
- fecha_atencion
- Estado_Teleconsulta

## Lógica de procesamiento

1. **Normalización de RUTs**: Elimina guiones, puntos y espacios
   - Ejemplo: "12.345.678-9" → "123456789"
   - Ejemplo: "6447300-K" → "6447300K"

2. **Agrupación de recetas**: Por RUT + ID_RECETA (elimina duplicados)

3. **Filtrado de citas**: Solo citas con Estado_Cita = "Validada"

4. **Cruce de datos**: Inner join por RUT normalizado

5. **Generación de resultados**: Tabla con datos de contacto

## Estructura del proyecto

```
dos_k/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Página principal
│   │   ├── layout.tsx            # Layout principal
│   │   ├── globals.css           # Estilos globales
│   │   ├── api/
│   │   │   └── procesar/
│   │   │       └── route.ts      # API endpoint
│   │   └── resultados/
│   │       └── page.tsx          # Página de resultados
│   ├── components/
│   │   ├── FileUploader.tsx      # Componente de carga
│   │   ├── ProcessingStatus.tsx  # Indicador de progreso
│   │   ├── ResultsTable.tsx      # Tabla de resultados
│   │   ├── StatsCards.tsx        # Tarjetas de estadísticas
│   │   ├── DownloadButton.tsx    # Botón de descarga
│   │   └── TopProfesionales.tsx  # Ranking de profesionales
│   ├── lib/
│   │   ├── procesador.ts         # Lógica principal
│   │   ├── normalizador.ts       # Normalización de RUTs
│   │   └── utils.ts              # Utilidades
│   └── types/
│       ├── dispensacion.ts       # Tipos de dispensaciones
│       ├── cita.ts               # Tipos de citas
│       └── resultado.ts          # Tipos de resultados
├── public/
└── package.json
```

## Seguridad

- ✅ Validación de formato Excel
- ✅ Límite de tamaño de archivo (10MB)
- ✅ Validación de estructura de datos
- ✅ Sanitización de datos antes de mostrar
- ✅ Procesamiento en memoria (no se guardan archivos)

## Deployment

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel deploy
```

### Docker

```bash
# Construir imagen
docker build -t dos-k .

# Ejecutar contenedor
docker run -p 3000:3000 dos-k
```

## Mejoras futuras

- [ ] Autenticación de usuarios
- [ ] Base de datos para historial
- [ ] Notificaciones automáticas (WhatsApp Business API)
- [ ] Dashboard con analytics
- [ ] Procesamiento programado (cron jobs)
- [ ] Exportar a PDF
- [ ] Multi-idioma

## Soporte

Para reportar problemas o solicitar funcionalidades, por favor abre un issue en el repositorio.

## Licencia

Proyecto desarrollado para el sistema de salud de Chile.
