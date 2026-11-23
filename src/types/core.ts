/** Contratos base. CONGELADO tras la etapa 0: cambios solo vía orquestador. */
import type { FC } from 'react';
import type { DollBase } from './catalog';

export type ColorName =
  | 'rojo' | 'azul' | 'amarillo' | 'verde' | 'naranja'
  | 'morado' | 'rosa' | 'cafe' | 'negro' | 'blanco';
export const COLOR_NAMES: ColorName[] = [
  'rojo', 'azul', 'amarillo', 'verde', 'naranja', 'morado', 'rosa', 'cafe', 'negro', 'blanco',
];

export type ShapeName =
  | 'circulo' | 'cuadrado' | 'triangulo' | 'rectangulo' | 'estrella' | 'corazon' | 'ovalo';
export const SHAPE_NAMES: ShapeName[] = [
  'circulo', 'cuadrado', 'triangulo', 'rectangulo', 'estrella', 'corazon', 'ovalo',
];

export interface Pt { x: number; y: number }

/** Paleta de 3 tonos (+ acento opcional). Generar con `makePalette()` de art/kit. */
export interface Palette { main: string; light: string; shade: string; accent?: string }

/** Lado izquierdo/derecho = de la PANTALLA (no de la muñeca). */
export type AnchorName =
  | 'headTop' | 'headCenter' | 'eyeL' | 'eyeR' | 'browL' | 'browR' | 'cheekL' | 'cheekR'
  | 'nose' | 'mouth' | 'earL' | 'earR' | 'neck' | 'waist' | 'wristL' | 'wristR'
  | 'handL' | 'handR' | 'ankleL' | 'ankleR';

export interface PartProps {
  doll: DollBase;
  palette: Palette;
  /** 0..1, usado por maquillaje. */
  intensity?: number;
  /** Prefijador de ids únicos por render: usar SIEMPRE para ids de <linearGradient> etc. */
  idp: (n: string) => string;
}
export type SvgPart = FC<PartProps>;
