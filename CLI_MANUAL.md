# 📟 CLI de Administración: Manual de Arquitectura y Uso

Este documento define la especificación técnica para la implementación de la **Interfaz de Línea de Comandos (CLI)** del proyecto. Esta herramienta permitirá realizar tareas administrativas, de mantenimiento y scripts masivos directamente desde la terminal, interactuando con la misma base de datos que la aplicación web.

---

## 🏗️ 1. Arquitectura Técnica

La "magia" de esta integración reside en compartir el cliente de base de datos. No se creará una API separada ni un backend paralelo.

*   **Core**: Node.js (ejecutado vía `ts-node` para soporte nativo de TypeScript).
*   **ORM**: Prisma Client (Se reusará la instancia o se generará una específica para scripts, importando los tipos generados).
*   **Librerías Clave**:
    *   `commander`: Para definir la estructura de comandos (ej: `app users:list`).
    *   `inquirer` / `@inquirer/prompts`: Para interactividad (selección de opciones, confirmaciones).
    *   `chalk`: Para estilizar la salida (colores, negritas).
    *   `ora`: Para feedback visual de procesos asíncronos (spinners).
    *   `figlet` (Opcional): Para un banner de inicio "cool".

### Diagrama de Flujo
```
[Admin Terminal] -> [CLI Script (Node.js)] -> [Prisma Client] -> [PostgreSQL DB]
                                                   ^
[Web App (Next.js)] -------------------------------|
```

---

## 📂 2. Estructura de Archivos Propuesta

El código del CLI vivirá aislado del código de la aplicación web (Next.js) para evitar conflictos de compilación, pero importará los tipos y modelos necesarios.

```bash
src/
├── cli/                        # NUEVO DIRECTORIO
│   ├── index.ts                # Punto de entrada (Router de comandos)
│   ├── utils.ts                # Helpers (formatos de fecha, loggers)
│   ├── commands/               # Módulos de lógica
│   │   ├── users.ts            # Gestión de usuarios (ban, promote, list)
│   │   ├── jobs.ts             # Gestión de ofertas (approve, clean)
│   │   └── db.ts               # Mantenimiento (seed, reset)
│   └── lib/
│       └── prisma.ts           # Cliente Prisma específico para CLI (si fuera necesario)
```

---

## 🛠️ 3. Catálogo de Comandos (Roadmap)

A continuación, los comandos que se implementarán.

### 👤 Gestión de Usuarios (`users`)
| Comando | Descripción | Argumentos |
| :--- | :--- | :--- |
| `stats` | Resumen rápido (total usuarios, roles). | - |
| `list` | Lista paginada de usuarios. | `--page <n>`, `--role <role>` |
| `promote` | Cambiar rol de usuario. | `<email> <new_role>` |
| `ban` | Desactivar acceso (borrado o flag). | `<email>` |

### 💼 Gestión de Ofertas (`jobs`)
| Comando | Descripción | Argumentos |
| :--- | :--- | :--- |
| `pending` | Listar ofertas pendientes de aprobación. | - |
| `approve` | Aprobar una oferta específica. | `<id>` |
| `clean-old` | Borrar ofertas > 6 meses. | `--dry-run` (simulacro) |

### 🔧 Mantenimiento (`system`)
| Comando | Descripción | Argumentos |
| :--- | :--- | :--- |
| `seed` | Poblar BD con datos falsos. | `--count <n>` |
| `health` | Verificar conexión BD y servicios. | - |

### 🏷️ Gestión de Tags (`tags`)
| Comando | Descripción | Argumentos |
| :--- | :--- | :--- |
| `list` | Listar tags y uso. | `--sort usage` |
| `add` | Crear tag estandarizado. | `<name> <type>` |
| `prune` | Borrar tags sin uso (0 jobs). | `--dry-run` |

| `add` | Crear tag estandarizado. | `<name> <type>` |
| `prune` | Borrar tags sin uso (0 jobs). | `--dry-run` |

### 🚨 Scripts de Emergencia (Sin CLI)
Estos scripts se ejecutan directamente con `ts-node` antes de que el CLI esté construido:

*   **Restaurar Super Admin:**
    `npx ts-node prisma/create-dev-user.ts`
    *(Crea o actualiza al usuario dev/admin si perdiste el acceso)*

*   **Poblar Base de Datos (Reset):**
    `npx prisma db seed`
    *(BORRA TODO y crea 50+ registros de prueba)*

---

## 🚀 4. Guía de Implementación (Paso a Paso)

Cuando des la orden de inicio, seguiremos este plan:

1.  **Instalación de Dependencias**:
    ```bash
    npm install commander inquirer chalk ora figlet
    npm install --save-dev @types/inquirer @types/figlet ts-node
    ```

2.  **Configuración del `package.json`**:
    Añadiremos un script abreviado para facilitar el uso:
    ```json
    "scripts": {
      "cli": "ts-node src/cli/index.ts"
    }
    ```

3.  **Desarrollo del Core**:
    Crear `src/cli/index.ts` con la configuración base de `commander`.

4.  **Implementación de Módulos**:
    Desarrollar cada archivo en `src/cli/commands/` de forma modular.

---

## ⚠️ 5. Reglas de Seguridad

Aunque es una herramienta interna:
1.  **Confirmaciones**: Acciones destructivas (`delete`, `ban`) DEBEN requerir confirmación explícita (`Are you sure? Y/n`).
2.  **Dry Run**: Comandos de limpieza masiva deben tener modo "simulacro" por defecto.
3.  **Logging**: (Opcional) Registrar en un archivo `.log` local las acciones administrativas realizadas.

---

*Este documento sirve como "Handoff" para la creación del CLI. Cuando estés listo, procede con el Paso 1 de la Guía de Implementación.*
