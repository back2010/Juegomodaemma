import type { HairPartProps, HairStyle } from '@/types';
import { Bun, CROWN_PART, CrownDetails, line, NapeBack } from './parts';

/** Dos chongos arriba (estilo osito). */
function Back({ palette: p, fill }: HairPartProps) {
  return <NapeBack p={p} fill={fill} bottom={306} />;
}

function Front({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      <Bun cx={194} cy={104} r={48} fill={fill} p={p} />
      <Bun cx={406} cy={104} r={48} fill={fill} p={p} />
      <path d={CROWN_PART} fill={fill} {...line(p)} />
      <CrownDetails p={p} part />
    </g>
  );
}

export const chongosDobles: HairStyle = {
  id: 'hair-chongos-dobles', kinds: ['chongo', 'fiesta'], spokenName: 'dos chongos', volume: 2, Back, Front, hatOffsetY: -30,
};
