# Mi Estudio de Moda y Aventuras: plan de trabajo y distribución de agentes

Documento del orquestador. La arquitectura técnica detallada está en `docs/ARQUITECTURA.md`.

## 1. Capacidades reales verificadas

| Recurso | Estado |
|---|---|
| Carpeta del proyecto | `/home/user`, vacía, sin git |
| Node / npm | v22.23.5 / 10.9.9, con acceso al registro npm (zustand 5.1.0, vite 8.3.8) |
| Navegador para pruebas | Chromium y Playwright preinstalados; también hay un servidor MCP de Playwright |
| ffmpeg | Disponible (no hace falta por ahora) |
| Motor de voz local (TTS) | No hay. La voz usará la Web Speech API del dispositivo (en iPad: voces es-MX) |
| Agentes personalizados (`.claude/agents`) | Ninguno definido |
| Tipos de agente disponibles | `general-purpose` (lee y escribe), `Plan` (solo lectura, diseño), `Explore` (solo lectura, búsqueda) |
| Selección de modelo por agente | Sí: `opus` (alta capacidad), `sonnet` (intermedio), `haiku` (bajo coste) |
| Aislamiento | `isolation: "worktree"` disponible, pero requiere repositorio git (se inicializará en la etapa 0) |

Los "agentes especializados" se crearán como agentes `general-purpose`. Cada uno tendrá el modelo adecuado, un prompt acotado y una lista cerrada de archivos de su propiedad. No hace falta definir agentes personalizados en disco.

## 2. Distribución de agentes y modelos

| Paquete | Agente | Modelo | Por qué |
|---|---|---|---|
| Arquitectura | Arquitecto (`Plan`) | **opus** | Hecho. Diseño completo entregado |
| P0 Fundación | **Orquestador** (yo) | opus | Ya tengo toda la arquitectura en contexto; delegarlo obligaría a reenviarla entera |
| P1 Personajes (6 muñecas, anclajes, selector) | Agente de personajes | **opus** | El arte SVG de rostros es lo más exigente en calidad visual |
| P3 Peluquería (≥12 peinados delante/detrás, degradado y arcoíris) | Agente de peluquería | **opus** | Geometría compleja y encaje con 6 cabezas |
| P8 Scheduler (máquina de estados, locks, snapshot) | Agente de scheduler | **opus** | Lógica central del proyecto y con más casos límite |
| P5 núcleo (ActivityRunner, progresión, hub, retos del salón) | Agente educativo | **opus** | Define el patrón que copiarán las actividades |
| P2 Maquillaje y stickers | Agente de maquillaje | **sonnet** | Piezas pequeñas y repetitivas sobre anclajes fijos |
| P4a Ropa | Agente de moda | **sonnet** | Catálogo amplio con patrón definido |
| P4b Accesorios | Agente de moda (2.ª tarea) | **sonnet** | Igual, con metadatos de figura y cantidad |
| P6 Audio | Agente de audio | **sonnet** | Interfaz clara y acotada |
| P7 Interfaz (foto, galería, puerta parental, ajustes, escenas) | Agente de interfaz | **sonnet** | Componentes de UI con contratos ya fijados |
| P5 actividades (11, en 3 o 4 lotes) | Subagentes educativos | **haiku** | Una ronda por componente, con plantilla y ejemplo |
| P9 Pruebas e2e | Agente de pruebas | **sonnet**; tests de catálogo con **haiku** | e2e requiere depurar; los tests de contrato son mecánicos |

Si la calidad de una entrega con haiku o sonnet no es suficiente, se repite la tarea con el modelo superior, y solo esa tarea.

## 3. Plan por etapas (mapeado a las 8 etapas de la especificación)

| Etapa | Contenido | Agentes | Paralelo | Criterio de salida |
|---|---|---|---|---|
| 0 (≈ esp. 1) | Scaffold, tipos congelados, `art/kit`, capas, `DollRenderer`, stores, IndexedDB, shell y navegación, editor genérico, stubs de registros, una muñeca y una pieza de referencia por slot | Orquestador | No | build, tsc, lint y vitest en verde; la muñeca de referencia muestra todos los slots |
| 1 (≈ esp. 2) | Muñecas, maquillaje, cabello, ropa, accesorios | P1, P2, P3, P4a, P4b | Sí, 5 agentes | Test de contrato del catálogo y revisión por captura de pantalla |
| 2 (≈ esp. 3) | Foto, escenarios, galería, guardar/duplicar/editar/descargar | P7 | Sí, junto con la etapa 1 (solo depende de `DollRenderer`) | La foto reproduce todas las capas (comparación de píxeles) |
| 3 (≈ esp. 6 y 7) | Scheduler y audio | P8, P6 | Sí, junto con la etapa 1 | Tests de la máquina con reloj falso; voz con engine simulado |
| 4 (≈ esp. 4 y 5) | Kit educativo y luego 11 actividades | P5 núcleo, luego lotes en haiku | El núcleo primero; los lotes en paralelo entre sí | Cada actividad completa sus rondas y la progresión sube o baja |
| 5 (≈ esp. 7) | Zona de adultos, progresión, retos en el salón, frases | P7, P5 | Parcial | Ajustes aplicados en vivo al scheduler y al audio |
| 6 (≈ esp. 8) | Integración, e2e en viewport iPad (chromium y webkit), rendimiento | Orquestador y P9 | No | Los 12 criterios de aceptación verificados en e2e |

