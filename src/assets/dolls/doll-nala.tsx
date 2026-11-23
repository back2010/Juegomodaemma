import { makeDoll, HAIR_HEX } from '@/art/kit';
import { makeCustomFace } from './faceKit';

/** Nala: piel muy oscura, cara redonda, ojos rasgados color ámbar, labios llenos. */
export const nala = makeDoll({
  id: 'nala',
  spokenName: 'Nala',
  skin: '#6b3e24',
  blush: '#d0506a',
  lip: '#8e3a4e',
  iris: '#e0a030',
  eyeShape: 'upturned',
  faceShape: 'round',
  anchorOffsets: {
    eyeL: { x: -3, y: 2 }, eyeR: { x: 3, y: 2 },
    nose: { x: 0, y: 2 }, mouth: { x: 0, y: 2 },
  },
  Face: makeCustomFace({ eye: 'upturned', lashes: 3, lowerLashes: true, nose: 'button', mouth: 'full', lid: '#1a0f14' }),
  defaultLook: {
    hair: { styleId: 'hair-ondas-largas', color: { mode: 'gradient', a: HAIR_HEX.negro, b: HAIR_HEX.castano } },
    makeup: {
      brows: { styleId: 'brows-natural', color: '#22161f', colorTag: 'negro', intensity: 1 },
      lashes: { styleId: 'lashes-natural', color: '#22161f', colorTag: 'negro', intensity: 1 },
      lips: { styleId: 'lips-classic', color: '#e8263b', colorTag: 'rojo', intensity: 1 },
      blush: { styleId: 'blush-round', color: '#ff4d6a', colorTag: 'rojo', intensity: 0.35 },
    },
    outfit: {
      top: { itemId: 'top-camiseta', variantId: 'verde' },
      bottom: { itemId: 'skirt-tablas', variantId: 'morado' },
      shoes: { itemId: 'shoes-flats', variantId: 'amarillo' },
      earrings: { itemId: 'earrings-circulo', variantId: 'amarillo' },
      bag: { itemId: 'bag-cuadrada', variantId: 'amarillo' },
    },
    stickers: [],
  },
});
