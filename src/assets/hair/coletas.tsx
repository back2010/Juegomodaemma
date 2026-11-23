import type { HairPartProps, HairStyle } from '@/types';
import { CROWN_PART, CrownDetails, line, mirrorD, NapeBack, Shine, Strands, Tie } from './parts';

/** Dos coletas altas a los lados. */
const TAIL_L = 'M190 156C136 118 72 150 58 226C46 296 70 366 96 410C104 426 112 438 122 446C120 420 118 396 124 376C132 350 132 322 140 296C152 256 172 222 198 196Z';
const STR_L = 'M150 170C110 200 96 250 98 300C100 340 110 380 112 420M170 186C138 220 126 270 128 320M120 176C88 210 78 260 80 310';
const SHINE_L = 'M108 180C84 214 76 254 80 296';

function Back({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      <NapeBack p={p} fill={fill} bottom={316} />
      {[false, true].map((m) => (
        <g key={String(m)}>
          <path d={m ? mirrorD(TAIL_L) : TAIL_L} fill={fill} {...line(p)} />
          <Strands p={p} d={m ? mirrorD(STR_L) : STR_L} />
          <Shine p={p} d={m ? mirrorD(SHINE_L) : SHINE_L} w={8} o={0.45} />
        </g>
      ))}
    </g>
  );
}

function Front({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      <path d={CROWN_PART} fill={fill} {...line(p)} />
      <CrownDetails p={p} part />
      <Tie cx={182} cy={176} rx={16} ry={9} rot={-52} p={p} />
      <Tie cx={418} cy={176} rx={16} ry={9} rot={52} p={p} />
    </g>
  );
}

export const coletas: HairStyle = {
  id: 'hair-coletas', kinds: ['coletas'], spokenName: 'coletas', volume: 2, Back, Front, hatOffsetY: -12,
};
