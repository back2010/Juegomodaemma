import type { HairPartProps, HairStyle } from '@/types';
import { Gloss } from '@/art/kit';
import { Chain, CROWN_SLEEK, CrownDetails, Curl, line, mirrorPts, NapeBack } from './parts';

/** Recogido de fiesta con rizos arriba, tirabuzones y perlitas. */
const TOP: [number, number, number][] = [
  [262, 44, 28], [338, 44, 28], [204, 104, 32], [396, 104, 32], [240, 74, 36], [360, 74, 36], [300, 62, 40],
];
const RING: [number, number][] = [[178, 238], [176, 272], [176, 306], [178, 340], [182, 374], [186, 404]];
const PEARLS: [number, number][] = [[222, 118], [252, 104], [284, 98], [316, 98], [348, 104], [378, 118]];

function Back({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      <NapeBack p={p} fill={fill} bottom={300} />
      {TOP.map(([x, y, r], i) => <Curl key={i} cx={x} cy={y} r={r} fill={fill} p={p} />)}
    </g>
  );
}

function Front({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      <path d={CROWN_SLEEK} fill={fill} {...line(p)} />
      <CrownDetails p={p} to={[300, 92]} />
      <Chain pts={RING} w={26} fill={fill} p={p} mode="ringlet" />
      <Chain pts={mirrorPts(RING)} w={26} fill={fill} p={p} mode="ringlet" />
      {PEARLS.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={6} fill="#fffaf2" stroke="#d9c9b8" strokeWidth={1.5} />
          <Gloss cx={x - 2} cy={y - 2} rx={2.2} ry={1.4} o={0.9} />
        </g>
      ))}
    </g>
  );
}

export const fiestaRizos: HairStyle = {
  id: 'hair-fiesta-rizos', kinds: ['fiesta', 'recogido', 'rizado'], spokenName: 'peinado de fiesta con rizos', volume: 3,
  Back, Front, hatOffsetY: -52,
};
