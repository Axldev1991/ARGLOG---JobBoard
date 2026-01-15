# 📘 Anatomía y Cronología del Desarrollo: Job Board Premium

Este documento es una radiografía completa del proyecto. Detalla la estructura de directorios, la función de cada pieza y la evolución cronológica del desarrollo.

---

## 🗺️ Mapa Estructural del Proyecto
Antes de sumergirnos en la historia, entendamos la geografía del código. Así está organizado nuestro edificio:

```bash
src/
├── actions/              # (Backend/API) Lógica de servidor segura.
│   ├── login.ts          # Auth: Verificación de credenciales.
│   ├── create-job.ts     # Business: Creación de ofertas.
│   ├── apply-jobs.ts     # Business: Lógica de postulación.
│   └── upload-cv.ts      # Integra Cloudinary.
│
├── app/                  # (Router) Cada carpeta es una URL en el navegador.
│   ├── page.tsx          # La Home (Landing Page).
│   ├── login/            # Ruta /login
│   ├── dashboard/        # Ruta /dashboard (Protegida)
│   │   ├── page.tsx      # Lógica inteligente (Candidato vs Empresa).
│   │   └── jobs/[id]/    # Ruta dinámica para ver detalles de una oferta propia.
│   ├── jobs/             # Rutas públicas de ofertas.
│   │   ├── new/          # Formulario de creación.
│   │   └── [id]/         # Detalle público de oferta.
│   └── api/              # (Legacy) Endpoints REST, casi no usados por tener actions.
│
├── components/           # (Frontend) Los ladrillos visuales.
│   ├── ui/               # "Shadcn UI": Átomos genéricos (Button, Input, Card).
│   │   ├── button.tsx
│   │   └── tag-selector.tsx # (Custom) Selector de habilidades.
│   └── shared/           # Moléculas específicas de NUESTRA app.
│       ├── navbar.tsx    # Barra de navegación.
│       ├── job-card.tsx  # La tarjeta de empleo (Dark Mode).
│       ├── search-filter.tsx # Buscador complejo.
│       └── dashboard/    # Componentes masivos del panel interno.
│           ├── candidate-view.tsx
│           └── company/
│               ├── view.tsx
│               └── job-list.tsx
│
├── lib/                  # (Utils) Los fontaneros del sistema.
│   ├── db.ts             # Conexión Singleton a Prisma/Postgres.
│   ├── session.ts        # Manejo de JWT y Cookies.
│   └── cloudinary.ts     # Configuración de subida de archivos.
│
└── prisma/               # (Database)
    └── schema.prisma     # PLANOS MAESTROS de la base de datos.
```

---

## 📅 Fase 1: El Núcleo (Configuración, BD y Autenticación)
*Objetivo: Establecer un servidor seguro y una base de datos conectada.*

### 1. `lib/db.ts`
* **Ubicación:** `/src/lib` - Utilidades globales.
* **Qué es:** El "Singleton" de la conexión a la base de datos.
* **Por qué:** En desarrollo, Next.js recarga constantemente. Si creamos una nueva conexión a la BD cada vez, saturaríamos a Postgres (error `too many connections`).

### 2. `prisma/schema.prisma`
* **Ubicación:** Raíz del proyecto.
* **Qué es:** El plano arquitectónico de nuestra data.
* **Evolución:**
    *   *Día 1:* Solo modelos `User` y `Job`.
    *   *Día 2:* Relación `User` (author) -> `Job`.
    *   *Día 3:* Modelo `Application` y campos Cloudinary.

### 3. `lib/session.ts`
* **Ubicación:** `/src/lib` - Utilidades de seguridad.
* **Qué es:** Sistema de autenticación JWT + Cookies (sin Auth.js).
* **Anatomía:** Usa `jose` para firmar tokens y `cookies()` de Next.js para guardarlos de forma HTTP-Only.

---

## 📅 Fase 2: Gestión de Ofertas (Business Logic)
*Objetivo: Permitir a las empresas publicar contenido.*

### 4. `app/jobs/new/page.tsx`
* **Ubicación:** `/src/app/jobs/new` - Ruta pública pero protegida.
* **Qué es:** Formulario de creación.
* **Evolución:** Pasó de un HTML simple a una UI "Dark Premium" usando `grid` y `glassmorphism`.

### 5. `components/ui/tag-selector.tsx`
* **Ubicación:** `/src/components/ui` - Componente atómico reutilizable.
* **Qué es:** Selector de tecnologías (React, Java, etc.).
* **Truco:** Usa un `<input type="hidden">` para pasar el array de tags al Server Action de forma nativa.

