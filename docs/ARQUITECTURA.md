# Arquitectura: Mi Estudio de Moda y Aventuras

Elaborada por el agente arquitecto (modelo de alta capacidad). Es la fuente de verdad para todos los agentes. La planificación y la asignación de agentes están en `docs/PLAN_Y_AGENTES.md`.

## A. Decisiones clave

1. **El arte son componentes React-SVG parametrizados.** Cada pieza (muñeca, peinado, prenda, maquillaje) es un `FC<PartProps>` que recibe una paleta, así que una forma sirve para N colores. Las variantes de color aportan los metadatos educativos sin coste extra. Los PNG con transparencia solo se usan como salida: exportación, miniaturas y galería.
2. **Calidad visual: reglas de estilo obligatorias en `src/art/kit`:**
   - Degradado de 3 paradas (light, main, shade) en cada forma.
   - Contorno en tono shade, 35 % más oscuro, de 2.5 a 4 px, con uniones redondeadas.
   - Brillo especular: una elipse blanca con opacidad de 0.35 a 0.6.
   - Sombra interna: un path shade con opacidad 0.4.
   - Ojos de 4 capas: esclera, iris con degradado radial, pupila y 2 reflejos.
   - Filtros: solo `feGaussianBlur`, y únicamente en rubor y brillos.
3. **viewBox único `0 0 600 1000` y cuerpo compartido** por todas las muñecas. Cada muñeca cambia rostro, tono de piel, ojos y forma de cara, y toda la ropa encaja en todas.
4. **Un solo árbol `<svg>` (`DollRenderer`)** para el editor, la foto y la exportación. La exportación usa `renderToStaticMarkup` de ese mismo árbol.
5. **Sin react-router.** La pantalla actual es `gameStore.screen`, una unión discriminada.
6. **Persistencia:** lo pequeño va a localStorage con Zustand `persist`; las creaciones y las imágenes, a IndexedDB con `idb`.
7. **La voz va detrás de la interfaz `SpeechEngine`:** hoy `WebSpeechEngine`, más adelante `ClipEngine` con audios pregrabados.
8. **Scheduler:** una máquina de estados pura (reducer con reloj inyectado) envuelta en un controlador de efectos.
9. **Cada actividad educativa implementa UNA ronda.** Un `ActivityRunner` común gestiona la duración, la progresión, las pistas y la celebración.

## B. Estructura de carpetas y propietarios

Propietarios: P0 Fundación, P1 Personajes, P2 Maquillaje, P3 Peluquería, P4 Moda/Accesorios, P5 Educativo, P6 Audio, P7 Interfaz, P8 Scheduler, P9 Pruebas.

```
src/
  main.tsx, App.tsx, styles/{tokens.css,global.css}               P0
  types/{core,catalog,look,settings,learning,scheduler,audio}.ts  P0 (CONGELADO tras P0)
  art/kit/{gradients.tsx,ids.ts,palette.ts,shapes.tsx}            P0
  art/layers.ts, art/DollRenderer.tsx                             P0
  catalog/registry.ts                                             P0 (importa los index.ts de cada paquete; stubs vacíos)
  assets/dolls/                                                   P1
  assets/makeup/, assets/stickers/                                P2
  assets/hair/                                                    P3
  assets/clothes/, assets/accessories/                            P4
  assets/scenes/{backgrounds/,frames/}                            P7
  components/
    Shell/{AppShell,TopBar,BigButton,TabBar}.tsx                  P0
    DollEditor/{DollEditor,ItemGrid,ColorSwatches}.tsx            P0
    DollSelector/ P1 · MakeupStudio/ StickerLayer/ P2 · HairStudio/ P3 · Wardrobe/ Accessories/ P4
    PhotoStudio/, Gallery/, ParentGate/                           P7
    Challenges/{ChallengeEngine.ts,ChallengeBubble.tsx,challenges.ts}  P5
  learning/
    kit/{ActivityRunner,ChoiceButton,DropTarget,Celebration,useHint}.tsx  P5
    registry.ts (stub de P0), LearningHub.tsx                     P5
    ColorGames/ ShapeGames/ CountingGames/ MemoryGames/ PatternGames/ MatchingGames/  P5
  scheduler/{machine,controller,ActivitySelector,locks,snapshot}.ts, InviteOverlay.tsx, ActivityOverlay.tsx  P8
  settings/{ParentSettings,SchedulerSettings}.tsx                 P7
  audio/{VoiceManager.ts,engines/WebSpeechEngine.ts,engines/ClipEngine.ts,phrases.ts,SoundEffects.ts,unlock.ts}  P6
  store/{settingsStore,dollStore,gameStore,learningStore,galleryStore}.ts  P0 · store/schedulerStore.ts P8
  db/{db.ts,migrations.ts}                                        P0
  utils/{ImageComposer,SaveCreation,LoadCreation,download}.ts     P7
tests/unit/** (cada paquete escribe los suyos) · e2e/** P9
```

