# Registro de decisiones técnicas

- D1. Arte como componentes React-SVG parametrizados por paleta; PNG solo como salida.
- D2. viewBox común `0 0 600 1000`; cuerpo compartido entre muñecas (`art/kit/body.tsx`), con ropa interior base.
- D3. Sin react-router: `gameStore.screen`.
- D4. localStorage (`persist`) para ajustes, looks y progreso; IndexedDB (`idb`) para creaciones e imágenes.
- D5. Voz: Web Speech API detrás de `SpeechEngine`; efectos sintetizados con WebAudio.
- D6. Scheduler como reducer puro con reloj inyectado; solo cuenta tiempo activo.
- D7. La pantalla sigue montada (`inert`) bajo overlays; además snapshot persistido.
- D8. Etapa 0 implementada por el orquestador.
- D9. `Placement` en ítems/maquillaje: 'abs' | {anchor} | {pair} (pair espeja el lado derecho).
- D10. Equipar un slot quita solo los ítems que lo ocultarían (p.ej. blusa quita vestido; moño quita sombrero
  'compress'). Todo lo demás se conserva.
- D11. Miniaturas: ítems 'abs' recortan la muñeca (`SLOT_THUMB`); ítems anclados se dibujan solos en coordenadas locales.
- D12. Pantalla ▶ inicial en cada carga: desbloquea audio en iPad.
- D13. Versiones: React 19, Vite 8, TypeScript 5.9, Zustand 5, Vitest 5, Playwright 1.63 (preinstalado).
