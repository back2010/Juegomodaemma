# Reglas comunes para agentes

Lee SOLO lo que tu tarea indica. Fuente de verdad: `docs/ARQUITECTURA.md` (solo tus secciones) y `src/types/*`.

## Reglas
1. **Propiedad exclusiva de archivos.** Edita únicamente los archivos/carpetas de tu paquete. Si necesitas un
   cambio en otro archivo (tipos, registry, store, kit), NO lo hagas: descríbelo en tu informe final.
2. `src/types/*` está **congelado**.
3. **No hagas commits** ni cambies de rama. El orquestador revisa e integra.
4. No instales dependencias nuevas sin justificarlo en tu informe (preferible: no instalar).
5. Sin texto visible para la niña (solo iconos, color, voz). Sin enlaces externos, analítica ni red.
6. Voz: usa `voice.say(clave)` y registra las frases con `definePhrases({...})` en un archivo de TU carpeta.
   Español latinoamericano, frases cortas, varias variantes, sin elogios repetitivos ni mensajes negativos.
7. Botones táctiles ≥ 72 px (principales 120 px). Usa `BigButton`, `ItemGrid`, `ColorSwatches`, `SubTabs` e iconos
   de `src/components/Shell/icons.tsx` cuando apliquen.

## Reglas de arte (obligatorias)
- viewBox de muñeca `0 0 600 1000`, cuerpo compartido (`src/art/kit/body.tsx`). Anclajes en `BASE_ANCHORS`.
- Cada forma: degradado de 3 paradas (`LinGrad`/`RadGrad` con `makePalette`), contorno `outline(p)` 2.5–4 px con
  `strokeLinejoin="round"`, brillo `Gloss`. Filtros: solo `feGaussianBlur` en rubor/brillos.
- Ids de `<defs>` SIEMPRE con `idp('nombre')`. Nada de `<text>`, `<image>`, `foreignObject`, fuentes ni CSS en el SVG.
- Usa `palette.main/light/shade` recibidos: las variantes de color las aplica el renderer.
- Referencias de calidad: `src/assets/*/reference.tsx`, `src/assets/hair/ondas-largas.tsx`, `src/assets/dolls/doll-sofi.tsx`.

## Verificación
- `npx tsc --noEmit -p .` (ignora errores en archivos que no son tuyos; repórtalos).
- `npx vitest run` (incluye el contrato de catálogo `tests/unit/catalogContract.test.ts`).
- Revisión visual de muñecas: `node scripts/preview.mjs looks.json salida.png` (arreglo de DollLook o
  `{"allDolls":true}`) y mira la imagen. Guarda tus imágenes en tu scratchpad, no en el repo.
- Pruebas de tu paquete en `tests/unit/<paquete>/*.test.ts(x)`.

## Informe final (breve)
Archivos creados/modificados, qué quedó funcionando, pruebas ejecutadas y resultado, cambios que necesitas en
archivos ajenos, y riesgos pendientes. Sin pegar código completo.