**Regla de propiedad:** ningún agente edita archivos fuera de lo suyo. P0 crea los registros como stubs (`export default []`), y cada paquete rellena únicamente su propio `index.ts`. Cada módulo registra sus frases con `definePhrases({...})` en su propia carpeta.

## C. Modelo de datos

```ts
// types/core.ts
export type ColorName='rojo'|'azul'|'amarillo'|'verde'|'naranja'|'morado'|'rosa'|'cafe'|'negro'|'blanco';
export type ShapeName='circulo'|'cuadrado'|'triangulo'|'rectangulo'|'estrella'|'corazon'|'ovalo';
export interface Pt { x:number; y:number }
export interface Palette { main:string; light:string; shade:string; accent?:string }
export type AnchorName='headTop'|'headCenter'|'eyeL'|'eyeR'|'browL'|'browR'|'cheekL'|'cheekR'|'nose'|'mouth'
 |'earL'|'earR'|'neck'|'waist'|'wristL'|'wristR'|'handL'|'handR'|'ankleL'|'ankleR';
export interface PartProps { doll: DollBase; palette: Palette; intensity?: number; idp:(n:string)=>string }
export type SvgPart = React.FC<PartProps>;

// types/catalog.ts
export interface DollBase {
  id:string; spokenName:string;
  skin: Palette & { blush:string; lip:string };
  eyes:{ iris:Palette; shape:'almond'|'round'|'upturned' };
  faceShape:'oval'|'round'|'heart';
  anchors: Record<AnchorName,Pt>;               // ±10px entre muñecas
  Body: SvgPart; Head: SvgPart; Face: SvgPart; Hands: SvgPart;
  defaultLook: Omit<DollLook,'dollId'>;
}
export type WearSlot='shoes'|'bottom'|'top'|'dress'|'outer'|'necklace'|'earrings'|'bracelet'|'ring'
 |'glasses'|'hairAcc'|'hat'|'bag';
export interface ColorVariant { id:string; colorTags:[ColorName,...ColorName[]]; palette:Palette }
export interface CatalogItem {
  id:string; slot:WearSlot; kind:string; spokenName:string;
  theme:'casual'|'fiesta'|'deporte'|'playa'|'disfraz'|'fantasia';
  variants:ColorVariant[];                       // mínimo 3
  shapeTag?:ShapeName; count?:number;            // metadatos educativos
  parts: Partial<Record<LayerId,SvgPart>>;
  suppresses?:WearSlot[];                        // oculta sin borrar
  hairFit?:'over'|'compress';
  compat?:{ dolls?:string[] };
}
export interface HairStyle { id:string; kinds:('corto'|'largo'|'lacio'|'ondulado'|'rizado'|'trenzas'|'coletas'|'chongo'|'recogido'|'fiesta')[];
  spokenName:string; volume:1|2|3; Back:React.FC<HairPartProps>; Front:React.FC<HairPartProps>; hatOffsetY:number }
export type HairColor = {mode:'solid';a:ColorName|string} | {mode:'gradient'|'two';a:string;b:string} | {mode:'rainbow'};
export type MakeupKind='brows'|'eyeshadow'|'liner'|'lashes'|'blush'|'lips'|'gloss'|'freckles'|'sparkle';
export interface MakeupStyle { id:string; kind:MakeupKind; shapeTag?:ShapeName; Part:SvgPart }
export interface StickerDef { id:string; shapeTag:ShapeName; colorTag:ColorName; Part:SvgPart }

// types/look.ts
export interface MakeupLayer { styleId:string; color:string; colorTag:ColorName; intensity:0.35|0.65|1 }
export interface StickerPlacement { uid:string; stickerId:string; x:number; y:number; scale:number; rot:number;
  zone:'hair'|'face'|'body'|'free' }
export interface DollLook { dollId:string; hair:{styleId:string; color:HairColor};
  makeup: Partial<Record<MakeupKind,MakeupLayer>>;
  outfit: Partial<Record<WearSlot,{itemId:string; variantId:string}>>;
  stickers: StickerPlacement[] }
export interface Scene { backgroundId:string; frameId:string|null }
export interface Creation { id:string; schemaVersion:1; createdAt:number; updatedAt:number;
  title?:string; look:DollLook; scene:Scene; imageKey:string; thumbKey:string; parentId?:string }

// types/settings.ts
export type LearningCategory='colores'|'figuras'|'numeros'|'memoria'|'patrones'|'clasificacion';
export interface Settings { v:1;
  scheduler:{ intervalMin:0|10|15|20|30; durationMin:2|3|5; mode:'optional'|'mandatory';
              categories:Record<LearningCategory,boolean>; reinviteMin:number };
  audio:{ voiceOn:boolean; sfxOn:boolean; volume:number; voiceURI?:string; rate:number };
  game:{ childName:string; salonChallenges:boolean; idlePauseSec:number } }

// types/learning.ts
export interface LearningProgress { v:1; perActivity:Record<string,{ level:number; streak:number; struggle:number;
  plays:number; lastPlayed:number }>; history:{ activityId:string; category:LearningCategory; at:number }[] }
```