### 6. `actions/create-job.ts`
* **Ubicación:** `/src/actions` - Lógica Backend.
* **Qué es:** Recibe el formulario, valida el rol `COMPANY`, crea el `Job` y sus relaciones (`_JobToTag`) en una transacción.

---

## 📅 Fase 3: El Candidato (Archivos y Relaciones)
*Objetivo: Postulaciones reales con PDF.*

### 7. `actions/upload-cv.ts`
* **Ubicación:** `/src/actions` - Integración externa.
* **Qué es:** Puente entre el navegador y Cloudinary.
* **Flujo:** `File` -> `ArrayBuffer` -> `Cloudinary Upload` -> `DB Update (URL)`.

### 8. `app/dashboard/page.tsx`
* **Ubicación:** `/src/app/dashboard` - Ruta privada principal.
* **Lógica:** Es un "Router Inteligente". Si eres `CANDIDATE` renderiza `CandidateView`, si eres `COMPANY` renderiza `CompanyView`. No hay dos URLs distintas, la vista se adapta a ti.

---

## 📅 Fase 4: La Empresa y UI Premium (Refinamiento Final)
*Objetivo: Profesionalizar la experiencia visual y funcional.*

### 9. `components/shared/dashboard/company/use-job-filter.ts`
* **Ubicación:** `/src/components/shared/...` - Lógica de UI específica.
* **Qué es (Custom Hook):** Extrajimos la lógica pesada de filtrado/ordenamiento de la vista a este archivo. Mantiene el componente visual limpio.

### 10. `app/page.tsx` (Home Page)
* **Ubicación:** `/src/app` - La entrada principal.
* **Complejidad:** Maneja estados de URL (`?q=...`), fetch de datos paralelo, y lógica de exclusión para no repetir ofertas del carrusel en la lista principal.

### 11. `components/shared/featured-carousel.tsx`
* **Ubicación:** `/src/components/shared` - Componente visual grande.
* **Qué es:** El slider de "Últimas Novedades" usando la librería `embla-carousel`.

### 12. `components/shared/scroll-to-top-on-change.tsx`
* **Ubicación:** `/src/components/shared` - Utilidad de UX.
* **Qué es:** Un "Fantasma". No muestra nada, pero escucha cuando cambias de página en la paginación y hace scroll suave hacia arriba. Pura mejora de experiencia de usuario.

---
*Este documento mapea la arquitectura física y lógica construida durante el desarrollo.*

---

## 📅 Fase 5: Módulo Administrativo y Gestión B2B 🏢
*Objetivo: Control centralizado y flujo B2B (Business-to-Business).*

### 13. `/src/app/admin/dashboard`
* **Ubicación:** Rutas protegidas exclusivas.
* **Qué es:** Panel de comando para administradores.
* **Separación de Responsabilidades:** Se separa visual y lógicamente del dashboard de usuario común (`/dashboard`). Implementa su propia tabla de gestión de empresas con acciones rápidas.

### 14. Server Actions de Gestión (`create`, `update`, `delete`)
* **Ubicación:** `/src/actions/admin/`
* **Lógica Avanzada:**
    *   `create-company.ts`: Transacción atómica (Crea Usuario + Perfil) e integración con **Resend** para envío inmediato de credenciales.
    *   `delete-company.ts`: Aprovecha **Cascade Delete** (configurado en Prisma) para eliminar una empresa y limpiar automáticamente todos sus trabajos y postulaciones asociadas sin dejar huérfanos.

### 15. `/src/components/admin/company-actions.tsx`
* **Ubicación:** Componente Cliente en Dashboard Admin.
* **Qué es:** Botonera interactiva para cada fila de la tabla.
* **UX/UI:** Implementa un patrón de **Double Tap Confirmation** (el icono cambia a advertencia al primer clic) en lugar de usar alertas nativas intrusivas, mejorando la experiencia de borrado seguro.

### 16. DevTools 2.0 (`impersonation`)
* **Mejora:** Se perfeccionó el sistema de "Modo Dios". Ahora permite saltar dinámicamente entre roles (Admin, Company, Candidate) redirigiendo automáticamente al dashboard correspondiente (`/admin/dashboard` vs `/dashboard`), eliminando la fricción al testear diferentes flujos de usuario.

