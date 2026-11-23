import type { LayerId, MakeupKind, Placement, WearSlot } from '@/types';

/** Orden de superposición (z). Ver docs/ARQUITECTURA.md §D. */
export const LAYER_Z: Record<LayerId, number> = {
  hairBack: 10, itemBack: 15, body: 20, shoes: 30, bottom: 40, top: 45, dress: 50, outer: 55,
  necklace: 60, hands: 65, bracelet: 68, ring: 68.5, head: 70, earrings: 72, face: 74, makeup: 76,
  hairFront: 80, hairAcc: 84, glasses: 86, hat: 88, bag: 90, stickers: 95,
};

export const WEAR_SLOTS: WearSlot[] = [
  'shoes', 'bottom', 'top', 'dress', 'outer', 'necklace', 'earrings', 'bracelet', 'ring',
  'glasses', 'hairAcc', 'hat', 'bag',
];
export const CLOTHES_SLOTS: WearSlot[] = ['dress', 'top', 'bottom', 'outer', 'shoes'];
export const ACCESSORY_SLOTS: WearSlot[] = ['earrings', 'necklace', 'bracelet', 'ring', 'glasses', 'hairAcc', 'hat', 'bag'];

export const MAKEUP_ORDER: MakeupKind[] = [
  'freckles', 'blush', 'eyeshadow', 'liner', 'lashes', 'brows', 'lips', 'gloss', 'sparkle',
];
export const makeupZ = (k: MakeupKind) => LAYER_Z.makeup + (MAKEUP_ORDER.indexOf(k) + 1) * 0.1;

/** Colocación por defecto del maquillaje; la parte se dibuja para el lado izquierdo de pantalla. */
export const MAKEUP_PLACEMENT: Record<MakeupKind, Placement> = {
  brows: { pair: ['browL', 'browR'] },
  eyeshadow: { pair: ['eyeL', 'eyeR'] },
  liner: { pair: ['eyeL', 'eyeR'] },
  lashes: { pair: ['eyeL', 'eyeR'] },
  blush: { pair: ['cheekL', 'cheekR'] },
  freckles: { pair: ['cheekL', 'cheekR'] },
  lips: { anchor: 'mouth' },
  gloss: { anchor: 'mouth' },
  sparkle: 'abs',
};

/**
 * Miniaturas por slot [x,y,w,h]. Para ítems con placement 'abs' son coordenadas de la muñeca;
 * para ítems con placement {anchor}/{pair} son coordenadas LOCALES de la parte.
 */
export const SLOT_THUMB: Record<WearSlot, [number, number, number, number]> = {
  shoes: [220, 880, 160, 110], bottom: [190, 570, 220, 300], top: [170, 420, 260, 250],
  dress: [150, 410, 300, 480], outer: [160, 420, 280, 280], necklace: [240, 400, 120, 120],
  earrings: [-28, 4, 56, 56], bracelet: [-20, -18, 40, 30], ring: [-14, -6, 28, 22],
  glasses: [160, 210, 280, 130], hairAcc: [0, -40, 160, 130], hat: [90, 0, 420, 260], bag: [340, 600, 170, 210],
};
