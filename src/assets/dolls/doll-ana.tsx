import { makeDoll, HAIR_HEX } from '@/art/kit';
import { makeCustomFace } from './faceKit';

/** Ana: piel morena clara, cara ovalada, ojos redondos color miel, sonrisa amplia. */
export const ana = makeDoll({
  id: 'ana',
  spokenName: 'Ana',
  skin: '#d39a6a',
  blush: '#f0707a',
  lip: '#c94f62',
  iris: '#c98a2a',
  eyeShape: 'round',
  faceShape: 'oval',
  anchorOffsets: {
    eyeL: { x: 2, y: 0 }, eyeR: { x: -2, y: 0 },
    nose: { x: 0, y: 2 }, mouth: { x: 0, y: 2 },
  },
  Face: makeCustomFace({ eye: 'round', lashes: 2, lowerLashes: true, nose: 'curve', mouth: 'smile' }),
  defaultLook: {
    hair: { styleId: 'hair-ondas-largas', color: { mode: 'gradient', a: HAIR_HEX.caramelo, b: HAIR_HEX.rubio } },
    makeup: {
      brows: { styleId: 'brows-natural', color: '#4a2c1d', colorTag: 'cafe', intensity: 1 },
      lashes: { styleId: 'lashes-natural', color: '#22161f', colorTag: 'negro', intensity: 1 },
      lips: { styleId: 'lips-classic', color: '#ff8a1f', colorTag: 'naranja', intensity: 0.65 },
      blush: { styleId: 'blush-round', color: '#ff4d6a', colorTag: 'rojo', intensity: 0.35 },
    },
    outfit: {
      top: { itemId: 'top-camiseta', variantId: 'blanco' },
      outer: { itemId: 'jacket-mezclilla', variantId: 'mezclilla' },
      bottom: { itemId: 'skirt-tablas', variantId: 'rosa' },
      shoes: { itemId: 'shoes-flats', variantId: 'rosa' },
      earrings: { itemId: 'earrings-circulo', variantId: 'perla' },
    },
    stickers: [],
  },
});
