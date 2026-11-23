import type { CatalogItem } from '@/types';
import { referenceClothes } from './reference';
import { dressClothes } from './dresses';
import { topClothes } from './tops';
import { bottomClothes } from './bottoms';
import { outerClothes } from './outer';
import { shoeClothes } from './shoes';
import { costumeClothes } from './costumes';

/** Referencia primero (la muñeca por defecto la usa). */
const clothes: CatalogItem[] = [
  ...referenceClothes, ...dressClothes, ...costumeClothes, ...topClothes, ...bottomClothes, ...outerClothes, ...shoeClothes,
];
export default clothes;
