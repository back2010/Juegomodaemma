/** Estado de una creación. CONGELADO tras la etapa 0. */
import type { ColorName } from './core';
import type { MakeupKind, WearSlot } from './catalog';

export type HairColor =
  | { mode: 'solid'; a: string }
  | { mode: 'gradient' | 'two'; a: string; b: string }
  | { mode: 'rainbow' };

export type Intensity = 0.35 | 0.65 | 1;
export interface MakeupLayer { styleId: string; color: string; colorTag: ColorName; intensity: Intensity }

export type StickerZone = 'hair' | 'face' | 'body' | 'free';
export interface StickerPlacement {
  uid: string; stickerId: string; x: number; y: number; scale: number; rot: number; zone: StickerZone;
}

export interface DollLook {
  dollId: string;
  hair: { styleId: string; color: HairColor };
  makeup: Partial<Record<MakeupKind, MakeupLayer>>;
  outfit: Partial<Record<WearSlot, { itemId: string; variantId: string }>>;
  stickers: StickerPlacement[];
}

export interface Scene { backgroundId: string; frameId: string | null }

export interface Creation {
  id: string;
  schemaVersion: 1;
  createdAt: number;
  updatedAt: number;
  title?: string;
  look: DollLook;
  scene: Scene;
  imageKey: string;
  thumbKey: string;
  parentId?: string;
}
export type CreationMeta = Creation;
