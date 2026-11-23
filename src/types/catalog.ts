/** Tipos del catálogo de arte. CONGELADO tras la etapa 0. */
import type { FC } from 'react';
import type { AnchorName, ColorName, Palette, PartProps, Pt, ShapeName, SvgPart } from './core';
import type { DollLook, HairColor } from './look';

/** Capas en orden de atrás hacia adelante; ver art/layers.ts (LAYER_Z). */
export type LayerId =
  | 'hairBack' | 'itemBack' | 'body' | 'shoes' | 'bottom' | 'top' | 'dress' | 'outer'
  | 'necklace' | 'hands' | 'bracelet' | 'ring' | 'head' | 'earrings' | 'face' | 'makeup'
  | 'hairFront' | 'hairAcc' | 'glasses' | 'hat' | 'bag' | 'stickers';

export interface DollBase {
  id: string;
  /** Nombre que dice la voz: "Sofi". */
  spokenName: string;
  skin: Palette & { blush: string; lip: string };
  eyes: { iris: Palette; shape: 'almond' | 'round' | 'upturned' };
  faceShape: 'oval' | 'round' | 'heart';
  /** Anclajes absolutos en el viewBox 0 0 600 1000. Solo los de cara varían (±10px). */
  anchors: Record<AnchorName, Pt>;
  Body: SvgPart; Head: SvgPart; Face: SvgPart; Hands: SvgPart;
  defaultLook: Omit<DollLook, 'dollId'>;
}

export type WearSlot =
  | 'shoes' | 'bottom' | 'top' | 'dress' | 'outer' | 'necklace' | 'earrings' | 'bracelet'
  | 'ring' | 'glasses' | 'hairAcc' | 'hat' | 'bag';

export interface ColorVariant { id: string; colorTags: [ColorName, ...ColorName[]]; palette: Palette }

/**
 * Dónde se dibuja una parte:
 *  - 'abs' (defecto): coordenadas absolutas del viewBox (prendas de cuerpo).
 *  - { anchor }: origen local en ese anclaje (lentes en 'headCenter', collar en 'neck').
 *  - { pair }: se dibuja en ambos anclajes; el segundo se espeja con scale(-1,1).
 *    La parte se dibuja para el lado IZQUIERDO de pantalla.
 */
export type Placement = 'abs' | { anchor: AnchorName } | { pair: [AnchorName, AnchorName] };

export type ItemTheme = 'casual' | 'fiesta' | 'deporte' | 'playa' | 'disfraz' | 'fantasia';

export interface CatalogItem {
  id: string;
  slot: WearSlot;
  /** 'vestido', 'aretes', 'tenis'... (español, minúsculas) */
  kind: string;
  spokenName: string;
  theme: ItemTheme;
  /** Mínimo 3 variantes. */
  variants: ColorVariant[];
  shapeTag?: ShapeName;
  count?: number;
  /** Un ítem puede pintar en varias capas (p.ej. sombrero: 'itemBack' + 'hat'). */
  parts: Partial<Record<LayerId, SvgPart>>;
  placement?: Placement;
  /** Oculta (sin borrar) los slots indicados mientras este ítem está puesto. */
  suppresses?: WearSlot[];
  hairFit?: 'over' | 'compress';
  compat?: { dolls?: string[] };
  /** viewBox para miniatura [x,y,w,h] en coordenadas de la muñeca. */
  thumb?: [number, number, number, number];
}

export type HairKind =
  | 'corto' | 'largo' | 'lacio' | 'ondulado' | 'rizado' | 'trenzas' | 'coletas'
  | 'chongo' | 'recogido' | 'fiesta';

export interface HairPartProps extends PartProps {
  /** Relleno principal: color sólido o url(#...) de degradado/arcoíris ya definido. */
  fill: string;
}
export interface HairStyle {
  id: string;
  kinds: HairKind[];
  spokenName: string;
  volume: 1 | 2 | 3;
  Back: FC<HairPartProps>;
  Front: FC<HairPartProps>;
  /** Desplazamiento vertical de sombreros/coronas (negativo = más arriba). */
  hatOffsetY: number;
}
export type { HairColor };

export type MakeupKind =
  | 'brows' | 'eyeshadow' | 'liner' | 'lashes' | 'blush' | 'lips' | 'gloss' | 'freckles' | 'sparkle';

export interface MakeupStyle {
  id: string;
  kind: MakeupKind;
  spokenName?: string;
  shapeTag?: ShapeName;
  /** Si se omite se usa la colocación por defecto del tipo (MAKEUP_PLACEMENT). */
  placement?: Placement;
  Part: SvgPart;
}

export interface StickerDef {
  id: string;
  shapeTag: ShapeName;
  colorTag: ColorName;
  /** Dibujado centrado en (0,0), radio aprox. 40. */
  Part: SvgPart;
}
