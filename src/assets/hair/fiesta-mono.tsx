import type { HairPartProps, HairStyle } from '@/types';
import { Gloss } from '@/art/kit';
import { CROWN_SLEEK, CrownDetails, line, mirrorD, Shine, Strands } from './parts';

/** Moño hecho de cabello sobre la cabeza, con cabello largo atrás. */
const LOOP_L = 'M296 100C262 44 196 22 172 58C152 90 186 124 228 120C254 118 278 110 296 100Z';
const FOLD_L = 'M282 100C254 72 220 58 196 70M270 106C240 98 210 96 190 102';
const SHINE_L = 'M196 52C214 44 238 50 256 64';

function Back({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      <path d="M300 84C412 80 464 168 460 280C458 380 466 500 470 600C450 616 424 612 406 602L194 602C176 612 150 616 130 600C134 500 142 380 140 280C136 168 188 80 300 84Z"
        fill={fill} {...line(p)} />
      <Strands p={p} d="M156 330C152 410 156 500 152 590M180 400C178 470 180 540 178 600M444 330C448 410 444 500 448 590M420 400C422 470 420 540 422 600" />
      <Shine p={p} w={7} o={0.4} d="M148 300C144 380 146 460 142 540M452 300C456 380 454 460 458 540" />
    </g>
  );
}

function Front({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      {[false, true].map((m) => (
        <g key={String(m)}>
          <path d={m ? mirrorD(LOOP_L) : LOOP_L} fill={fill} {...line(p)} />
          <Strands p={p} d={m ? mirrorD(FOLD_L) : FOLD_L} />
          <Shine p={p} d={m ? mirrorD(SHINE_L) : SHINE_L} w={7} o={0.5} />
        </g>
      ))}
      <path d={CROWN_SLEEK} fill={fill} {...line(p)} />
      <CrownDetails p={p} to={[300, 104]} />
      <rect x={278} y={80} width={44} height={38} rx={16} fill={fill} {...line(p)} />
      <path d="M288 90C296 98 304 98 312 90M288 108C296 102 304 102 312 108" stroke={p.shade} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.6} />
      <Gloss cx={292} cy={88} rx={7} ry={3} o={0.55} />
    </g>
  );
}

export const fiestaMono: HairStyle = {
  id: 'hair-fiesta-mono', kinds: ['fiesta', 'recogido', 'largo'], spokenName: 'moño de cabello', volume: 3, Back, Front, hatOffsetY: -50,
};