Valores por defecto:

| Campo | Valor |
|---|---|
| Intervalo | 15 min |
| Duración | 3 min |
| Modo | `optional` |
| Categorías | todas en `true` |
| `reinviteMin` | 5 |
| `rate` | 0.95 |
| `childName` | `'Emma'` |
| `idlePauseSec` | 90 |

## D. Sistema de capas

viewBox `0 0 600 1000`, con la cabeza centrada en (300,230). Orden de atrás hacia delante:

| z | capa | contenido |
|---|---|---|
|10|hairBack|melena trasera|
|15|itemBack|partes traseras: capa, alas, ala del sombrero, asa de la bolsa|
|20|body|piernas, torso, brazos, cuello|
|30|shoes| |
|40|bottom|falda, pantalón, short|
|45|top|blusa|
|50|dress|vestido, conjunto, disfraz (suprime top y bottom)|
|55|outer|chamarra|
|60|necklace| |
|65|hands|las manos quedan sobre las mangas|
|68|bracelet, ring| |
|70|head|piel de la cara y orejas|
|72|earrings| |
|74|face|ojos, nariz y boca base|
|76.1–76.9|makeup|freckles, blush, eyeshadow, liner, lashes, brows, lips, gloss, sparkle|
|80|hairFront|fleco y mechones|
|84|hairAcc|diadema, moño, corona|
|86|glasses| |
|88|hat|con `hairFit:'compress'` aplica `scaleY(0.92)` al peinado frontal más `hatOffsetY`|
|90|bag| |
|95|stickers| |

**Coordenadas de las piezas.** Las prendas del cuerpo usan coordenadas absolutas, porque el cuerpo es compartido. Las piezas de la cara (maquillaje, aretes, lentes) se dibujan en un sistema local que `DollRenderer` desplaza con `<g transform="translate(anchor)">`. Las piezas del lado derecho se espejan con `scale(-1,1)`.

