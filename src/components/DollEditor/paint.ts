import type { HairColor } from '@/types';
import { RAINBOW, makePalette } from '@/art/kit';

/** Fondo CSS brillante para un círculo de color. */
export function swatchPaint(hex: string) {
  const p = makePalette(hex);
  return `radial-gradient(circle at 35% 30%, #ffffffcc 0 12%, transparent 13%), radial-gradient(circle at 40% 35%, ${p.light}, ${p.main} 55%, ${p.shade})`;
}
export function hairPaintCss(c: HairColor) {
  const gloss = 'radial-gradient(circle at 35% 30%, #ffffffcc 0 12%, transparent 13%)';
  switch (c.mode) {
    case 'solid': return swatchPaint(c.a);
    case 'gradient': return `${gloss}, linear-gradient(180deg, ${c.a}, ${c.b})`;
    case 'two': return `${gloss}, linear-gradient(90deg, ${c.a} 50%, ${c.b} 50%)`;
    case 'rainbow': return `${gloss}, linear-gradient(180deg, ${RAINBOW.join(',')})`;
  }
}
