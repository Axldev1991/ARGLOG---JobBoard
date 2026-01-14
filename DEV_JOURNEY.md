# 📘 Bitácora de Desarrollo: Job Board Premium

Este documento narra la evolución técnica, las decisiones arquitectónicas y los aprendizajes obtenidos durante la construcción de esta plataforma de empleos. Es una guía viva de cómo pasamos de un "Hola Mundo" a una aplicación de producción robusta, segura y con una UI de alto nivel.

---

## 🏗️ Fase 1: Los Cimientos (Auth & Data Layer)
**Fecha:** 10 - 11 de Enero de 2026

El objetivo inicial fue establecer una base sólida. No queríamos una demo frágil, sino una arquitectura escalable.

### 🧠 Tecnologías y Aprendizajes Clave

#### **1. Next.js 15 & App Router**
Decidimos usar la última versión estable de Next.js.
*   **Lección:** El cambio mental de `pages/` a `app/` es fundamental.
    *   **Server Components (Default):** Aprendimos que todo componente es "Servidor" por defecto. Esto significa que podemos acceder a la Base de Datos (`prisma.job.findMany`) directamente dentro del componente. ¡Adiós a `useEffect` para hacer fetch de datos iniciales!
    *   **Client Components (`"use client"`):** Solo los usamos cuando necesitamos interactividad (onClick, hooks, estados). Esto reduce drásticamente el JavaScript que enviamos al navegador.

#### **2. Server Actions**
En lugar de crear una API REST (`/api/login`, `/api/register`), utilizamos **Server Actions**.
*   **¿Por qué?:** Son funciones asíncronas que corren en el servidor pero se pueden importar y llamar desde el cliente (o usar en `action` de formularios HTML).
*   **Ventaja:** Tipo seguro (TypeScript sabe qué entra y qué sale) y cero boilerplate de API.

#### **3. Base de Datos: PostgreSQL + Neon + Prisma**
*   **Neon:** Elegimos Neon por ser una base de datos PostgreSQL "Serverless". Escala a cero si no se usa y es rapidísima para Vercel.
*   **Prisma ORM:**
    *   Definimos el esquema en `schema.prisma` (`User`, `Job`).
    *   **Migraciones:** Aprendimos que cada cambio en el esquema requiere un `npx prisma migrate dev` para sincronizar la base de datos real.

**Hitos de esta fase:**
*   Sistema de Registro y Login (sin librerías externas pesadas como Auth.js, sino cookies/sesiones manuales para control total).
*   Roles de usuario: `CANDIDATE` vs `COMPANY` vs `ADMIN`.

---

## 🛠️ Fase 2: Gestión de Ofertas y Dashboard
**Fecha:** 12 de Enero de 2026

Con la autenticación lista, construimos el corazón de la app: el ABM (Alta, Baja, Modificación) de ofertas.

### 🧠 Desafíos Técnicos

#### **1. CRUD con Server Actions**
Implementamos la creación de empleos (`createJob`), edición y borrado.
*   **Reto:** ¿Cómo proteger estas acciones?
*   **Solución:** Creamos funciones utilitarias como `getSession()` y verificaciones de rol dentro de cada Server Action. *Security by Design*.

#### **2. UI/UX con Tailwind CSS y Shadcn/ui**
*   Adoptamos **Shadcn** para componentes base (Botones, Inputs, Cards).
*   **Filosofía:** No es una librería que se instala y no se toca. Es código que *copias y pegas* en tu proyecto. Esto nos dio control total para modificar el `Button` (como hicimos hoy agregando el tamaño `icon`).

---

## 👤 Fase 3: El Candidato y la Gestión de Archivos
**Fecha:** 13 de Enero de 2026 (Mañana/Tarde)

Aquí la aplicación dejó de ser un simple CRUD para convertirse en una plataforma operativa real.

### 🧠 Integración Crítica: Cloudinary

**El Problema:** Necesitábamos que los usuarios subieran su CV en PDF.
**El Error Común:** Guardar el archivo binario (blob) en PostgreSQL. Esto hace la base de datos lenta y costosa.
**La Solución:** Usar un almacenamiento de objetos (Cloudinary).

*   **Flujo Implementado:**
    1.  El usuario selecciona el PDF.
    2.  El servidor (Action) recibe el `FormData`.
    3.  Convertimos el archivo a `Buffer` y lo subimos a Cloudinary.
    4.  **Clave:** Solo guardamos la **URL** (`secure_url`) y el **Public ID** en nuestra base de datos Postgres.

### 🧠 Postulaciones (Relaciones SQL)
Creamos la tabla `Application` que conecta `User` y `Job`.
*   **Lógica de Negocio:** Un usuario no puede postularse dos veces a la misma oferta. Esto se validó en el backend (`findFirst` antes de crear).

---

## 🏢 Fase 4: La Experiencia "Premium" (Empresa & Home)
**Fecha:** 13 de Enero de 2026 (Noche)

El sprint final. El objetivo era pulir, profesionalizar y optimizar.

### 🧠 Refactorización Visual (Dark Mode Puro)
Pasamos de una mezcla de blanco/oscuro a un tema **"Midnight Blue"** consistente (`slate-950`, `slate-900`, `slate-800`).
*   **Detalles:** Bordes sutiles, sombras suaves y colores de acento vibrantes (Azul eléctrico, Naranja quemado).
*   **Iconografía:** Eliminamos todos los emojis (🚀, 🏢) y los reemplazamos por **Lucide React Icons** (SVGs vectoriales) para una apariencia profesional y escalable.

### 🧠 Algoritmos de Filtrado y Búsqueda
Reescribimos la `Home` (`page.tsx`) para soportar filtros complejos.
*   **URL as State:** Decidimos que los filtros (Búsqueda, Categoría, Tags) vivan en la URL (`?q=react&category=dev`).
    *   **¿Por qué?** Permite compartir el link con la búsqueda exacta. Si recargas la página, no pierdes tu búsqueda.

### 🧠 El Carrusel Híbrido y la Paginación
El desafío era mostrar "Destacados" sin duplicar contenido ni romper la UX.

1.  **Tecnología:** `embla-carousel-react` para el slider suave.
2.  **Lógica de Exclusión Inteligente:**
    *   Si el usuario está en modo "Descubrimiento" (sin filtros), mostramos el carrusel con el Top 6 y **excluimos** esos 6 de la lista principal para evitar duplicados.
    *   Si el usuario está en modo "Búsqueda" (ej: buscando "Excel"), desactivamos la exclusión para garantizar que vea *todos* los resultados relevantes, aunque estén en el carrusel.
3.  **Client Component para UX:** Creamos `<ScrollToTopOnChange />` para que, al cambiar de página, la vista suba suavemente al inicio de la lista, sin recargar toda la web bruscamente.

---

## 🚀 Estado Actual y Futuro

**Logrado:**
*   ✅ Plataforma 100% funcional End-to-End.
*   ✅ Seguridad robusta y validación de datos.
*   ✅ UI de nivel comercial ("Premium").

**Próximos Pasos Posibles:**
*   📧 Emails transaccionales (cuando alguien se postula).
*   📊 Analytics para empresas (vistas por oferta).
*   🤖 IA para matchear candidatos con ofertas automáticamente.

---
*Documento generado automáticamente por tu Asistente de IA (Antigravity).*
