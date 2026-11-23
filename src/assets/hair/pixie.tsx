import type { HairPartProps, HairStyle } from '@/types';
import { Gloss } from '@/art/kit';
import { line, Shine, Strands } from './parts';

/** Pixie: muy corto, en capas, con fleco de lado. */
function Back({ palette: p, fill }: HairPartProps) {
  return (
    <path d="M300 90C402 88 452 158 448 248C446 278 436 300 420 306L180 306C164 300 154 278 152 248C148 158 198 88 300 90Z"
      fill={fill} {...line(p)} />
  );
}

function Front({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      <path d="M166 292C150 250 150 196 168 162C160 150 162 136 174 130C192 104 232 84 278 82C290 72 306 72 314 82C356 84 396 100 420 128C434 130 442 142 436 158C450 190 452 240 436 292C428 270 426 250 420 232C414 214 404 200 392 192C368 196 342 190 322 176C304 196 270 204 240 204C222 206 208 212 200 224C188 240 178 262 176 286L172 270Z"
        fill={fill} {...line(p)} />
      <path d="M392 192C386 180 372 172 356 168M322 176C318 160 306 146 290 140" stroke={p.shade} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.6} />
      <Strands p={p} d="M240 204C262 180 290 160 330 146M272 198C300 170 330 156 372 152M210 216C226 186 250 166 284 150" />
      <Strands p={p} d="M424 228C428 196 420 170 404 148M180 250C178 210 186 182 204 160" o={0.45} />
      <Shine p={p} d="M206 140Q290 104 384 124" w={10} o={0.5} />
      <Gloss cx={252} cy={122} rx={22} ry={8} rot={-22} o={0.45} />
    </g>
  );
}

export const pixie: HairStyle = {
  id: 'hair-pixie', kinds: ['corto'], spokenName: 'corte pixie', volume: 1, Back, Front, hatOffsetY: -4,
};