**Algoritmo de `DollRenderer`:**
1. Resolver el outfit.
2. Unir los `suppresses` de los ítems resueltos.
3. Si el sombrero tiene `hairFit 'compress'`, suprimir `hairAcc`.
4. Recolectar los pares `{z, node}`.
5. Ordenar de forma estable por z.
6. Renderizar.

**Reglas de conservación y compatibilidad:**
- Los ítems suprimidos siguen guardados en el look.
- Equipar un ítem solo reemplaza su propio slot; el resto de la personalización no se toca.
- `compat.dolls` filtra lo que aparece en el grid.
- `idp` añade un prefijo `useId` a los ids de gradientes, para que no choquen dos SVG en la misma pantalla.

## E. Stores Zustand

| store | contenido | persistencia |
|---|---|---|
|settingsStore|`Settings` y `update(patch)`|localStorage `emma.settings`, con `version` y `migrate`|
|dollStore|`selectedDollId`, `looks` por muñeca, `editorTab`, `subTab`, acciones `equip`, `unequip`, `setHair`, `setMakeup`, stickers y `resetDoll`|localStorage `emma.dolls` (borrador autoguardado)|
|gameStore|`screen`, `photo{scene, editingCreationId?}`, `overlay`|localStorage, solo `screen` y `photo`|
|learningStore|`LearningProgress` y `recordRound`|localStorage `emma.learning`|
|schedulerStore|`SchedulerState`|localStorage: `activeMs`, `history` y `snapshot`|
|galleryStore|metadatos de creaciones; `load`, `save`, `duplicate`, `remove`|IndexedDB|

IndexedDB `emma-db` v1:
- Store `creations`, con keyPath `id` e índice `updatedAt`.
- Store `images`, que asocia cada clave a un PNG Blob.
- Cada registro lleva `schemaVersion` y se migra al leerlo con `migrateCreation`.

## F. Contrato de actividad educativa

```ts
export interface VoiceApi { say(key:string, params?:Record<string,string|number>, opts?:{priority?:Priority}):Promise<void>;
  repeatLast():void; stop():void }
export interface SfxApi { play(name:'tap'|'pop'|'sparkle'|'soft'|'chime'|'whoosh'):void }
export interface RoundResult { mistakes:number; ms:number }
export interface ActivityRoundProps { level:number; seed:number; voice:VoiceApi; sfx:SfxApi;
  onRoundDone(r:RoundResult):void; reportMistake():void }
export interface ActivityDef { id:string; category:LearningCategory; spokenTitleKey:string; inviteKey:string;
  Icon:React.FC; estRoundSec:number; maxLevel:number; Round:React.FC<ActivityRoundProps> }
export interface ActivitySessionProps { activityId:string; durationMin:2|3|5; mode:'scheduler'|'free';
  onComplete():void; onExit?():void }
```

Actividades:

| Categoría | Actividades y progresión |
|---|---|
| Colores | `color-find` (2 → 3 → 5 opciones), `color-bucket` |
| Figuras | `shape-find`, `shape-shadow` |
| Números | `count-objects` (1-3 → 1-5 → 1-10), `number-tap` |
| Memoria | `memory-pairs` (2 → 3 → 4 → 6 parejas) |
| Patrones | `pattern-next` (AB → AAB → ABC) |
| Clasificación | `sort-color`, `sort-shape` |

**ActivityRunner:**
- Número de rondas: `clamp(round(durationMin*60/estRoundSec), 2, 12)`. Además se detiene al cumplirse el tiempo, siempre al terminar una ronda.
- Dice la instrucción antes de cada ronda; un botón de altavoz la repite.
- Ante un error, `useHint` marca visualmente la opción correcta y repite la instrucción, con un sonido `soft`. Nunca hay mensaje negativo.
- El elogio por voz llega solo en 1 de cada 3 rondas, tomado de un pool variado.

**Progresión silenciosa:** 3 rondas seguidas sin errores suben un nivel; 2 rondas con 2 o más errores lo bajan.

**ActivitySelector:**
1. Toma las actividades de las categorías habilitadas.
2. Excluye las categorías de las 2 últimas sesiones y las actividades de las 3 últimas. Si no queda ninguna, relaja la regla.
3. Asigna a cada una un peso de `1 + horasDesdeÚltimoJuego` (máximo 48).
4. Hace un sorteo ponderado con semilla.

