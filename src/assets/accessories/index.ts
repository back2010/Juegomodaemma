import type { CatalogItem } from '@/types';
import { referenceAccessories } from './reference';
import { earrings } from './earrings';
import { necklaces } from './necklaces';
import { jewelry } from './jewelry';
import { glasses } from './glasses';
import { hairAccessories } from './hair-acc';
import { hats } from './hats';
import { bags } from './bags';

const accessories: CatalogItem[] = [
  ...referenceAccessories, ...earrings, ...necklaces, ...jewelry, ...glasses, ...hairAccessories, ...hats, ...bags,
];
export default accessories;