Ruta crítica: **Etapa 0, luego P5 núcleo y P8, luego actividades, luego integración y e2e.** El arte (P1 a P4) va en paralelo y no bloquea la lógica.

## 4. Dependencias

- Etapa 0 bloquea todo: tipos, `DollRenderer`, stores y stubs de registros.
- P7 depende solo de `DollRenderer` y de los tipos, no del catálogo real.
- P8 depende del contrato `ActivitySessionProps` y del registro de actividades, no de las actividades reales.
- P5 y P8 usan `VoiceApi` y `SfxApi` simulados hasta que P6 entregue.
- P2 y P3 necesitan los anclajes de cara definitivos de las muñecas. Mitigación: P0 fija los anclajes de la muñeca de referencia y P1 solo puede moverlos ±10 px.
- Los retos del salón (P5) necesitan los metadatos `colorTags`, `shapeTag` y `count` de P2 y P4. Por eso van en la etapa 5.

## 5. Riesgos técnicos principales

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Calidad del arte SVG generado por código (no hay ilustrador) | Alto: es lo que más percibe la niña | `art/kit` con degradados, brillos y contornos obligatorios; pieza de referencia en P0; revisión por capturas; modelos opus para muñecas y cabello |
| Voz Web Speech en iPad: requiere un toque para activarse, la voz es-MX puede faltar y la API tiene cortes | Medio | Botón ▶ inicial que la desbloquea, watchdog por frase, selector de voz en ajustes. La UI funciona solo con iconos. Interfaz `SpeechEngine` lista para audios pregrabados |
| Exportación PNG distinta en Safari, o canvas bloqueado por contenido externo | Medio | SVG único sin `foreignObject`, fuentes ni recursos externos; test e2e en webkit |
| Temporizador inexacto en segundo plano o con el iPad bloqueado | Medio | Timestamps con detección de huecos, `visibilitychange`, `pagehide` y pausa por inactividad |
| Desalineación de capas entre muñecas | Medio | Cuerpo compartido y anclajes solo en la cara; captura de las 6 muñecas con todos los slots |
| Conflictos entre agentes en paralelo | Medio | Propiedad exclusiva de archivos, tipos congelados tras P0, git con un commit por paquete |
| Rendimiento con muchos degradados en iPad | Bajo-medio | `React.memo` por capa, miniaturas cacheadas, sin filtros pesados |
| Safari puede borrar IndexedDB por inactividad | Bajo | `navigator.storage.persist()` y opción de descargar PNG desde la zona de adultos |

## 6. Cómo se minimizan tokens y trabajo duplicado

1. **El diseño se hizo una sola vez**, con un agente opus. Nadie más rediseña: los cambios a `types/` pasan solo por el orquestador.
2. **La etapa 0 la hace el orquestador**, que ya tiene la arquitectura en contexto, en vez de reenviársela completa a otro agente.
3. **Cada agente recibe un paquete mínimo:** su sección del documento, `types/`, `art/kit` y su pieza de referencia. Nunca la especificación completa.
4. **Plantillas de referencia ejecutables:** una pieza o actividad terminada sirve de ejemplo. Los modelos baratos copian el patrón en lugar de razonarlo.
5. **Las actividades implementan una sola ronda.** Duración, pistas, progresión y voz viven en el `ActivityRunner` común, así que no se repiten 11 veces.
6. **Archivos exclusivos y registros con stubs:** no hay ediciones simultáneas ni rondas de merge.
7. **Los entregables son verificables por máquina** (tsc, vitest, test de contrato). El orquestador revisa resultados y capturas, no código línea a línea.
8. **Escalado de modelo solo ante fallo:** se empieza por el modelo más barato razonable para cada tarea.
9. **Registro breve de decisiones** en `docs/DECISIONES.md`, para no volver a discutir lo ya decidido.

## 7. Registro de decisiones (inicial)

- D1. Arte como componentes React-SVG parametrizados por paleta; PNG solo como salida.
- D2. viewBox común `0 0 600 1000` y cuerpo compartido entre muñecas.
- D3. Sin react-router: la pantalla vive en `gameStore.screen`.
- D4. localStorage (`persist`) para ajustes y progreso; IndexedDB (`idb`) para creaciones e imágenes.
- D5. Voz con Web Speech API detrás de `SpeechEngine`; efectos de sonido sintetizados con WebAudio, sin archivos.
- D6. Scheduler como reducer puro con reloj inyectado; solo cuenta tiempo activo.
- D7. El salón sigue montado bajo el overlay de la actividad, y además se guarda un snapshot persistido.
- D8. La etapa 0 la implementa el orquestador.
