/** Palabras habladas con concordancia (género/número) para colores, figuras y prendas. */
import type { ColorName, ShapeName } from '@/types';

export type Gender = 'm' | 'f';
export interface Noun { w: string; g: Gender; pl: boolean }

const RAW_COLOR: Record<ColorName, [string, string, string, string]> = {
  rojo: ['rojo', 'roja', 'rojos', 'rojas'],
  azul: ['azul', 'azul', 'azules', 'azules'],
  amarillo: ['amarillo', 'amarilla', 'amarillos', 'amarillas'],
  verde: ['verde', 'verde', 'verdes', 'verdes'],
  naranja: ['naranja', 'naranja', 'naranjas', 'naranjas'],
  morado: ['morado', 'morada', 'morados', 'moradas'],
  rosa: ['rosa', 'rosa', 'rosas', 'rosas'],
  cafe: ['café', 'café', 'cafés', 'cafés'],
  negro: ['negro', 'negra', 'negros', 'negras'],
  blanco: ['blanco', 'blanca', 'blancos', 'blancas'],
};

/** Nombre del color para decirlo solo ("rojo", "café"). */
export const colorName = (c: ColorName) => RAW_COLOR[c][0];
/** Adjetivo de color concordado: colorAdj('rojo','f',true) → "rojas". */
export function colorAdj(c: ColorName, g: Gender, pl: boolean) {
  const r = RAW_COLOR[c];
  return r[(g === 'f' ? 1 : 0) + (pl ? 2 : 0)];
}

export const SHAPE_NOUN: Record<ShapeName, Noun> = {
  circulo: { w: 'círculo', g: 'm', pl: false },
  cuadrado: { w: 'cuadrado', g: 'm', pl: false },
  triangulo: { w: 'triángulo', g: 'm', pl: false },
  rectangulo: { w: 'rectángulo', g: 'm', pl: false },
  estrella: { w: 'estrella', g: 'f', pl: false },
  corazon: { w: 'corazón', g: 'm', pl: false },
  ovalo: { w: 'óvalo', g: 'm', pl: false },
};
const SHAPE_PLURAL: Record<ShapeName, string> = {
  circulo: 'círculos', cuadrado: 'cuadrados', triangulo: 'triángulos', rectangulo: 'rectángulos',
  estrella: 'estrellas', corazon: 'corazones', ovalo: 'óvalos',
};
export const shapePlural = (s: ShapeName) => SHAPE_PLURAL[s];

/** "aretes circulares", "bolsa de corazón". */
export function shapeAdj(s: ShapeName, g: Gender, pl: boolean): string {
  const inv = (sg: string, p: string) => (pl ? p : sg);
  switch (s) {
    case 'circulo': return inv('circular', 'circulares');
    case 'triangulo': return inv('triangular', 'triangulares');
    case 'rectangulo': return inv('rectangular', 'rectangulares');
    case 'cuadrado': return (g === 'f' ? 'cuadrada' : 'cuadrado') + (pl ? 's' : '');
    case 'ovalo': return (g === 'f' ? 'ovalada' : 'ovalado') + (pl ? 's' : '');
    case 'estrella': return 'de estrella';
    case 'corazon': return 'de corazón';
  }
}

export function article(n: Noun, definite: boolean) {
  if (definite) return n.g === 'f' ? (n.pl ? 'las' : 'la') : n.pl ? 'los' : 'el';
  return n.g === 'f' ? (n.pl ? 'unas' : 'una') : n.pl ? 'unos' : 'un';
}

/** "la estrella roja", "unos zapatos amarillos". */
export function nounWithColor(n: Noun, c: ColorName, art: 'def' | 'indef' | 'none' = 'def') {
  const core = `${n.w} ${colorAdj(c, n.g, n.pl)}`;
  if (art === 'none') return core;
  return `${article(n, art === 'def')} ${core}`;
}

const NUM = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];
/** Número dicho con género ("una estrella", "un corazón"). */
export function numberWord(n: number, g: Gender) {
  if (n === 1) return g === 'f' ? 'una' : 'un';
  return NUM[n] ?? String(n);
}
