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