## G. Scheduler

Estados: `disabled | counting | paused | invitePending | inActivity | cooldown`.

**Temporizador por timestamps** (reloj inyectado):
- `elapsed = activeMs + (segmentStart ? now - segmentStart : 0)`.
- Las causas de pausa son `hidden`, `idle`, `parent`, `learningFree` y `lock`. Al llegar la primera, se cierra el segmento; al irse la última, se abre uno nuevo.
- Un `setInterval(1000)` solo comprueba si se cumplió el tiempo; nunca acumula.
- Si `now - lastTick > 5 s`, el dispositivo estuvo suspendido y ese hueco se descarta.

**Fuentes de pausa:**
- `visibilitychange`, `pagehide` y `freeze`.
- Inactividad: ningún toque durante `idlePauseSec`.
- La zona de adultos.
- El juego educativo libre.

```
evaluate():
  if locks.length>0 or overlay!=='none': due=true; return
  takeSnapshot(); status='invitePending'; activity=Selector.pick(); voice.say(inviteKey,{name})
releaseLock(id): locks.remove(id); if due && locks.empty: setTimeout(evaluate, 1500)
acceptInvite():  status='inActivity'; pause('activity'); overlay='activity'
declineInvite(): status='cooldown'; activeMs=0; targetMs=reinviteMin*60000; resume()     // solo opcional
completeActivity(): history.push; learningStore.record; restoreSnapshot(); activeMs=0;
                    targetMs=intervalMin*60000; status='counting'; due=false
intervalMin=0 → status='disabled'
```

**Modos de participación:**
- **Obligatorio:** la invitación solo muestra JUGAR, y la actividad no tiene botón de salida. Solo la puerta parental puede cancelarla.
- **Opcional:** dos botones grandes, JUGAR ACTIVIDAD y SEGUIR JUGANDO, y la voz anuncia cada uno.
- Completar una actividad en el hub educativo también reinicia el contador.

**Snapshot:**
- El salón sigue montado bajo el overlay (`inert`), así que su estado no se pierde.
- Además, el snapshot se persiste en localStorage para sobrevivir a una recarga.
- `restoreSnapshot` reescribe `gameStore` y `dollStore` de forma atómica.

**Locks:** `const release = scheduler.lock('photo-capture')`. Los usan la foto, el guardado y el arrastre de stickers.

## H. Audio

```ts
type Priority='instruction'|'feedback'|'ambient';
interface SpeechEngine { ready():Promise<void>; speak(text:string,o:{volume:number;rate:number}):Promise<void>; cancel():void }
interface VoiceManager extends VoiceApi { unlock():void; setMuted(b:boolean); setVolume(v:number); readonly speaking:boolean }
function definePhrases(p:Record<string,string[]>):void   // variantes con {name},{color},{n}
```

**Prioridades:**
- `instruction` cancela lo que esté sonando y se guarda para `repeatLast`.
- `feedback` se encola, con un máximo de 1 en espera.
- `ambient` se descarta si ya hay algo sonando.

**Variación:** se elige una variante al azar, evitando las 2 últimas de esa misma clave.

**Selección de voz:** se respeta primero el `voiceURI` elegido en ajustes. Si no hay, se busca por idioma en este orden, prefiriendo las voces locales:
1. es-MX
2. es-US
3. es-419
4. cualquier es-*

Si no se encuentra ninguna voz en español, el juego sigue en silencio.

**Desbloqueo en iOS:** en el primer `pointerdown` se reproduce una utterance vacía con volumen 0 y se llama a `audioCtx.resume()`. El botón ▶ de la pantalla inicial provoca ese gesto.

**Watchdog:** cada frase tiene un tiempo máximo de `max(3s, chars*120ms)`; si lo supera, se cancela.

**Efectos de sonido:** síntesis con WebAudio (seno o triángulo con envolvente ADSR), con ganancia máxima de 0.4 multiplicada por el volumen.

