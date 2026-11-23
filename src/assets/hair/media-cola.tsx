import type { HairPartProps, HairStyle } from '@/types';
import { Bun, CROWN_SLEEK, CrownDetails, line, Shine, Strands, Tie } from './parts';

/** Media cola: cabello suelto largo con un moñito arriba. */
function Back({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      <path d="M300 82C414 78 466 168 462 280C460 370 478 450 470 530C466 580 476 610 462 632C446 650 420 640 404 626C390 644 366 646 350 632L250 632C234 646 210 644 196 626C180 640 154 650 138 632C124 610 134 580 130 530C122 450 140 370 138 280C134 168 186 78 300 82Z"
        fill={fill} {...line(p)} />
      <Strands p={p} d="M152 320C146 400 160 470 150 560C148 590 152 612 160 626M178 380C172 450 184 520 178 600M448 320C454 400 440 470 450 560C452 590 448 612 440 626M422 380C428 450 416 520 422 600" />
      <Shine p={p} w={7} o={0.4} d="M144 290C138 360 150 420 142 490M456 290C462 360 450 420 458 490" />
    </g>
  );
}

function Front({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      <Bun cx={300} cy={84} r={32} fill={fill} p={p} />
      <path d={CROWN_SLEEK} fill={fill} {...line(p)} />
      <path d="M178 226C160 262 176 296 164 332C154 362 162 392 178 412C176 388 184 368 190 344C198 312 186 284 196 256C200 244 204 234 208 226Z" fill={fill} {...line(p, 3)} />
      <path d="M422 226C440 262 424 296 436 332C446 362 438 392 422 412C424 388 416 368 410 344C402 312 414 284 404 256C400 244 396 234 392 226Z" fill={fill} {...line(p, 3)} />
      <CrownDetails p={p} to={[300, 108]} />
      <Tie cx={300} cy={112} rx={20} ry={8} p={p} />
    </g>
  );
}

export const mediaCola: HairStyle = {
  id: 'hair-media-cola', kinds: ['largo', 'recogido', 'ondulado'], spokenName: 'media cola', volume: 2, Back, Front, hatOffsetY: -22,
};
