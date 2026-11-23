import type { HairPartProps, HairStyle } from '@/types';
import { CROWN_SLEEK, CrownDetails, line, NapeBack, Shine, Strands, Tie } from './parts';

/** Cola de caballo alta que cae hacia un lado. */
function Back({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      <NapeBack p={p} fill={fill} bottom={300} />
      <path d="M296 100C340 40 440 40 484 104C522 162 520 262 510 350C504 410 488 462 462 500C458 470 452 450 452 430C440 456 426 470 414 478C426 430 430 380 428 330C426 280 428 240 420 206C410 160 374 124 326 112Z"
        fill={fill} {...line(p)} />
      <Strands p={p} d="M340 76C410 60 470 110 482 180C492 250 486 330 476 410M350 98C410 98 446 150 456 220C464 290 458 360 446 440" />
      <Shine p={p} d="M392 60C440 70 474 104 488 150" w={9} o={0.45} />
    </g>
  );
}

function Front({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      <path d={CROWN_SLEEK} fill={fill} {...line(p)} />
      <CrownDetails p={p} to={[318, 96]} />
      <Tie cx={322} cy={92} rx={18} ry={10} rot={-28} p={p} />
    </g>
  );
}

export const colaAlta: HairStyle = {
  id: 'hair-cola-alta', kinds: ['recogido', 'largo'], spokenName: 'cola de caballo', volume: 2, Back, Front, hatOffsetY: -24,
};
