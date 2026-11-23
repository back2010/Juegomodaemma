import { makeDoll, HAIR_HEX } from '@/art/kit';

/** Muñeca de referencia (P0). Las demás muñecas siguen este patrón. */
export const sofi = makeDoll({
  id: 'sofi',
  spokenName: 'Sofi',
  skin: '#e9b48c',
  blush: '#ff7f8f',
  lip: '#e04f78',
  iris: '#1fb5a8',
  eyeShape: 'almond',
  faceShape: 'oval',
  defaultLook: {
    hair: { styleId: 'hair-ondas-largas', color: { mode: 'solid', a: HAIR_HEX.castano } },
    makeup: {
      brows: { styleId: 'brows-natural', color: '#4a2c1d', colorTag: 'cafe', intensity: 1 },
      lashes: { styleId: 'lashes-natural', color: '#22161f', colorTag: 'negro', intensity: 1 },
    },
    outfit: {
      dress: { itemId: 'dress-fiesta', variantId: 'rosa' },
      shoes: { itemId: 'shoes-flats', variantId: 'morado' },
    },
    stickers: [],
  },
});
