# ArLog JOBS - Especificación Funcional

## I. Arquitectura de Datos y Gobierno de Tags
El mayor activo de ArLog es su base de datos. Para evitar la "nube infinita" de etiquetas, se propone:

*   **Diccionario Centralizado:** Una tabla maestra de Tags gestionada por el Administrador.
*   **Jerarquía de Tags:** Clasificación por:
    *   **Hard Skills:** Manejo de Clark, SAP, Normas ISO.
    *   **Soft Skills:** Liderazgo, Trabajo en equipo.
    *   **Documentación:** Registro LINTI, CNRT, Carnet Sanitario.
*   **Interfaz de Selección:** En el Front-End (Next.js), el usuario no escribe el tag, lo selecciona de una lista predictiva (Select2/Autocomplete).

## II. Definición de Roles y Escalamiento Funcional

### 1. Perfil Empresa (Reclutador Corporativo)
**Base Funcional:**
*   **Onboarding:** Registro vinculado a **CUIT**. Validación mediante servicio externo o tabla de socios ArLog.
*   **Gestión de Avisos:** Formulario de carga con guardado parcial (borrador). Campos: Título, Descripción, Salario (opcional), Tags obligatorios.
*   **Panel de Aspirantes:** Visualización de lista con filtros por match de tags.

**Escalamiento y Valor Agregado:**
*   **CRM de Reclutamiento:** Capacidad de mover al candidato por etapas: Postulado -> En Revisión -> Entrevista -> Contratado/Rechazado.
*   **Métricas de Visualización:** Gráfico de barras (Vistas vs Aplicaciones).
*   **Buscador Proactivo (Headhunting):** Acceso a base de CVs con filtros (Ej: "Tag 'Logística Internacional' + Zona Norte").

### 2. Perfil Usuario (Postulante / Talento)
**Base Funcional:**
*   **Perfil Digital:** Carga de datos personales + Subida de CV (PDF).
*   **Buscador Inteligente:** Filtros por palabras clave y tags.
*   **Historial de Postulaciones:** Estado de sus aplicaciones.

**Escalamiento y Valor Agregado:**
*   **Alertas de Empleo (Job Alerts):** Email cuando hay match con tags favoritos.
*   **Status de Perfil:** Indicador de % de completitud.
*   **Privacidad:** Ocultar perfil a ciertas empresas.

### 3. Perfil Administrador (Cámara ArLog)
**Base Funcional:**
*   **Moderación Central:** Editar/Baja de avisos.
*   **Gestión de Empresas:** Validación de CUITs y credenciales.
*   **Gestión de Tags:** ABM de etiquetas (Crear, Editar, Fusionar).

**Escalamiento y Valor Agregado:**
*   **BI Dashboard:** Reporte "Demanda vs Oferta".
*   **Exportador de Datos:** Reportes en PDF/Excel.

## III. Análisis de Integración y Mejoras Técnicas

### 1. Optimización Front-End (Next.js)
*   **SEO para Empleos:** Metadata Dinámica y JSON-LD (Schema.org) para Google Jobs.
*   **Velocidad:** Filtrado instantáneo.

### 2. Seguridad y Privacidad
*   **Encriptación:** CVs en bucket seguro (S3/Blob) con URLs firmadas/temporales.
*   **Validación de CUIT:** Log de intentos para prevenir bots.

### 3. Mantenimiento de Datos
*   **Re-engagement:** Email a los 6 meses para validar status de búsqueda.
*   **Base Relacional:** IDs de tags, no texto plano.

## IV. Hoja de Ruta (Roadmap) Recomendada

1.  **Fase 1 (Backend/Core):** Limpieza de DB y API de validación CUIT.
2.  **Fase 2 (Frontend/User):** Buscador y Sistema de Perfiles con Tags.
3.  **Fase 3 (Admin):** Dashboard de métricas y gestión.
4.  **Fase 4 (Growth):** SEO avanzado y Notificaciones.

