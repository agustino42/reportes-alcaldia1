# Sistema de Recepción y Trazabilidad de Incidencias Ciudadanas

**Alcaldía del Municipio Barinas, Estado Barinas**

Aplicación web para la recepción, registro, seguimiento y trazabilidad de incidencias y solicitudes ciudadanas, orientada a la gestión pública municipal. Los ciudadanos pueden reportar problemas en su comunidad y recibir un código único para dar seguimiento en tiempo real, mientras que el personal administrativo puede gestionar, clasificar y dar respuesta a cada caso.

---

## Stack Tecnológico Real (Implementado)

| Tecnología | Versión | Propósito |
|---|---|---|
| **Next.js** | 16.2.3 | Framework full-stack con React Server Components y API Routes |
| **React** | 19.2.4 | Biblioteca de interfaz de usuario |
| **TypeScript** | 5.x | Tipado estático y seguridad en tiempo de compilación |
| **Prisma** | 5.22.0 | ORM con typesafety, migraciones y explorador de base de datos |
| **SQLite** | — | Motor de base de datos relacional embebido |
| **Tailwind CSS** | 4.x | Framework de estilos utilitario y diseño responsive |
| **Radix UI** | 1.4.3 | Componentes de UI headless accesibles |
| **Shadcn UI** | 4.2.0 | Componentes reutilizables construidos sobre Radix UI |
| **Framer Motion** | 12.38.0 | Animaciones y transiciones declarativas |
| **Zustand** | 5.0.12 | Estado global liviano |
| **React Hook Form** | 7.72.1 | Manejo de formularios con rendimiento optimizado |
| **Zod** | 4.3.6 | Validación de esquemas con inferencia de tipos |
| **Socket.IO Client** | 4.8.3 | Comunicación en tiempo real (notificaciones) |
| **Lucide React** | 1.8.0 | Iconografía SVG moderna y consistente |
| **xlsx** | 0.18.5 | Exportación de reportes a Excel |
| **class-variance-authority** | 0.7.1 | Variantes de componentes utilitarias |
| **tailwind-merge** | 3.5.0 | Fusión inteligente de clases Tailwind |
| **tw-animate-css** | 1.4.0 | Utilidades de animación para Tailwind |

## Módulos del Sistema

- **Reporte Ciudadano** — Formulario inteligente con autocompletado de ubicaciones, categorías y plantillas de descripción. Genera un código alfanumérico único de 6 caracteres para seguimiento.
- **Seguimiento** — Consulta pública del estado de una incidencia mediante su código de trazabilidad.
- **Panel Administrativo** — Dashboard con estadísticas en tiempo real (totales, pendientes, en revisión, completados), tabla de casos con cambio de estatus, gestión de funcionarios, asignación de casos, generación de reportes y configuración.
- **Autenticación** — Sesión basada en cookies con middleware de protección de rutas (admin, gestión) y redirección inteligente.

## Roles del Sistema

| Rol | Descripción |
|---|---|
| **CITIZEN** | Ciudadano que reporta incidencias y consulta estatus |
| **ADMIN** | Administrador con acceso completo al panel |
| **TECHNICIAN** | Técnico asignado a la gestión y resolución de casos |

## Arquitectura

```
sistema-barinas/
├── prisma/
│   ├── schema.prisma    # Modelo de datos (User, Incident, Employee)
│   └── dev.db           # Base de datos SQLite
├── src/
│   ├── app/
│   │   ├── api/         # API Routes (REST)
│   │   │   ├── admin/   #   - Endpoints administrativos
│   │   │   └── incidents/ # - CRUD de incidencias
│   │   ├── admin/       # Panel administrativo
│   │   ├── gestion/     # Gestión de casos
│   │   ├── login/       # Autenticación
│   │   ├── reportar/    # Formulario ciudadano
│   │   └── seguimiento/ # Consulta de estatus
│   ├── components/      # Componentes reutilizables
│   │   ├── dashboard/   #   - Componentes del dashboard
│   │   └── ui/          #   - Componentes base (Shadcn)
│   ├── contexts/        # Contextos de React
│   ├── lib/             # Utilidades y configuraciones
│   │   ├── db.ts        #   - Cliente Prisma singleton
│   │   └── incidents/   #   - Lógica de incidencias
│   └── middleware.ts    # Protección de rutas
└── public/              # Assets estáticos
```

