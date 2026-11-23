# Mi Estudio de Moda y Aventuras

Juego infantil 2D de moda, belleza y aprendizaje temprano para iPad (horizontal), pensado para una niña de
4 años que aún no lee. Sin backend, sin anuncios, sin compras, sin enlaces externos ni analítica: todo se guarda
en el dispositivo (localStorage + IndexedDB).

## Uso
```bash
npm install
npm run dev        # servidor de desarrollo, visible en la red local (abre la IP que muestra desde el iPad)
npm run build      # versión de producción en dist/ (sitio estático)
npm test           # 418 pruebas unitarias (Vitest)
npm run e2e        # 25 pruebas de aceptación en viewport de iPad (Playwright, Chromium)
```
En el iPad: abrir la dirección en Safari → Compartir → "Agregar a pantalla de inicio" para usarlo a pantalla
completa. La primera pantalla tiene un botón ▶ grande: ese toque activa la voz.

## Contenido
- 6 muñecas originales (tonos de piel de muy claro a muy oscuro), 14 peinados × 33 colores (sólidos,
  combinados, degradados, arcoíris), 35 estilos de maquillaje en 9 categorías, 40 stickers con arrastre,
  30 prendas y calzado, 36 accesorios. Sistema de capas: cambiar una categoría no borra las demás.
- Foto con 9 fondos y 6 marcos, galería (guardar, duplicar, volver a editar, descargar PNG).
- 11 actividades educativas (colores, figuras, números, memoria, patrones, clasificación) con progresión
  silenciosa, pistas visuales y sin mensajes negativos; retos de moda dentro del salón.
- Actividades programadas: tras 10/15/20/30 min de juego ACTIVO (configurable), invitación por voz; modo
  opcional u obligatorio; se guarda y restaura exactamente el estado del juego.
- Zona de adultos (candado arriba a la derecha: mantener 3 s + resolver una suma).

## Documentación
`docs/ARQUITECTURA.md`, `docs/PLAN_Y_AGENTES.md`, `docs/DECISIONES.md`, `docs/AGENTES.md`, `docs/ACTIVIDADES.md`.
