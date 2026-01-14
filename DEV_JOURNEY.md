# 📘 Anatomía y Cronología del Desarrollo: Job Board Premium

Este documento ofrece una **disección detallada archivo por archivo** de la plataforma. Narra no solo qué hace cada archivo, sino por qué fue creado en ese momento específico y cómo contribuye a la arquitectura global.

---

## 📅 Fase 1: El Núcleo (Configuración, BD y Autenticación)
*Objetivo: Establecer un servidor seguro y una base de datos conectada.*

### 1. `lib/db.ts`
* **Qué es:** El "Singleton" de la conexión a la base de datos.
* **Por qué:** En desarrollo, Next.js recarga constantemente. Si creamos una nueva conexión a la BD cada vez, saturaríamos a Postgres (error `too many connections`).
* **Anatomía:** Guarda la instancia `prisma` en una variable global (`globalThis`) para reutilizarla entre recargas.

### 2. `prisma/schema.prisma`
* **Qué es:** El plano arquitectónico de nuestra data.
* **Evolución:**
    *   *Día 1:* Solo modelos `User` y `Job`.
    *   *Día 2:* Agregamos relación `User` (author) -> `Job`.
    *   *Día 3:* Agregamos `Application` y campos para Cloudinary (`resumeUrl`, `resumePublicId`).
* **Clave Técnica:** Uso de Enums (`Role`, `JobStatus`) para forzar integridad a nivel de base de datos.

### 3. `lib/session.ts`
* **Qué es:** Nuestro sistema de autenticación personalizado (sin Auth.js/NextAuth).
* **Anatomía:**
    *   Usa `jose` para firmar y verificar tokens JWT.
    *   Guarda el JWT en una **HTTP-Only Cookie** (inaccesible para JS del lado cliente, máxima seguridad).
    *   Función `getSession()`: Se llama en casi todos los componentes de servidor para saber "¿Quién me está pidiendo esto?".

### 4. `actions/register.ts` & `actions/login.ts`
* **Qué es:** Server Actions para el ingreso.
* **Anatomía:**
    *   Reciben `FormData` del cliente.
    *   Verifican si el usuario existe en Prisma.
    *   Hashean/Verifican contraseñas con `bcryptjs`.
    *   Generan la cookie de sesión y redirigen.

---

## 📅 Fase 2: Gestión de Ofertas (Core Business)
*Objetivo: Permitir a las empresas publicar contenido.*

### 5. `app/jobs/new/page.tsx`
* **Qué es:** El formulario de creación de ofertas.
* **Evolución:**
    *   *Versión 1:* Inputs simples HTML.
    *   *Versión Final:* UI "Dark Premium" con selectores estilizados y validación visual.
* **Detalle Técnico:** Es un Server Component que renderiza el formulario, pero usa componentes cliente pequeños (como el selector de tags) incrustados.

### 6. `components/ui/tag-selector.tsx`
* **Qué es:** Componente de cliente para elegir habilidades (React, Node, Excel).
* **Anatomía:**
    *   Mantiene un estado local (`selectedTags[]`).
    *   Input oculto (`<input type="hidden" />`): Truco clave para enviar el array de tags dentro del `FormData` estándar HTML al servidor sin usar JSON complex.

### 7. `actions/create-job.ts`
* **Qué es:** El cerebro detrás de "Publicar Oferta".
* **Anatomía:**
    *   Verificación de Rol: `if (session.role !== 'COMPANY') throw Error`.
    *   Transacción Prisma: Crea el `Job` y conecta/crea los `Tags` relacionándolos en la tabla pivot `_JobToTag`.
    *   `revalidatePath('/')`: Ordena a Next.js borrar la caché de la home para que la nueva oferta aparezca al instante.

---

## � Fase 3: El Candidato y Gestión de Archivos (Cloudinary)
*Objetivo: Permitir postulaciones reales con CV.*

### 8. `lib/cloudinary.ts`
* **Qué es:** Configuración del SDK de Cloudinary.
* **Por qué:** Necesitábamos credenciales seguras (`API_SECRET` en servidor) para firmar subidas.

### 9. `actions/upload-cv.ts`
* **Qué es:** Manejador de subida de archivos binarios.
* **Anatomía:**
    *   Recibe el archivo como `File` object.
    *   Lo convierte a `ArrayBuffer` -> `Base64`.
    *   Lo envía a Cloudinary usando una "Data URI".
    *   **Crucial:** Actualiza el registro del `User` en la BD guardando solo la URL resultante.

### 10. `app/dashboard/page.tsx` (Candidate Logic)
* **Qué es:** El centro de comando del usuario.
* **Lógica Inteligente:**
    *   Renderizado Condicional: Detecta el rol (`session.role`).
    *   Si es `CANDIDATE`: Muestra `CandidateView` con su CV y sus postulaciones.
    *   Si es `COMPANY`: Muestra `CompanyView` con sus ofertas y métricas.

---

## 📅 Fase 4: La Empresa y el Dashboard Avanzado
*Objetivo: Dar herramientas de gestión a los reclutadores.*

### 11. `components/shared/dashboard/company/view.tsx`
* **Qué es:** Contenedor principal del panel de empresa.
* **Función:** Recibe los datos crudos (ofertas) y renderiza la lista filtrable.

### 12. `components/shared/dashboard/company/use-job-filter.ts`
* **Qué es:** Un **Custom Hook** extraído para limpiar el código.
* **Por qué:** El componente de lista tenía demasiada lógica (filtrar por texto, ordenar por fecha, ordenar por candidatos).
* **Anatomía:** Encapsula todos los `useState`, `useMemo` y la lógica de ordenamiento (`sort()`), devolviendo una lista limpia `processedJobs`.

### 13. `actions/apply-jobs.ts`
* **Qué es:** La acción de postularse.
* **Validaciones:**
    1.  ¿El usuario tiene CV subido?
    2.  ¿Ya se postuló antes a esta ID?
    3.  Crear registro en tabla `Application`.

---

## 📅 Fase 5: Refinamiento UI/UX (Premium Dark Mode)
*Objetivo: Transformar una herramienta funcional en un producto deseable.*

### 14. `app/page.tsx` (La Página Principal)
* **Qué es:** La entrada a la aplicación. El archivo más complejo lógicamente.
* **Evolución Lógica (El "Bug de Excel"):**
    *   Inicialmente excluía duplicados del carrusel siempre.
    *   **Fix:** Ahora solo excluye si NO hay filtros activos. Si buscas algo, te muestra todo.
*   **Anatomía:**
    *   Hace fetches paralelos (`Promise.all`) de jobs y conteos.
    *   Orquesta el carrusel y la lista paginada.

### 15. `components/shared/featured-carousel.tsx`
* **Qué es:** Carrusel de "Últimas Novedades" usando `embla-carousel`.
* **Detalle:** Renderizado visual puro con iconos `Lucide` (Sparkles, Building) reemplazando emojis antiguos.

### 16. `components/shared/scroll-to-top-on-change.tsx`
* **Qué es:** Un "Efecto Invisible".
* **Anatomía:**
    *   Es un componente cliente que no renderiza HTML (`return null`).
    *   Usa `useEffect` escuchando `searchParams`.
    *   Cuando cambia la página, ejecuta `element.scrollIntoView({ behavior: 'smooth' })`.
    *   **Resultado:** UX suave al paginar sin recargas bruscas.

---
*Este documento fue construido mediante análisis forense del código fuente y el historial de cambios, detallando la función exacta de cada pieza en el engranaje del sistema.*