---

## Comparativa: Tecnología Propuesta en la Tesis vs. Tecnología Implementada

La tesis original planteaba un stack basado en PHP/Laravel + Vue.js. A continuación se presenta una comparación detallada con las tecnologías efectivamente implementadas:

### Tabla Comparativa

| Aspecto | Propuesto en la Tesis | Implementado | Justificación del Cambio |
|---|---|---|---|
| **Framework Backend** | Laravel (PHP) | Next.js API Routes (TypeScript) | Next.js unifica frontend y backend en un solo proyecto, eliminando la necesidad de mantener dos repositorios o servidores distintos. TypeScript ofrece tipado estático que previene errores en tiempo de compilación. |
| **Frontend** | Vue.js | React 19 | React 19 introduce Server Components, que permiten renderizar partes de la interfaz en el servidor, reduciendo el JavaScript enviado al cliente y mejorando el rendimiento percibido. |
| **Lenguaje Principal** | PHP + JavaScript | TypeScript | TypeScript permite detectar errores en tiempo de compilación, mejora la experiencia de desarrollo con autocompletado y refactorización, y es el lenguaje estándar en la industria para aplicaciones web modernas. |
| **ORM / Base de Datos** | Eloquent (Laravel) + MySQL | Prisma + SQLite | Prisma ofrece seguridad de tipos nativa (end-to-end typesafety), generación automática de tipos, y una sintaxis declarativa superior. SQLite simplifica el despliegue al no requerir un servidor de base de datos separado, siendo ideal para prototipos funcionales y entornos académicos. |
| **UI Framework** | Componentes Vue nativos | Tailwind CSS 4 + Radix UI + Shadcn | Tailwind CSS permite un diseño responsive rápido sin escribir CSS personalizado. Radix UI proporciona componentes accesibles con soporte nativo de teclado y lectores de pantalla. Shadcn ofrece componentes reutilizables y personalizables. |
| **Validación de Formularios** | Validación manual en PHP/Laravel | React Hook Form + Zod | Zod permite definir esquemas de validación que infieren tipos automáticamente, sincronizando la validación del frontend y backend con un solo esquema. |
| **Estado Global** | Vuex / Pinia | Zustand | Zustand es significativamente más liviano, con una API mínima y sin boilerplate. Su tamaño de ~1KB lo hace ideal para mantener el bundle pequeño. |
| **Comunicación en Tiempo Real** | No especificado | Socket.IO Client | Se incorporó para permitir notificaciones en tiempo real a los administradores cuando un ciudadano reporta una nueva incidencia. |
| **Exportación de Datos** | No especificado | xlsx (SheetJS) | Se incorporó para permitir la exportación de reportes estadísticos a Excel, facilitando el análisis de datos por parte de la administración municipal. |

### ¿Por qué Next.js + React en lugar de Laravel + Vue?

1. **Unificación del stack**: Next.js permite desarrollar frontend y backend en un mismo proyecto con TypeScript, eliminando el cambio de contexto entre PHP y JavaScript.

2. **Rendimiento**: React Server Components permiten renderizar contenido en el servidor, reduciendo el JavaScript enviado al cliente y mejorando los tiempos de carga, especialmente importante para usuarios con conexiones limitadas.

3. **Escalabilidad**: Next.js ofrece optimizaciones incorporadas como división de código, carga diferida (lazy loading), optimización de imágenes y compilación incremental.

4. **Seguridad de tipos**: TypeScript + Prisma proporcionan tipado completo desde la base de datos hasta la interfaz de usuario, detectando errores en tiempo de compilación.

5. **Cumplimiento funcional**: A pesar del cambio tecnológico, todos los requerimientos funcionales definidos en la tesis —recepción de incidencias, trazabilidad mediante código único, panel administrativo con estadísticas, gestión de funcionarios y generación de reportes— fueron implementados completamente.

---

## Requisitos

- **Node.js** 18+ (recomendado 20+)
- **npm** o **pnpm**

## Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd sistema-barinas

# 2. Instalar dependencias
npm install

# 3. Copiar variables de entorno
cp .env.example .env

# 4. Generar el cliente de Prisma y aplicar migraciones
npx prisma generate
npx prisma db push

# 5. Iniciar el servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Licencia

Proyecto desarrollado con fines académicos como trabajo de grado.
