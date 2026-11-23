import type { HairPartProps, HairStyle } from '@/types';
import { Gloss, outline } from '@/art/kit';

/** Peinado de referencia (P0): largo y ondulado. Back = detrás del cuerpo; Front = fleco y mechones. */
function Back({ palette: p, fill }: HairPartProps) {
  const o = outline(p);
  return (
    <g>
      <path
        d="M300 84C412 80 474 168 468 280C464 352 494 418 474 488C458 548 490 600 456 644C424 670 392 636 380 604L220 604C208 636 176 670 144 644C110 600 142 548 126 488C106 418 136 352 132 280C126 168 188 80 300 84Z"
        fill={fill} stroke={o} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M150 330C138 400 160 450 146 520M170 400C162 470 182 530 164 600M450 330C462 400 440 450 454 520M430 400C438 470 418 530 436 600"
        stroke={p.shade} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.55} />
      <path d="M140 300C130 360 150 420 136 470M460 300C470 360 450 420 464 470" stroke={p.light} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.45} />
    </g>
  );
}

function Front({ palette: p, fill }: HairPartProps) {
  const o = outline(p);
  return (
    <g>
      <path
        d="M166 262C156 150 218 90 300 90C382 90 444 150 434 262C424 222 414 192 394 172C364 198 322 202 292 182C270 206 230 212 204 196C186 214 174 236 166 262Z"
        fill={fill} stroke={o} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M170 250C150 320 172 380 150 452C178 440 194 400 192 352C190 312 194 282 202 262Z" fill={fill} stroke={o} strokeWidth={3} strokeLinejoin="round" />
      <path d="M430 250C450 320 428 380 450 452C422 440 406 400 408 352C410 312 406 282 398 262Z" fill={fill} stroke={o} strokeWidth={3} strokeLinejoin="round" />
      <path d="M292 182C300 150 318 128 340 116M204 196C214 168 236 146 262 132" stroke={p.shade} strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.6} />
      <path d="M214 134Q300 98 386 134" stroke={p.light} strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.5} />
      <Gloss cx={250} cy={128} rx={22} ry={8} rot={-22} o={0.4} />
    </g>
  );
}

export const ondasLargas: HairStyle = {
  id: 'hair-ondas-largas', kinds: ['largo', 'ondulado'], spokenName: 'ondas largas', volume: 2,
  Back, Front, hatOffsetY: -14,
};
