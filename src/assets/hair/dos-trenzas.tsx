import type { HairPartProps, HairStyle } from '@/types';
import { Chain, CROWN_PART, CrownDetails, line, mirrorD, mirrorPts, NapeBack, Tie, tuftD } from './parts';

/** Dos trenzas que caen sobre los hombros. */
const BRAID_L: [number, number][] = [[184, 300], [188, 340], [193, 380], [198, 420], [203, 460], [208, 500], [212, 540]];
const TUFT_L = tuftD(213, 560, 11, 42);

function Back({ palette: p, fill }: HairPartProps) {
  return <NapeBack p={p} fill={fill} bottom={322} />;
}

function Front({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      {[false, true].map((m) => (
        <g key={String(m)}>
          <path d={m ? mirrorD(TUFT_L) : TUFT_L} fill={fill} {...line(p, 3)} />
          <Chain pts={m ? mirrorPts(BRAID_L) : BRAID_L} w={42} fill={fill} p={p} />
          <Tie cx={m ? 387 : 213} cy={560} rx={14} ry={8} rot={m ? -6 : 6} p={p} />
        </g>
      ))}
      <path d={CROWN_PART} fill={fill} {...line(p)} />
      <CrownDetails p={p} part />
    </g>
  );
}

export const dosTrenzas: HairStyle = {
  id: 'hair-dos-trenzas', kinds: ['trenzas', 'largo'], spokenName: 'dos trenzas', volume: 1, Back, Front, hatOffsetY: -8,
};
