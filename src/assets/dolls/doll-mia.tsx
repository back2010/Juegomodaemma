import { makeDoll, HAIR_HEX } from '@/art/kit';
import { makeCustomFace } from './faceKit';

/** Mía: piel clara con pecas, cara de corazón, ojos rasgados hacia arriba color verde. */
export const mia = makeDoll({
  id: 'mia',
  spokenName: 'Mía',
  skin: '#f6c9a4',
  blush: '#ff7f86',
  lip: '#e25c6e',
  iris: '#3bb35a',
  eyeShape: 'upturned',
  faceShape: 'heart',
  anchorOffsets: {
    eyeL: { x: -2, y: -2 }, eyeR: { x: 2, y: -2 },
    browL: { x: 0, y: -4 }, browR: { x: 0, y: -4 },
    mouth: { x: 0, y: 2 },
  },
  Face: makeCustomFace({ eye: 'upturned', lashes: 3, nose: 'curve', mouth: 'smile', freckles: '#c07a50' }),
  defaultLook: {
    hair: { styleId: 'hair-ondas-largas', color: { mode: 'solid', a: HAIR_HEX.pelirrojo } },
    makeup: {
      brows: { styleId: 'brows-natural', color: '#a0683a', colorTag: 'cafe', intensity: 1 },
      lashes: { styleId: 'lashes-natural', color: '#4a2c1d', colorTag: 'cafe', intensity: 1 },
      lips: { styleId: 'lips-classic', color: '#e8263b', colorTag: 'rojo', intensity: 0.65 },
      blush: { styleId: 'blush-round', color: '#ff9a6a', colorTag: 'naranja', intensity: 0.65 },
    },
    outfit: {
      dress: { itemId: 'dress-fiesta', variantId: 'turquesa' },
      shoes: { itemId: 'shoes-flats', variantId: 'blanco' },
      necklace: { itemId: 'necklace-corazon', variantId: 'rosa' },
      bracelet: { itemId: 'bracelet-perlas', variantId: 'perla' },
    },
    stickers: [],
  },
});