## I. ImageComposer

`composeScene(look, scene, {width,height}) → Promise<Blob>`:

1. Genera el markup con `renderToStaticMarkup(<PhotoScene/>)`: un SVG de 1600×1200 que contiene el fondo, la muñeca como `<svg>` anidado (x=500, y=100, 600×1000) y el marco.
2. El markup no puede llevar `foreignObject`, recursos externos, fuentes web, `<text>` ni CSS externo.
3. Convierte el markup en Blob SVG, crea un objectURL, carga la imagen con `img.decode()`, la dibuja con `drawImage` y obtiene el PNG con `canvas.toBlob('image/png')`. Al final revoca el objectURL.
4. Todo el proceso corre dentro de `scheduler.lock('photo')`.

Funciones de la galería:
- **Guardar:** la imagen completa (1600×1200) y la miniatura (320×240) van a la store `images`.
- **Duplicar:** crea un `id` nuevo y guarda el original como `parentId`.
- **Volver a editar:** carga el `look` en `dollStore` y la escena en `gameStore.photo`.
- **Descargar:** `<a download>`; si iOS no lo soporta, usa `navigator.share` detrás de la puerta parental.

## J. Navegación y UI

Pantallas:
- **home:** carrusel con las 6 muñecas y botones de salón, galería y aprendizaje.
- **salon:** la muñeca ocupa el 55 % izquierdo; a la derecha, pestañas con iconos y un grid.
- **photo**, **gallery** y **learning**.
- **Overlays:** invitación, actividad y puerta parental.

Diseño táctil:
- Objetivos táctiles de al menos 72 px (120 px los principales), con 16 px de separación.
- `touch-action: manipulation`, sin pinch-zoom y con `overscroll-behavior: none`.
- PWA standalone, con aviso de girar el iPad en vertical.
- Sin texto funcional dirigido a la niña.
- Se respeta `prefers-reduced-motion`.

**Puerta parental:**
1. Mantener pulsado 3 s el candado (48 px), con un anillo de progreso.
2. Resolver una suma de 2 dígitos con teclado numérico.
3. Tras 2 fallos, la puerta se cierra.

**ParentSettings** configura el scheduler, el audio (con selector y prueba de voz), el juego, el borrado de la galería y el reinicio del progreso. El progreso aparece como "actividades jugadas por categoría", sin notas.

**Retos del salón (`ChallengeEngine`):**
- Aparece uno cada 4 minutos de salón activo y caduca a los 2 minutos.
- Es una burbuja con icono y voz que no bloquea el juego.
- Se verifica contra `dollStore`.
- Solo se lanza cuando el scheduler está en `counting`.

## K. Pruebas

**Vitest:**
- **Máquina del scheduler** (con reloj falso): acumulación solo con la app visible, pausa, hueco de suspensión, retraso por lock, rechazo y cooldown, modo obligatorio, reinicio tras completar y modo desactivado.
- **Lógica educativa:** el `ActivitySelector` y la progresión.
- **Composición:** el orden z de `DollRenderer`, que `suppresses` no borre nada, la compatibilidad, que `equip` no toque otros slots y las migraciones.
- **Audio:** `VoiceManager` con un engine simulado.
- **Foto:** el markup de `composeScene` no contiene `foreignObject`.
- **Contrato de cada paquete:** variantes, tags, `LayerId` válidos, ids únicos y esquema de `ActivityDef`.

**Playwright:**
- Configuración: chromium y webkit, viewport 1180×820, `hasTouch` e `isMobile`.
- `speechSynthesis` simulado.
- Con `VITE_E2E=1` se expone `window.__emma` (`advanceScheduler`, `getState`).
- Flujos:
  - vestir → foto → galería → editar → duplicar
  - invitación → actividad → restauración exacta
  - modo obligatorio
  - pestaña oculta
  - puerta parental
  - descarga

## L. Riesgos

Ver `docs/PLAN_Y_AGENTES.md`, sección 5.

## M. Orden de construcción

Ver `docs/PLAN_Y_AGENTES.md`, secciones 2 a 4.
