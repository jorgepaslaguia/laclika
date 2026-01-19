# Jefe de cocina digital 

Planificador operativo de cocina que transforma un menú en un plan de trabajo estructurado:
platos → procesos → tareas → recursos y equipo.

Proyecto personal **en desarrollo**, orientado a resolver la planificación real de un servicio de cocina
a partir de menús en PDF o texto libre.

---

## Qué hace el proyecto

- Importa menús desde **PDF o texto**
- Analiza y normaliza la información del menú
- Infere automáticamente:
  - tareas culinarias
  - fases de trabajo
  - recursos necesarios (horno, fogones, estación, fregadero)
- Detecta bloqueos operativos (tareas sin recurso, sin asignar, etc.)
- Permite **asignaciones automáticas** y validación previa al servicio

---

## Tecnologías y conceptos utilizados

- **JavaScript (Vanilla)**
- **HTML / CSS**
- Parsing y normalización de texto
- Heurísticas y reglas de inferencia
- Modelado de flujo operativo
- Gestión de estado y validaciones en frontend

---

## Estado del proyecto

 **En desarrollo**

El proyecto se encuentra en evolución activa:
- ampliación de reglas de inferencia
- mejoras en asignación automática
- refinado de la experiencia de uso

---

## Cómo ejecutar el proyecto

1. Clona el repositorio
2. Abre `index.html` en tu navegador
3. Carga un menú en PDF o pega el texto manualmente

_No requiere backend ni instalación adicional._

---

## Motivación

Proyecto creado para explorar la automatización de procesos operativos reales,
combinando análisis de texto, lógica de negocio y una interfaz interactiva.

---

## Parser hardening

- Segmentacion segura con deteccion de PDF plano, limites de transforms y trazabilidad en parseDiagnostics.
- Deteccion de platos con scoring, limite dinamico de platos y deduplicacion por similitud.
- Procesos con lista blanca de verbos, normalizacion unicode y ASAR -> HORNEAR.
- Recursos inferidos por proceso con origen/confianza y avisos explicitos de inferido.
- Bloqueo si no hay tareas (PARSE_FAILED_NO_TASKS), sin fallback silencioso a DEFAULT_PLAN.tareas.

---

## Menús de prueba

- Fixtures: `parser_fixtures.js` (12 menus nivel 0..5).
- Harness: `parser_smoke.js` (expone `runParserSmoke()`).
- Ejecutar: abrir `index.html`, activar "Debug texto" y revisar la seccion "PARSER FIXTURES", o lanzar `runParserSmoke()` en consola.

---

## Licencia

Proyecto personal. Uso académico o demostrativo.
