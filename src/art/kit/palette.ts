import type { ColorName, Palette } from '@/types';

/** Colores "de aprendizaje": tonos vivos y reconocibles para cada nombre. */
export const COLOR_HEX: Record<ColorName, string> = {
  rojo: '#e8263b', azul: '#2f6fe8', amarillo: '#ffd21f', verde: '#2fbf4a', naranja: '#ff8a1f',
  morado: '#8e44e8', rosa: '#ff5fb0', cafe: '#8a5a33', negro: '#2b2433', blanco: '#fbf7f4',
};

/** Colores de marca de la interfaz (fucsia, rosa, morado, turquesa, azul, amarillo, coral, verde). */
export const BRAND = {
  fucsia: '#ff2d95', rosa: '#ff8ac6', morado: '#9b4dff', turquesa: '#22d3c5',
  azul: '#3a8bff', amarillo: '#ffd23f', coral: '#ff6f61', verde: '#3ddc84',
};

function clamp(n: number, a = 0, b = 1) { return Math.min(b, Math.max(a, n)); }

export function hexToHsl(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(v.slice(0, 2), 16) / 255, g = parseInt(v.slice(2, 4), 16) / 255, b = parseInt(v.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hh = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    hh = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    hh /= 6;
  }
  return [hh * 360, s, l];
}

export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360; s = clamp(s); l = clamp(l);
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const to = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${to(f(0))}${to(f(8))}${to(f(4))}`;
}

/** Aclara (+) u oscurece (-) en luminosidad absoluta. */
export function shift(hex: string, dl: number, ds = 0): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s + ds, l + dl);
}

/** Paleta estándar: light (+18% L), main, shade (−35% relativo). */
export function makePalette(main: string, accent?: string): Palette {
  const [h, s, l] = hexToHsl(main);
  const light = hslToHex(h, s, l + (1 - l) * 0.45);
  const shade = hslToHex(h + (l > 0.85 ? 0 : -6), Math.min(1, s + 0.05), l * 0.65);
  return { main, light, shade, ...(accent ? { accent } : {}) };
}

export const paletteOf = (c: ColorName) => makePalette(COLOR_HEX[c]);

/** Contorno estándar del kit: tono shade un poco más oscuro. */
export const outline = (p: Palette) => shift(p.shade, -0.08);

/** Colores de cabello. */
export const HAIR_HEX = {
  negro: '#2a1f2d', castano: '#6b3f22', cafe: '#8a5a33', caramelo: '#c07a3a', rubio: '#f2c45a',
  pelirrojo: '#d8552a', rosa: '#ff6fb8', morado: '#9b5de5', azul: '#3a8bff', turquesa: '#22d3c5',
  plata: '#cfd3e6', menta: '#5fe0a8',
} as const;

/** Tonos de piel (de muy claro a muy oscuro). */
export const SKIN_HEX = ['#ffe3cf', '#f6c9a4', '#e3a77c', '#c98656', '#9a5f39', '#6b3e24'] as const;

import type { ColorVariant } from '@/types';
/** Variantes de color a partir de nombres de color educativos. */
export function variantsOf(...colors: ColorName[]): ColorVariant[] {
  return colors.map((c) => ({ id: c, colorTags: [c], palette: paletteOf(c) }));
}
/** Variante con tono propio (p.ej. turquesa) etiquetada con su color educativo más cercano. */
export function variant(id: string, hex: string, ...tags: [ColorName, ...ColorName[]]): ColorVariant {
  return { id, colorTags: tags, palette: makePalette(hex) };
}
