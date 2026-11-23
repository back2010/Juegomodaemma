import type { HairPartProps, HairStyle } from '@/types';
import { Bun, Chain, CROWN_SLEEK, CrownDetails, line, mirrorPts, NapeBack } from './parts';

/** Chongo alto de bailarina con mechoncitos sueltos. */
const WISP: [number, number][] = [[172, 262], [168, 290], [168, 318], [172, 344]];

function Back({ palette: p, fill }: HairPartProps) {
  return <NapeBack p={p} fill={fill} bottom={300} />;
}

function Front({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      <Bun cx={300} cy={70} r={56} fill={fill} p={p} />
      <path d={CROWN_SLEEK} fill={fill} {...line(p)} />
      <CrownDetails p={p} to={[300, 98]} />
      <Chain pts={WISP} w={18} fill={fill} p={p} mode="ringlet" sw={2.5} />
      <Chain pts={mirrorPts(WISP)} w={18} fill={fill} p={p} mode="ringlet" sw={2.5} />
    </g>
  );
}

export const chongo: HairStyle = {
  id: 'hair-chongo', kinds: ['chongo', 'recogido'], spokenName: 'chongo', volume: 2, Back, Front, hatOffsetY: -44,
};
