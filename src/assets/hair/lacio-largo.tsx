import type { HairPartProps, HairStyle } from '@/types';
import { Gloss } from '@/art/kit';
import { line, Shine, Strands } from './parts';

/** Largo y lacio con raya al centro. */
function Back({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      <path d="M300 82C414 78 468 168 464 280C462 380 470 520 474 646L456 660L438 648L420 662L402 650L384 662L366 652L234 652L216 662L198 650L180 662L162 648L144 660L126 646C130 520 138 380 136 280C132 168 186 78 300 82Z"
        fill={fill} {...line(p)} />
      <Strands p={p} d="M154 330C150 420 152 520 150 630M178 400C176 480 178 560 176 640M446 330C450 420 448 520 450 630M422 400C424 480 422 560 424 640" />
      <Shine p={p} w={7} o={0.4} d="M146 300C142 380 144 460 140 540M454 300C458 380 456 460 460 540" />
    </g>
  );
}

function Front({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      <path d="M154 290C144 154 212 84 300 84C388 84 456 154 446 290L452 476C438 486 420 486 404 478C408 410 410 340 406 284C402 218 382 172 340 150C322 142 308 144 300 156C292 144 278 142 260 150C218 172 198 218 194 284C190 340 192 410 196 478C180 486 162 486 148 476Z"
        fill={fill} {...line(p)} />
      <Strands p={p} d="M300 156C298 130 300 108 302 88M262 152C238 166 214 200 206 260M338 152C362 166 386 200 394 260" />
      <Strands p={p} d="M172 300C168 360 170 420 168 470M428 300C432 360 430 420 432 470M186 330C184 380 186 430 184 476M414 330C416 380 414 430 416 476" o={0.45} />
      <Shine p={p} d="M208 132Q252 104 290 100M310 100Q350 104 392 132" w={10} o={0.5} />
      <Shine p={p} d="M164 290C160 340 162 390 160 430M436 290C440 340 438 390 440 430" w={5} o={0.35} />
      <Gloss cx={244} cy={122} rx={22} ry={8} rot={-24} o={0.45} />
      <Gloss cx={356} cy={122} rx={22} ry={8} rot={24} o={0.35} />
    </g>
  );
}

export const lacioLargo: HairStyle = {
  id: 'hair-lacio-largo', kinds: ['largo', 'lacio'], spokenName: 'cabello largo y lacio', volume: 1, Back, Front, hatOffsetY: -10,
};
