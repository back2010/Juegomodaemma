import type { DollBase } from '@/types';
import { sofi } from './doll-sofi';
import { luna } from './doll-luna';
import { mia } from './doll-mia';
import { ana } from './doll-ana';
import { zoe } from './doll-zoe';
import { nala } from './doll-nala';

/** Orden en pantalla: de piel más clara a más oscura. */
const dolls: DollBase[] = [luna, mia, sofi, ana, zoe, nala];
export default dolls;
