import type { HairPartProps, HairStyle } from '@/types';
import { Gloss } from '@/art/kit';
import { line, Shine, Strands } from './parts';

/** Bob corto a la barbilla con fleco recto. */
function Back({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      <path d="M300 80C414 78 466 160 462 262C460 322 474 372 464 404C446 422 406 420 384 408L216 408C194 420 154 422 136 404C126 372 140 322 138 262C134 160 186 78 300 80Z"
        fill={fill} {...line(p)} />
      <Strands p={p} d="M150 300C146 340 150 372 148 398M452 300C456 340 450 372 452 398" />
      <Shine p={p} w={7} o={0.4} d="M146 250C142 290 146 330 144 360M454 250C458 290 454 330 456 360" />
    </g>
  );
}

const FRINGE = 'M392 206L378 201L366 207L352 201L338 207L324 201L310 207L296 201L282 207L268 201L254 207L240 201L226 207L212 201L204 206';

function Front({ palette: p, fill }: HairPartProps) {
  return (
    <g>
      <path d={`M150 300C140 156 206 84 300 84C394 84 460 156 450 300L452 394C436 408 412 408 398 396C406 344 408 288 406 250C404 228 400 214 392 206${FRINGE.replace(/^M392 206/, '')}C200 214 196 228 194 250C192 288 194 344 202 396C188 408 164 408 148 394Z`}
        fill={fill} {...line(p)} />
      <Strands p={p} d="M252 200C246 170 250 140 270 112M322 200C326 168 324 140 314 104M378 200C384 170 380 140 364 116M220 200C214 176 214 150 226 128" />
      <Strands p={p} d="M172 260C166 300 170 350 176 392M428 260C434 300 430 350 424 392" />
      <Shine p={p} d="M200 136Q300 96 400 136" w={10} o={0.5} />
      <Shine p={p} d="M164 280C160 320 162 350 166 380" w={5} o={0.35} />
      <Gloss cx={244} cy={124} rx={24} ry={8} rot={-20} o={0.45} />
    </g>
  );
}

export const bob: HairStyle = {
  id: 'hair-bob', kinds: ['corto', 'lacio'], spokenName: 'melena corta', volume: 1, Back, Front, hatOffsetY: -8,
};
