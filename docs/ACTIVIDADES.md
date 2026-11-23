# Cómo crear una actividad educativa

Plantillas de referencia: `src/learning/activities/color-find/` (tocar la opción correcta) y
`src/learning/activities/memory-pairs/` (cartas). Cópialas; no inventes otro patrón.

## 1. Archivos (todo dentro de `src/learning/activities/<id>/`)
| Archivo | Contenido |
|---|---|
| `phrases.ts` | `definePhrases({...})` con `<pfx>.title`, `<pfx>.invite` (con `{name}`) y las instrucciones. ≥2 variantes cada una. |
| `<Nombre>Round.tsx` | `plan<Nombre>(level, seed)` (función pura) + `export function <Nombre>Round(props: ActivityRoundProps)`. |
| `index.tsx` | Un `Icon` (SVG del kit, sin texto) y `export const <nombre>: ActivityDef = {...}`. Importa `./phrases` y `../activities.css`. |

Ids pendientes: `color-bucket`, `shape-find`, `shape-shadow`, `count-objects`, `number-tap`, `pattern-next`,
`sort-color`, `sort-shape`, `sort-category` (animales/frutas/prendas/flores; categoría `clasificacion`).

## 2. La ronda (`ActivityRoundProps`)
- Una ronda = UN reto corto. Siempre termina con éxito: no hay "perder".
- Al montar: `useEffect(() => { void voice.say('<pfx>.<instr>', params) }, [plan, voice])`. Esa es la instrucción;
  el runner la repite con el altavoz y ante errores. No digas nada más en la ronda (el runner elogia).
- Respuesta correcta: `sfx.play('pop')` (o `'chime'`), marca como hecha y, tras ~650 ms en un `useEffect` con
  `setTimeout` (limpiado), `onRoundDone({ mistakes, ms })`. Llama `onRoundDone` UNA sola vez.
- Respuesta incorrecta: `mistakes.current++; reportMistake()`. Nada más: nunca sonido/imagen "de error".
- Toda la aleatoriedad sale de `makeRng(seed)` dentro de `plan...()` (prueba determinista). Nada de `Math.random`.
- `level` va de 1 a `maxLevel`; define la dificultad SOLO en `plan...()`. Ej.: count-objects 1-3 → 1-5 → 1-10;
  pattern-next AB → AAB → ABC.

## 3. Kit (`src/learning/kit/*`, importa por archivo, no desde `ActivitySession`)
- `ChoiceButton` (`./kit/ChoiceButton`): opción táctil ≥120 px. Pasa `isAnswer` a la correcta: el runner le
  pone la pista (latido) tras un error. `done` = resuelta, `disabled` = inactiva, `testId` para pruebas.
- `useHint()` / `useHintProps(isAnswer)` (`./kit/hint`): para elementos que no son ChoiceButton (p. ej. una
  `DropZone hint={useHint() && esCorrecta}`).
- Arrastrar (`./kit/drag`): `<Draggable onDrop={(dropId) => ...} label testId>` y `<DropZone id="...">`.
  `onDrop(null)` = soltó fuera: no es error, el objeto regresa solo. Soltar en zona equivocada = `reportMistake()`.
- Dibujos (`./kit/art`): `ShapeToken{shape,color}`, `ColorBlob{color}`, `Fruit{kind}` (`FRUITS`),
  `Animal{kind}` (`ANIMALS`), `Flower{color}`, `Garment{slot,color}`, `CardBack`. `color` = `ColorName` o `Palette`.
  Nuevos dibujos: en tu carpeta, SVG `viewBox 0 0 100 100`, `useIdp()` para ids, degradados del art kit.
- Palabras con concordancia (`./kit/words`): `colorName`, `colorAdj`, `nounWithColor`, `SHAPE_NOUN`,
  `shapePlural`, `numberWord`. Pásalas como params: `voice.say('sf.find', { thing: 'la estrella roja' })`.
- Aleatorio (`./kit/rng`): `makeRng(seed)` → `next/int/pick/shuffle/sample/chance`.

## 4. `ActivityDef`
```ts
export const shapeFind: ActivityDef = {
  id: 'shape-find', category: 'figuras', spokenTitleKey: 'sf.title', inviteKey: 'sf.invite',
  Icon: ShapeFindIcon, estRoundSec: 15, maxLevel: 3, Round: ShapeFindRound,
};
```
`estRoundSec` realista (rondas = clamp(round(min*60/estRoundSec), 2, 12)). Prefijos de frases únicos (`sf.`, `co.`...).

## 5. Registro
En `src/learning/registry.ts`: importa la def y añádela al arreglo `activities` bajo su categoría (hay
comentarios "→ aquí"). La categoría del hub se activa sola al tener ≥1 actividad.

## 6. Estilo
Sin texto visible, sin números escritos (usa puntos/objetos), objetivos ≥120 px con ≥16 px de separación.
CSS en `src/learning/activities/activities.css` con prefijo de la actividad (`.sf-...`). Respeta reduced-motion.

## 7. Prueba (`tests/unit/learning/<id>.test.tsx`)
```ts
vi.mock('@/audio', async () => (await import('./audioMock')).audioMock());
```
1. `plan...(level, seed)` para cada nivel y varias semillas: nº de opciones correcto y exactamente 1 respuesta.
2. Render de la ronda con props falsas (ver `activities.test.tsx`): dice la instrucción; tocar una incorrecta
   llama `reportMistake`; tocar la correcta + `vi.advanceTimersByTime(700)` llama `onRoundDone` con `mistakes`.
3. `getActivity('<id>')` existe. Corre `npx tsc --noEmit -p .` y `npx vitest run`.
