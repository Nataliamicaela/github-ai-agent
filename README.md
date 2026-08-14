# 🤖 GitHub AI Agent

> MCP Server desarrollado con Node.js y TypeScript para automatizar operaciones de GitHub mediante agentes de inteligencia artificial y lenguaje natural.

## 📑 Índice

- [📖 Descripción](#-descripción)
- [🧠 Chatbots, asistentes AI y AI Agents](#-chatbots-asistentes-ai-y-ai-agents)
- [✨ Features](#-features)
- [🛠️ Tecnologías utilizadas](#️-tecnologías-utilizadas)
- [🏗️ Arquitectura](#️-arquitectura)
- [🔄 Flujo de una solicitud](#-flujo-de-una-solicitud)
- [🧰 Tools disponibles](#-tools-disponibles)
- [🔐 Seguridad y autenticación](#-seguridad-y-autenticación)
- [🚀 Instalación y ejecución local](#-instalación-y-ejecución-local)
- [🤖 Configuración en Antigravity](#-configuración-en-antigravity)
- [🔎 MCP Inspector](#-mcp-inspector)
- [🧪 Testing](#-testing)
- [📁 Estructura del proyecto](#-estructura-del-proyecto)
- [💬 Ejemplos de uso](#-ejemplos-de-uso)
- [🐛 Troubleshooting](#-troubleshooting)
- [🧠 Decisiones técnicas y aprendizajes](#-decisiones-técnicas-y-aprendizajes)
- [🤖 Uso de Inteligencia Artificial](#-uso-de-inteligencia-artificial)
- [📄 Licencia](#-licencia)
- [👩‍💻 Autor](#-autor)

---

## 📖 Descripción

GitHub AI Agent es un MCP Server desarrollado como Proyecto Integrador de la especialización Backend.

El proyecto permite conectar un agente de inteligencia artificial con la API de GitHub mediante el Model Context Protocol (MCP), haciendo posible ejecutar distintas operaciones sobre repositorios utilizando lenguaje natural.

El servidor está desarrollado con Node.js y TypeScript y utiliza el SDK oficial de MCP para exponer herramientas que pueden ser seleccionadas e invocadas por el agente de IA.

La comunicación con GitHub se realiza mediante Octokit, mientras que Zod se utiliza para validar los parámetros recibidos por las diferentes herramientas.

Además, el proyecto incorpora un sistema de manejo de errores personalizado, retry logic con exponential backoff para situaciones de rate limiting y una suite de tests unitarios desarrollada con Vitest.

---

## 🧠 Chatbots, asistentes AI y AI Agents

Una diferencia fundamental para comprender este proyecto es distinguir entre un chatbot, un asistente de inteligencia artificial y un AI Agent.

- **Chatbot:** está orientado principalmente a mantener una conversación con el usuario y generar respuestas.
- **Asistente AI:** además de conversar, puede ayudar al usuario a realizar tareas a partir de sus instrucciones.
- **AI Agent:** puede interpretar un objetivo, decidir qué herramienta necesita utilizar y ejecutar acciones sobre sistemas externos.

En este proyecto, el AI Agent puede interpretar una solicitud realizada en lenguaje natural, seleccionar una de las tools disponibles y utilizar nuestro MCP Server para ejecutar una operación real sobre GitHub.

---

## ✨ Features

- 🤖 Integración con agentes de inteligencia artificial mediante Model Context Protocol.
- 🐙 Integración con GitHub API mediante Octokit.
- 🧰 7 tools para automatizar operaciones de GitHub.
- 🎯 5 tools correspondientes a los requerimientos funcionales mínimos.
- ⭐ 2 tools adicionales de GitHub para trabajar con Pull Requests.
- 🛠️ 3 tools auxiliares: `ping`, `sum` y `slugify`.
- ✅ Validación de inputs mediante Zod.
- 🛡️ Manejo de errores personalizado.
- 🔄 Retry logic con exponential backoff para situaciones de rate limiting.
- 🔐 Autenticación mediante GitHub Personal Access Token.
- 📡 Comunicación entre el Host y el MCP Server mediante `stdio`.
- 🔎 Integración con MCP Inspector para debugging.
- 🧪 Suite de 27 tests unitarios con Vitest.
- 🚀 Ejecución en modo desarrollo y producción mediante scripts de npm.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| Node.js 18+ | Runtime de ejecución |
| TypeScript | Desarrollo y tipado estático |
| Model Context Protocol | Comunicación entre el agente y el servidor |
| `@modelcontextprotocol/sdk` | Implementación del MCP Server |
| `@octokit/rest` | Integración con GitHub API |
| Zod | Validación de inputs |
| Vitest | Testing unitario |
| dotenv | Gestión de variables de entorno |
| MCP Inspector | Inspección y debugging del servidor |
| Git / GitHub | Control de versiones |

---

## 🏗️ Arquitectura

GitHub AI Agent utiliza una arquitectura basada en Model Context Protocol (MCP), donde el Host, el cliente MCP y el MCP Server trabajan en conjunto para ejecutar operaciones sobre GitHub.

### 🖥️ Host — Antigravity

Antigravity actúa como el Host de la aplicación.

Es el entorno desde el cual el usuario interactúa con el agente de inteligencia artificial y donde se configura y ejecuta nuestro MCP Server.

### 🧠 LLM — Cliente MCP

El modelo de inteligencia artificial interpreta las solicitudes realizadas mediante lenguaje natural y determina qué herramienta del MCP Server debe utilizar.

Para tomar esta decisión, utiliza la información proporcionada por las descripciones y schemas de las tools.

### ⚙️ MCP Server — GitHub AI Agent

GitHub AI Agent es el MCP Server del proyecto.

Su responsabilidad es:

1. recibir las solicitudes provenientes del cliente MCP;
2. identificar la herramienta solicitada;
3. validar sus parámetros;
4. ejecutar la operación correspondiente;
5. comunicarse con GitHub mediante Octokit;
6. devolver el resultado al cliente.

### 🐙 GitHub API

GitHub es el servicio externo sobre el cual se ejecutan las operaciones.

La comunicación se realiza mediante Octokit y requiere autenticación mediante un GitHub Personal Access Token.

### 📊 Diagrama de arquitectura

```text
┌─────────────────────────────┐
│         Antigravity         │
│            HOST             │
│                             │
│       Interacción           │
│        del usuario          │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│             LLM             │
│        CLIENTE MCP          │
│                             │
│ Interpreta el lenguaje      │
│ natural y selecciona tools  │
└──────────────┬──────────────┘
               │
               │ MCP / stdio
               ▼
┌─────────────────────────────┐
│       GitHub AI Agent       │
│         MCP SERVER          │
│                             │
│  Tools → Schemas →          │
│  Operations → Errors        │
│             ↓               │
│      Retry / Backoff        │
└──────────────┬──────────────┘
               │
               │ Octokit
               ▼
┌─────────────────────────────┐
│         GitHub API          │
└─────────────────────────────┘
```

---

## 🔄 Flujo de una solicitud

Ante una solicitud realizada mediante lenguaje natural, el flujo de ejecución es:

```text
Usuario
   ↓
Antigravity
   ↓
LLM
   ↓
Selección de la tool
   ↓
MCP Server
   ↓
Validación con Zod
   ↓
Operación mediante Octokit
   ↓
GitHub API
   ↓
Resultado
   ↓
MCP Server
   ↓
LLM
   ↓
Usuario
```

Por ejemplo, ante la solicitud:

> "Creá un issue en mi repositorio `github-ai-agent-test` con el título `Mejora de documentación`."

el LLM puede seleccionar `create_issue` y construir los parámetros necesarios.

El MCP Server valida los datos mediante `CreateIssueInputSchema`. Si la validación es correcta, la operación continúa hacia Octokit y posteriormente hacia la API de GitHub.

Finalmente, el resultado vuelve a través del MCP Server y el agente puede comunicarlo al usuario mediante lenguaje natural.

### 🧠 Importancia de las descripciones de las tools

El LLM no recibe únicamente una lista de funciones. También recibe información sobre qué hace cada tool, qué parámetros necesita y qué significa cada parámetro.

Por este motivo, las descripciones deben ser claras y específicas. Una descripción adecuada ayuda al LLM a distinguir qué herramienta corresponde utilizar ante cada solicitud.

---

## 🧰 Tools disponibles

El servidor implementa 7 tools específicas de GitHub.

### 🎯 Tools principales

#### `create_repository`

Crea un nuevo repositorio en GitHub.

**Parámetros:**

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `name` | `string` | Sí | Nombre del repositorio |
| `description` | `string` | No | Descripción del repositorio |
| `private` | `boolean` | No | Indica si será privado |

**Ejemplo de prompt:**

> "Creá un repositorio llamado `mi-proyecto-api`, con la descripción `API de prueba`, y hacelo privado."

#### `create_issue`

Crea un nuevo issue dentro de un repositorio.

**Parámetros:**

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `owner` | `string` | Sí | Usuario u organización propietaria |
| `repo` | `string` | Sí | Nombre del repositorio |
| `title` | `string` | Sí | Título del issue |
| `body` | `string` | No | Descripción del issue |

**Ejemplo de prompt:**

> "Creá un issue en `Nataliamicaela/github-ai-agent-test` con el título `Mejora de documentación`."

#### `list_repositories`

Lista los repositorios disponibles para el usuario autenticado.

**Parámetros:** no requiere parámetros.

**Ejemplo de prompt:**

> "Mostrame mis repositorios de GitHub."

#### `create_commit`

Crea o modifica un archivo dentro de un repositorio y genera un commit.

**Parámetros:**

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `owner` | `string` | Sí | Usuario u organización propietaria |
| `repo` | `string` | Sí | Repositorio |
| `path` | `string` | Sí | Ruta del archivo |
| `message` | `string` | Sí | Mensaje del commit |
| `content` | `string` | Sí | Contenido completo del archivo |
| `branch` | `string` | No | Rama donde realizar el commit |
| `sha` | `string` | No | SHA del archivo existente |

Para modificar un archivo existente, GitHub requiere el SHA correspondiente al archivo.

**Ejemplo de prompt:**

> "Creá `docs/mcp.md` en `Nataliamicaela/github-ai-agent-test`, escribí una explicación de MCP y hacé un commit llamado `Agrega documentación sobre MCP`."

#### `list_issues`

Lista los issues abiertos de un repositorio.

**Parámetros:**

| Parámetro | Tipo | Requerido |
|---|---|---|
| `owner` | `string` | Sí |
| `repo` | `string` | Sí |

**Ejemplo de prompt:**

> "Mostrame los issues abiertos de `Nataliamicaela/github-ai-agent-test`."

### ⭐ Tools adicionales

#### `list_pull_requests`

Lista los Pull Requests abiertos de un repositorio.

**Parámetros:**

| Parámetro | Tipo | Requerido |
|---|---|---|
| `owner` | `string` | Sí |
| `repo` | `string` | Sí |

**Ejemplo de prompt:**

> "Listame los Pull Requests abiertos de `Nataliamicaela/github-ai-agent-test`."

#### `create_pull_request`

Crea un Pull Request entre dos ramas.

**Parámetros:**

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `owner` | `string` | Sí | Usuario u organización propietaria |
| `repo` | `string` | Sí | Repositorio |
| `title` | `string` | Sí | Título del Pull Request |
| `body` | `string` | No | Descripción |
| `head` | `string` | Sí | Rama que contiene los cambios |
| `base` | `string` | Sí | Rama que recibirá los cambios |

**Ejemplo de prompt:**

> "Creá un Pull Request desde `feature/readme` hacia `main` en `Nataliamicaela/github-ai-agent-test`, con el título `Actualiza README`."

### 🛠️ Tools auxiliares

El proyecto también contiene tres tools auxiliares utilizadas durante el desarrollo y la demostración del servidor:

- `ping`
- `sum`
- `slugify`

Estas herramientas no forman parte de las 7 operaciones específicas de GitHub documentadas anteriormente.

---

## 🔐 Seguridad y autenticación

El servidor se autentica ante GitHub mediante un GitHub Personal Access Token (PAT).

El token se obtiene mediante una variable de entorno:

`GITHUB_TOKEN`

Nunca debe estar hardcodeado en el código fuente.

### 🔑 Cómo obtener el token

Desde GitHub:

1. Iniciar sesión en la cuenta.
2. Abrir la configuración de la cuenta.
3. Acceder a la sección de Developer settings.
4. Crear un Personal Access Token.
5. Seleccionar los permisos necesarios.
6. Generar el token y copiarlo de forma segura.

### 🔐 Scopes requeridos

Para este proyecto, la consigna establece los siguientes scopes:

- `repo`
- `user`
- `admin:org`

Estos permisos permiten realizar las operaciones necesarias sobre repositorios, información del usuario y organizaciones.

### 📄 Configuración de `.env`

El proyecto incluye un `.env.example` con:

`GITHUB_TOKEN=`

Para utilizar el proyecto localmente, crear un archivo `.env` en la raíz y completar el token:

`GITHUB_TOKEN=tu_token_aqui`

El archivo `.env` no debe subirse al repositorio.

### 🛡️ Protección mediante `.gitignore`

El `.gitignore` del proyecto excluye:

- `node_modules/`
- `dist/`
- `.env`

Esto evita versionar dependencias, archivos generados y credenciales locales.

> ⚠️ Si un token se expone accidentalmente, debe revocarse inmediatamente y reemplazarse por uno nuevo.

---

## 🚀 Instalación y ejecución local

### Requisitos

- Node.js 18 o superior
- npm
- Git
- Cuenta de GitHub
- GitHub Personal Access Token
- Antigravity
- MCP Inspector

### 1. Clonar el repositorio

```bash
git clone https://github.com/Nataliamicaela/github-ai-agent.git
cd github-ai-agent
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear `.env` tomando `.env.example` como referencia y completar el token.

### 4. Compilar TypeScript

```bash
npm run build
```

El código fuente de `src/` se compila en `dist/`.

### 5. Ejecutar la versión compilada

```bash
npm start
```

### 💻 Desarrollo

```bash
npm run dev
```

### 🔎 Type checking

```bash
npm run typecheck
```

### 🧪 Tests

```bash
npm run test
```

---

## 🤖 Configuración en Antigravity

Antigravity actúa como Host del MCP Server.

Después de compilar el proyecto con:

```bash
npm run build
```

el entry point compilado se encuentra en:

`dist/index.js`

La configuración del MCP Server debe utilizar `node` como comando y apuntar al archivo compilado.

Ejemplo:

```json
{
  "mcpServers": {
    "github-ai-agent": {
      "command": "node",
      "args": [
        "C:/ruta/al/proyecto/dist/index.js"
      ],
      "env": {
        "GITHUB_TOKEN": "tu_token_aqui"
      }
    }
  }
}
```

La ruta debe reemplazarse por la ubicación real del proyecto en cada equipo.

Después de guardar la configuración, reiniciar o recargar Antigravity para que vuelva a cargar el servidor.

Una vez conectado, el Host debe reconocer las tools disponibles.

---

## 🔎 MCP Inspector

MCP Inspector permite inspeccionar y probar el MCP Server antes de utilizarlo desde Antigravity.

El proyecto incluye el script:

```bash
npm run inspector
```

Esta herramienta permite verificar:

- que el servidor inicia correctamente;
- que la comunicación MCP funciona;
- que las tools están registradas;
- los parámetros de cada tool;
- las respuestas generadas;
- posibles errores durante la ejecución.

Se recomienda comprobar el funcionamiento con MCP Inspector antes de realizar la demostración final en Antigravity.

---

## 🧪 Testing

El proyecto cuenta con una suite de 27 tests unitarios desarrollados con Vitest.

**Resultado actual:**

- 4 archivos de test
- 27 tests
- 27 tests pasando
- 0 errores

### `schemas.test.ts` — 14 tests

Comprueba la validación de inputs mediante Zod:

- nombres de repositorio válidos;
- longitud mínima y máxima;
- caracteres inválidos;
- descripción;
- tipos de datos;
- campos obligatorios y opcionales;
- límites de título y body.

### `github.test.ts` — 3 tests

Prueba las operaciones de GitHub utilizando mocks de Octokit.

Las llamadas reales a GitHub no se realizan durante estos tests.

### `errors.test.ts` — 5 tests

Comprueba la transformación de errores:

- `401` → `AuthenticationError`
- `403` → `GitHubAPIError`
- `404` → `GitHubAPIError`
- errores de red → `NetworkError`
- errores inesperados → `GitHubAPIError`

### `retry.test.ts` — 5 tests

Comprueba:

- reintentos ante rate limiting;
- detección de errores `429`;
- exponential backoff;
- ausencia de retries para errores que no corresponden a rate limiting;
- límite máximo de reintentos.

Los tests utilizan mocks y timers controlados para mantenerse rápidos y determinísticos.

### Ejecutar tests

```bash
npm run test
```

---

## 📁 Estructura del proyecto

```text
github-ai-agent/
│
├── src/
│   ├── errors/
│   │   ├── handler.ts
│   │   └── index.ts
│   │
│   ├── github/
│   │   ├── client.ts
│   │   └── operations.ts
│   │
│   ├── schemas/
│   │   └── index.ts
│   │
│   ├── tools/
│   │   ├── create-commit.ts
│   │   ├── create-issue.ts
│   │   ├── create-pull-request.ts
│   │   ├── create-repository.ts
│   │   ├── list-issues.ts
│   │   ├── list-pull-requests.ts
│   │   ├── list-repositories.ts
│   │   ├── ping.ts
│   │   ├── slugify.ts
│   │   └── sum.ts
│   │
│   ├── utils/
│   │   └── retry.ts
│   │
│   └── index.ts
│
├── tests/
│   ├── errors.test.ts
│   ├── github.test.ts
│   ├── retry.test.ts
│   └── schemas.test.ts
│
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

### Responsabilidad de las capas

- `tools/` → define las herramientas expuestas por el MCP Server.
- `schemas/` → contiene los schemas de Zod.
- `github/` → contiene el cliente de Octokit y las operaciones contra GitHub.
- `errors/` → define errores personalizados y transforma errores técnicos.
- `utils/` → contiene utilidades compartidas como retry.
- `index.ts` → entry point del MCP Server.
- `tests/` → contiene la suite de tests unitarios.

---

## 💬 Ejemplos de uso

### Crear un repositorio

> "Creá un repositorio llamado `demo-mcp` con la descripción `Repositorio creado mediante MCP`."

### Crear un issue

> "Creá un issue en `Nataliamicaela/github-ai-agent-test` llamado `Agregar documentación`."

### Listar repositorios

> "Mostrame mis repositorios de GitHub."

### Crear un archivo mediante un commit

> "Creá `docs/mcp.md` en mi repositorio con una explicación de Model Context Protocol y hacé un commit llamado `Agrega documentación sobre MCP`."

### Listar issues

> "Mostrame los issues abiertos de `github-ai-agent-test`."

### Listar Pull Requests

> "Mostrame los Pull Requests abiertos de mi repositorio."

### Crear un Pull Request

> "Creá un Pull Request desde `feature/readme` hacia `main` con el título `Actualiza documentación`."

---

## 🐛 Troubleshooting

### `GITHUB_TOKEN no está configurado`

Verificar que exista `.env` en la raíz del proyecto y contenga:

`GITHUB_TOKEN=tu_token`

### Error `401 Unauthorized`

Verificar que el token sea válido y que tenga los scopes necesarios.

### Error `403 Forbidden`

Puede deberse a permisos insuficientes o rate limiting.

El proyecto clasifica estos errores y utiliza retry logic cuando corresponde a rate limiting.

### Error `404 Not Found`

Comprobar:

- `owner`;
- `repo`;
- recurso solicitado;
- permisos de acceso.

### El servidor no aparece en Antigravity

Verificar:

1. ejecutar `npm run build`;
2. comprobar que exista `dist/index.js`;
3. revisar la ruta configurada;
4. verificar `GITHUB_TOKEN`;
5. recargar Antigravity.

### Los tests fallan

Ejecutar:

```bash
npm run test
```

y revisar si el problema corresponde a schemas, mocks, errores o retry logic.

---

## 🧠 Decisiones técnicas y aprendizajes

### Separación entre tools y operaciones

Las tools definen qué puede hacer el agente, mientras que `operations.ts` contiene la lógica que interactúa con GitHub.

Esta separación mantiene desacoplada la capa MCP de la integración con la API externa.

### Uso de Zod

Los schemas permiten validar los parámetros antes de realizar una llamada a GitHub y describir claramente los inputs esperados por cada tool.

### Separación del cliente de GitHub

`github/client.ts` contiene la configuración de Octokit, mientras que `github/operations.ts` contiene las operaciones.

Esto facilita el mocking durante los tests.

### Manejo de errores personalizados

Los errores se clasifican en:

- `ValidationError`
- `GitHubAPIError`
- `AuthenticationError`
- `NetworkError`

Esto permite transformar errores técnicos en mensajes más comprensibles para el usuario.

### Retry y exponential backoff

El proyecto implementa retry logic para situaciones de rate limiting.

El tiempo de espera aumenta entre los intentos para evitar realizar solicitudes repetidas inmediatamente.

### Testing aislado de GitHub

Octokit se mockea durante los tests para evitar llamadas reales a GitHub y obtener pruebas rápidas, reproducibles y determinísticas.

### Comunicación mediante stdio

El MCP Server utiliza comunicación mediante `stdio`.

Debido a que stdout forma parte de la comunicación del protocolo, los mensajes de debugging se envían mediante `console.error` para evitar interferencias.

---

## 🤖 Uso de Inteligencia Artificial

Durante el desarrollo de GitHub AI Agent se utilizó inteligencia artificial como herramienta de apoyo para el análisis, planificación, implementación, debugging, testing y documentación.

La IA colaboró en:

- análisis de arquitectura;
- implementación de tools;
- integración con Octokit;
- definición de schemas de Zod;
- manejo de errores;
- retry logic;
- configuración de Vitest;
- diseño de mocks;
- análisis de errores;
- documentación técnica.

También se utilizó como apoyo para identificar casos edge y ampliar la cobertura de tests.

La implementación fue revisada, ejecutada y validada mediante compilación, ejecución y testing.

---

## 📄 Licencia

Este proyecto se encuentra actualmente bajo licencia ISC.

---

## 👩‍💻 Autor

Desarrollado por **Natalia Alvarez**.

Proyecto realizado como parte del **Proyecto Integrador de la Especialización Backend**.
