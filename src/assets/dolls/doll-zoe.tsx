import { makeDoll, HAIR_HEX } from '@/art/kit';
import { makeCustomFace } from './faceKit';

/** Zoe: piel morena, cara de corazón, ojos almendrados color avellana y lunar sobre el labio. */
export const zoe = makeDoll({
  id: 'zoe',
  spokenName: 'Zoe',
  skin: '#a5683f',
  blush: '#e0606e',
  lip: '#a8455a',
  iris: '#8a6a3a',
  eyeShape: 'almond',
  faceShape: 'heart',
  anchorOffsets: {
    eyeL: { x: -3, y: 2 }, eyeR: { x: 3, y: 2 },
    cheekL: { x: 2, y: -2 }, cheekR: { x: -2, y: -2 },
  },
  Face: makeCustomFace({ eye: 'almond', lashes: 3, nose: 'button', mouth: 'full', mole: { x: 322, y: 338 } }),
  defaultLook: {
    hair: { styleId: 'hair-ondas-largas', color: { mode: 'gradient', a: HAIR_HEX.negro, b: HAIR_HEX.morado } },
    makeup: {
      brows: { styleId: 'brows-natural', color: '#22161f', colorTag: 'negro', intensity: 1 },
      lashes: { styleId: 'lashes-natural', color: '#22161f', colorTag: 'negro', intensity: 1 },
      lips: { styleId: 'lips-classic', color: '#8e44e8', colorTag: 'morado', intensity: 0.65 },
      blush: { styleId: 'blush-round', color: '#c77dff', colorTag: 'morado', intensity: 0.35 },
    },
    outfit: {
      dress: { itemId: 'dress-fiesta', variantId: 'amarillo' },
      shoes: { itemId: 'shoes-flats', variantId: 'morado' },
      necklace: { itemId: 'necklace-corazon', variantId: 'morado' },
      ring: { itemId: 'ring-estrella', variantId: 'morado' },
    },
    stickers: [],
  },
});
