import { makeDoll, HAIR_HEX } from '@/art/kit';
import { makeCustomFace } from './faceKit';

/** Luna: piel muy clara, cara redonda, ojos redondos azules y un lunar junto al ojo. */
export const luna = makeDoll({
  id: 'luna',
  spokenName: 'Luna',
  skin: '#ffe3cf',
  blush: '#ff8fae',
  lip: '#f0708f',
  iris: '#4a8ff0',
  eyeShape: 'round',
  faceShape: 'round',
  anchorOffsets: {
    eyeL: { x: -2, y: 4 }, eyeR: { x: 2, y: 4 },
    cheekL: { x: -2, y: 2 }, cheekR: { x: 2, y: 2 },
    mouth: { x: 0, y: -2 },
  },
  Face: makeCustomFace({ eye: 'round', lashes: 2, nose: 'button', mouth: 'petite', mole: { x: 392, y: 304 } }),
  defaultLook: {
    hair: { styleId: 'hair-ondas-largas', color: { mode: 'gradient', a: HAIR_HEX.rubio, b: HAIR_HEX.plata } },
    makeup: {
      brows: { styleId: 'brows-natural', color: '#d9a441', colorTag: 'amarillo', intensity: 1 },
      lashes: { styleId: 'lashes-natural', color: '#4a2c1d', colorTag: 'cafe', intensity: 1 },
      lips: { styleId: 'lips-classic', color: '#ff5fb0', colorTag: 'rosa', intensity: 0.65 },
      blush: { styleId: 'blush-round', color: '#ff6f9c', colorTag: 'rosa', intensity: 0.65 },
    },
    outfit: {
      top: { itemId: 'top-camiseta', variantId: 'amarillo' },
      bottom: { itemId: 'skirt-tablas', variantId: 'azul' },
      shoes: { itemId: 'shoes-flats', variantId: 'azul' },
      hairAcc: { itemId: 'bow-grande', variantId: 'azul' },
    },
    stickers: [],
  },
});
