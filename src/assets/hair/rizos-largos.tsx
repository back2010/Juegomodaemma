import type { HairPartProps, HairStyle } from '@/types';
import { Gloss } from '@/art/kit';
import { Chain, curlD, line, mirrorPts, scallop, Shine, Strands } from './parts';

/** Rizos largos tipo tirabuzón. */
const OUT: [number, number][] = [
  [300, 80], [392, 92], [452, 150], [472, 230], [480, 320], [488, 410], [492, 500], [486, 590], [458, 642], [422, 626],
  [390, 652], [350, 632], [300, 648], [250, 632], [210, 652], [178, 626], [142, 642], [114, 590], [108, 500], [112, 410],
  [120, 320], [128, 230], [148, 150], [208, 92],
];
const SPIRALS: [number, number, number][] = [
  [140, 360, 18], [150, 450, 20], [134, 540, 18], [160, 610, 16], [460, 360, 18], [450, 450, 20], [466, 540, 18], [440, 610, 16],
  [196, 600, 16], [404, 600, 16], [300, 610, 16], [250, 600, 14], [350, 600, 14],
];
const RING_L: [number, number][] = [[182, 246], [178, 286], [176, 326], [176, 366], [178, 406], [182, 444]];

function Back({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      <path d={scallop(OUT, 12)} fill={fill} {...line(p)} />
      {SPIRALS.map(([x, y, r], i) => (
        <path key={i} d={curlD(x, y, r)} stroke={p.shade} strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.55} />
      ))}
      <Shine p={p} w={7} o={0.4} d="M136 270C128 330 134 400 126 460M464 270C472 330 466 400 474 460" />
    </g>
  );
}

function Front({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      <path d="M156 300C144 156 212 86 300 86C388 86 456 156 444 300C438 252 426 216 404 194C372 202 338 196 312 176C290 196 254 204 222 202C198 214 180 250 168 292Z"
        fill={fill} {...line(p)} />
      <path d="M404 194C394 176 378 164 358 158M312 176C306 158 292 144 274 136" stroke={p.shade} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.6} />
      <Strands p={p} d="M222 202C246 176 280 156 322 142M196 226C210 190 236 164 272 146M420 250C424 210 414 180 396 156" />
      <Chain pts={RING_L} w={36} fill={fill} p={p} mode="ringlet" />
      <Chain pts={mirrorPts(RING_L)} w={36} fill={fill} p={p} mode="ringlet" />
      <Shine p={p} d="M206 136Q290 100 392 130" w={10} o={0.5} />
      <Gloss cx={248} cy={122} rx={22} ry={8} rot={-22} o={0.45} />
    </g>
  );
}

export const rizosLargos: HairStyle = {
  id: 'hair-rizos-largos', kinds: ['largo', 'rizado'], spokenName: 'rizos largos', volume: 2, Back, Front, hatOffsetY: -20,
};