### 17. Security Layer (The Iron Dome) 🛡️
* **NUEVO:** `src/lib/auth-guard.ts`
* **Función:** Centraliza la lógica de autorización.
    *   `requireAdminAction()`: Se inyecta al inicio de todas las Server Actions sensibles (`create`, `update`, `delete`). Si la petición no viene de un admin autenticado, lanza una excepción y aborta. Esto previene ataques vía API/Curl.
    *   `protectAdminRoute()`: Se usa en `src/app/admin/layout.tsx`. Protege toda la carpeta `/admin`. Si un usuario normal intenta entrar por URL, es redirigido a su dashboard correspondiente.

## 📅 Fase 5.5: Expansión del Admin Dashboard (Gestión de Personas y Contenido)
*Objetivo: Escalar el panel de control administración para manejar no solo empresas, sino todo el ecosistema.*

### 18. Tab-Based Navigation
*   **Refactorización UI/UX:** Se transformó el dashboard monolítico en una arquitectura de vistas (`src/components/admin/views/`).
*   **Separación:** Ahora existen secciones claras para "Empresas", "Candidatos" y "Habilidades" (Tags), accesibles vía URL params (`?view=...`), permitiendo compartir links directos a una sección específica manteniendo el estado.

### 19. Sistema de Clasificación y Tags ("Tag Garden") 🏷️
*   **Problemática:** La proliferación de etiquetas duplicadas (React, react.js, REACT) ensucia la base de datos.
*   **Solución:** Se implementó un ABM (Alta-Baja-Modificación) de Tags.
    *   **Creación Inline:** Un formulario minimalista en la cabecera del dashboard para estandarizar tecnologías al vuelo.
    *   **Contadores de Uso:** Visualización de cuántas ofertas utilizan cada tag antes de decidir borrarlo.

### 20. Gestión de Candidatos
*   **Control Total:** Los administradores ahora pueden ver la lista completa de talento registrado.
*   **Acciones:** Acceso directo a los CVs (PDF) subidos a Cloudinary y capacidad de eliminar usuarios conflictivos con borrado en cascada (User -> Applications -> Files).

### 21. Búsqueda Universal con Debounce
*   **Componente:** `src/components/admin/admin-search.tsx`
*   **Optimización:** Implementación de un buscador que filtra en tiempo real sobre las 3 vistas (Empresas, Candidatos, Tags).
*   **Performance:** Uso de técnica de **Debounce (300ms)** manual (sin librerías externas) para evitar saturar la base de datos con peticiones parciales mientras el usuario escribe.

### 22. Refactorización para DRY (Don't Repeat Yourself)
*   **Limpieza de Código:** Se detectó repetición en la lógica de botones de borrado.
*   **Solución:** Creación del componente genérico `DeleteButton.tsx`. Ahora, la lógica de "Double Tap Confirmation", feedback visual de carga y notificaciones Toast está centralizada. Si cambiamos la UX de borrado, cambia en toda la app automáticamente.

## 📅 Fase 6: Moderación de Contenido y Blindaje ("The Shield & The Gavel") 🛡️⚖️
*Objetivo: Control de calidad del contenido y protección contra errores humanos o malintencionados.*

### 23. Sistema de Moderación de Ofertas (The Gavel)
*   **Nueva Entidad:** Se agregó el campo `status` ("PUBLISHED" | "REJECTED") al modelo `Job`.
*   **Switch de Visibilidad:** En el Dashboard Admin, ahora se puede ocultar una oferta instantáneamente sin borrarla (Soft Ban).
*   **Filtrado Público:** La Home Page (`/`) ignora automáticamente cualquier oferta con status `REJECTED`, protegiendo la reputación del sitio.

### 24. Protocolo de "Usuarios Intocables" (The Shield)
*   **Riesgo:** Un admin comprometido o un error de dedo podría borrar al CEO o al Developer principal.
*   **Solución:** Implementación de `src/lib/protected-users.ts`.
*   **Lógica:** Una lista blanca (whitelist) de emails críticos. Las Server Actions `deleteUser` verifican esta lista antes de ejecutar. Si intentas borrar a un intocable, el sistema lanza un error "Acción Denegada".

### 25. Generación Masiva de Datos (Seeding V2)
*   **Herramienta:** `prisma/seed.ts` reescrito para generar volumen realista.
*   **Capacidad:** Crea automáticamete 10 empresas, 50 candidatos y 50 ofertas con tags y categorías variadas.
*   **Botón de Pánico:** Script `prisma/create-dev-user.ts` para restaurar acceso de Super Admin/Dev en segundos si la base de datos se corrompe o reinicia.
