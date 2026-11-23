import type { ColorName, MakeupKind } from '@/types';
import { COLOR_HEX } from '@/art/kit';

export interface MakeupColor { hex: string; tag: ColorName }
const c = (tag: ColorName, hex = COLOR_HEX[tag]): MakeupColor => ({ hex, tag });

/** Colores disponibles por tipo de maquillaje (P2 puede ampliar). */
export const MAKEUP_COLORS: Record<MakeupKind, MakeupColor[]> = {
  brows: [c('cafe', '#4a2c1d'), c('negro', '#22161f'), c('cafe', '#a0683a'), c('amarillo', '#d9a441'), c('rosa'), c('morado')],
  eyeshadow: [c('rosa'), c('morado'), c('azul'), c('verde'), c('amarillo'), c('naranja'), c('rojo'), c('cafe'), c('azul', '#22d3c5'), c('blanco', '#f3e8ff')],
  liner: [c('negro', '#22161f'), c('cafe', '#4a2c1d'), c('azul'), c('morado'), c('verde'), c('rosa')],
  lashes: [c('negro', '#22161f'), c('cafe', '#4a2c1d'), c('azul'), c('morado'), c('rosa')],
  blush: [c('rosa', '#ff6f9c'), c('rojo', '#ff4d6a'), c('naranja', '#ff9a6a'), c('morado', '#c77dff'), c('rosa', '#ffa8c8')],
  lips: [c('rojo'), c('rosa'), c('morado'), c('naranja'), c('cafe', '#b0604a'), c('azul'), c('rosa', '#ff2d95')],
  gloss: [c('blanco', '#ffffff'), c('rosa', '#ffc2e0'), c('morado', '#e3c2ff'), c('amarillo', '#fff1a8')],
  freckles: [c('cafe', '#9a6240'), c('cafe', '#c48a5f'), c('rosa'), c('morado')],
  sparkle: [c('amarillo'), c('rosa'), c('azul'), c('morado'), c('blanco', '#ffffff'), c('verde'), c('naranja')],
};
