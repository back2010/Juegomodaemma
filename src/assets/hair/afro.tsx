import type { HairPartProps, HairStyle } from '@/types';
import { Gloss } from '@/art/kit';
import { curlD, ellipsePts, line, scallop, Shine } from './parts';

/** Rizos grandes con mucho volumen (afro). */
const CLOUD = scallop(ellipsePts(300, 236, 200, 190, 0, 360, 24).slice(0, 24), 16);
const CURLS: [number, number, number][] = [
  [150, 200, 22], [130, 290, 20], [160, 370, 22], [450, 200, 22], [470, 290, 20], [440, 370, 22],
  [200, 120, 20], [400, 120, 20], [250, 72, 18], [350, 72, 18], [300, 60, 16], [120, 240, 16], [480, 240, 16],
  [190, 410, 18], [410, 410, 18],
];

function Back({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      <path d={CLOUD} fill={fill} {...line(p)} />
      {CURLS.map(([x, y, r], i) => (
        <path key={i} d={curlD(x, y, r)} stroke={p.shade} strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.55} />
      ))}
      <Shine p={p} d="M136 180A190 180 0 0 1 220 76" w={10} o={0.4} />
    </g>
  );
}

function Front({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      <path d={`${reverseScallop()}Z`} fill={fill} {...line(p)} />
      {[[204, 150, 18], [256, 124, 18], [300, 118, 16], [344, 124, 18], [396, 150, 18], [176, 230, 15], [424, 230, 15]].map(([x, y, r], i) => (
        <path key={i} d={curlD(x, y, r)} stroke={p.shade} strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.55} />
      ))}
      <Shine p={p} d="M214 120Q300 88 386 120" w={9} o={0.45} />
      <Gloss cx={246} cy={108} rx={20} ry={7} rot={-20} o={0.45} />
    </g>
  );
}

const HL: [number, number][] = [[156, 300], [164, 252], [184, 214], [214, 188], [248, 174], [282, 168], [318, 168], [352, 174], [386, 188], [416, 214], [436, 252], [444, 300]];
/** Borde inferior de rizos (abulta hacia la cara). */
function reverseScallop() {
  const top = scallop([[444, 300], ...ellipsePts(300, 262, 158, 186, 352, 188, 9).slice(1), [156, 300]], -9, false).replace(/^M444 300/, '');
  return `${scallop(HL, -10, false)}${top}`;
}

export const afro: HairStyle = {
  id: 'hair-afro', kinds: ['rizado'], spokenName: 'rizos grandes', volume: 3, Back, Front, hatOffsetY: -58,
};
