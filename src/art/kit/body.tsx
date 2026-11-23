/**
 * Cuerpo compartido por TODAS las muñecas (viewBox 0 0 600 1000) y fábrica de muñecas.
 * La ropa se dibuja en coordenadas absolutas sobre este cuerpo.
 */
import type { AnchorName, DollBase, PartProps, Pt } from '@/types';
import { makePalette, shift } from './palette';
import { Gloss, SoftBlur } from './gradients';

export const VIEWBOX = { w: 600, h: 1000 } as const;

export const BASE_ANCHORS: Record<AnchorName, Pt> = {
  headTop: { x: 300, y: 112 }, headCenter: { x: 300, y: 252 },
  eyeL: { x: 248, y: 272 }, eyeR: { x: 352, y: 272 },
  browL: { x: 244, y: 218 }, browR: { x: 356, y: 218 },
  cheekL: { x: 222, y: 318 }, cheekR: { x: 378, y: 318 },
  nose: { x: 300, y: 312 }, mouth: { x: 300, y: 350 },
  earL: { x: 172, y: 288 }, earR: { x: 428, y: 288 },
  neck: { x: 300, y: 420 }, waist: { x: 300, y: 590 },
  wristL: { x: 192, y: 640 }, wristR: { x: 408, y: 640 },
  handL: { x: 192, y: 668 }, handR: { x: 408, y: 668 },
  ankleL: { x: 270, y: 928 }, ankleR: { x: 330, y: 928 },
};

/** Silueta del torso + piernas (simétrica). */
export const TORSO_PATH =
  'M282 392L282 432C260 440 228 440 212 452C205 470 225 520 240 560C246 585 244 600 238 625'
  + 'C230 660 232 700 240 740C250 800 258 860 262 925C262 945 248 960 246 975C252 985 285 985 288 972'
  + 'C290 955 284 940 286 925C292 860 296 790 298 720L300 690L302 720C304 790 308 860 314 925'
  + 'C316 940 310 955 312 972C315 985 348 985 354 975C352 960 338 945 338 925C342 860 350 800 360 740'
  + 'C368 700 370 660 362 625C356 600 354 585 360 560C375 520 395 470 388 452C372 440 340 440 318 432L318 392Z';
export const ARM_L_PATH = 'M224 448C200 452 192 480 190 510C186 560 183 600 183 642L201 644C204 600 209 560 214 522C216 502 220 490 228 478Z';
export const ARM_R_PATH = 'M376 448C400 452 408 480 410 510C414 560 417 600 417 642L399 644C396 600 391 560 386 522C384 502 380 490 372 478Z';

/** Degradado cilíndrico de piel (volumen). */
function SkinCyl({ id, p }: { id: string; p: PartProps['palette'] }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={p.shade} />
      <stop offset="0.28" stopColor={p.main} />
      <stop offset="0.5" stopColor={shift(p.main, 0.06)} />
      <stop offset="0.72" stopColor={p.main} />
      <stop offset="1" stopColor={p.shade} />
    </linearGradient>
  );
}

/** Cuerpo base con ropa interior (camiseta y short) para que nunca aparezca sin ropa. */
export function SharedBody({ palette: p, idp }: PartProps) {
  const line = shift(p.shade, -0.06);
  const under = makePalette('#fff1f8');
  return (
    <g data-part="body">
      <defs>
        <SkinCyl id={idp('skin')} p={p} />
        <SkinCyl id={idp('arm')} p={p} />
        <linearGradient id={idp('under')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor={under.shade} />
        </linearGradient>
      </defs>
      <path d={TORSO_PATH} fill={`url(#${idp('skin')})`} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      {/* sombra de la barbilla sobre el cuello */}
      <ellipse cx={300} cy={400} rx={22} ry={10} fill={p.shade} opacity={0.45} />
      {/* rodillas */}
      <path d="M256 820q8 6 16 0M328 820q8 6 16 0" stroke={p.shade} strokeWidth={2.5} fill="none" opacity={0.6} strokeLinecap="round" />
      {/* ropa interior */}
      <path d="M232 478C246 462 272 458 300 460C328 458 354 462 368 478C362 520 356 560 360 600L240 600C244 560 238 520 232 478Z"
        fill={`url(#${idp('under')})`} stroke="#f2b8d6" strokeWidth={2.5} />
      <path d="M252 470L262 438M348 470L338 438" stroke="#f7c6de" strokeWidth={5} strokeLinecap="round" />
      <path d="M240 600L360 600C366 628 368 656 366 690L306 694L300 680L294 694L234 690C232 656 234 628 240 600Z"
        fill="#ffc9e3" stroke="#f29cc6" strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M300 500l5 6-5 6-5-6z" fill="#ff8ac6" />
      {/* brazos */}
      <path d={ARM_L_PATH} fill={`url(#${idp('arm')})`} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <path d={ARM_R_PATH} fill={`url(#${idp('arm')})`} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <Gloss cx={226} cy={470} rx={10} ry={5} o={0.35} />
      <Gloss cx={374} cy={470} rx={10} ry={5} o={0.35} rot={20} />
    </g>
  );
}

export function SharedHands({ palette: p }: PartProps) {
  const line = shift(p.shade, -0.06);
  const hand = (s: 1 | -1) => (
    <g transform={s === 1 ? 'translate(192 668)' : 'translate(408 668) scale(-1 1)'}>
      <path d="M-10 -26C-17 -18 -18 2 -14 14C-10 26 6 28 11 18C15 8 14 -12 10 -26Z" fill={p.main} stroke={line} strokeWidth={2.5} />
      <path d="M10 -14C18 -10 20 0 14 4" fill={p.main} stroke={line} strokeWidth={2.2} strokeLinecap="round" />
      <path d="M-6 4l0 12M0 6l0 13M6 4l0 11" stroke={p.shade} strokeWidth={1.6} strokeLinecap="round" opacity={0.6} />
      <ellipse cx={-4} cy={-14} rx={4} ry={7} fill={p.light} opacity={0.7} />
    </g>
  );
  return <g data-part="hands">{hand(1)}{hand(-1)}</g>;
}

export type FaceShape = DollBase['faceShape'];
export function facePath(shape: FaceShape): string {
  switch (shape) {
    case 'round':
      return 'M300 112C384 112 432 170 432 252C432 330 386 392 300 396C214 392 168 330 168 252C168 170 216 112 300 112Z';
    case 'heart':
      return 'M300 112C386 112 434 166 432 244C430 306 392 360 336 388C320 396 310 400 300 400C290 400 280 396 264 388C208 360 170 306 168 244C166 166 214 112 300 112Z';
    default:
      return 'M300 112C382 112 428 170 428 250C428 322 384 388 300 398C216 388 172 322 172 250C172 170 218 112 300 112Z';
  }
}

export function makeHead(shape: FaceShape) {
  return function Head({ doll, palette: p, idp }: PartProps) {
    const line = shift(p.shade, -0.06);
    const { earL, earR } = doll.anchors;
    return (
      <g data-part="head">
        <defs>
          <radialGradient id={idp('face')} cx="0.45" cy="0.38" r="0.7">
            <stop offset="0" stopColor={p.light} /><stop offset="0.6" stopColor={p.main} /><stop offset="1" stopColor={p.shade} />
          </radialGradient>
          <SoftBlur id={idp('cheek')} s={9} />
        </defs>
        {[earL, earR].map((e, i) => (
          <g key={i}>
            <ellipse cx={e.x} cy={e.y} rx={17} ry={25} fill={p.main} stroke={line} strokeWidth={3} />
            <path d={`M${e.x + (i ? -4 : 4)} ${e.y - 12}q${i ? 8 : -8} 12 0 22`} stroke={p.shade} strokeWidth={2.5} fill="none" />
          </g>
        ))}
        <path d={facePath(shape)} fill={`url(#${idp('face')})`} stroke={line} strokeWidth={3.2} strokeLinejoin="round" />
        {/* rubor natural */}
        <g filter={`url(#${idp('cheek')})`} opacity={0.35}>
          <ellipse cx={doll.anchors.cheekL.x} cy={doll.anchors.cheekL.y} rx={26} ry={15} fill={doll.skin.blush} />
          <ellipse cx={doll.anchors.cheekR.x} cy={doll.anchors.cheekR.y} rx={26} ry={15} fill={doll.skin.blush} />
        </g>
        <Gloss cx={262} cy={168} rx={34} ry={14} rot={-18} o={0.28} />
      </g>
    );
  };
}

export type EyeShape = DollBase['eyes']['shape'];
export function eyePath(shape: EyeShape): string {
  switch (shape) {
    case 'round': return 'M-34 2C-34 -26 -14 -40 2 -40C22 -40 36 -24 36 2C36 26 20 38 0 38C-20 38 -34 26 -34 2Z';
    case 'upturned': return 'M-40 -8C-26 -38 26 -38 38 0C28 30 -24 32 -40 -8Z';
    default: return 'M-40 4C-28 -32 28 -36 40 -4C28 30 -28 32 -40 4Z';
  }
}
/** Línea del párpado superior (base) por forma. */
function lidPath(shape: EyeShape): string {
  switch (shape) {
    case 'round': return 'M-36 -2C-32 -30 -12 -42 2 -42C24 -42 38 -26 38 -2';
    case 'upturned': return 'M-44 -12C-28 -40 26 -40 40 -2';
    default: return 'M-43 2C-28 -34 28 -38 42 -6';
  }
}

export function makeFace(shape: EyeShape) {
  return function Face({ doll, idp }: PartProps) {
    const ir = doll.eyes.iris;
    const sk = doll.skin;
    const { eyeL, eyeR, nose, mouth } = doll.anchors;
    const eye = (a: Pt, mirror: boolean) => (
      <g transform={`translate(${a.x} ${a.y})${mirror ? ' scale(-1 1)' : ''}`}>
        <path d={eyePath(shape)} fill="#fff" stroke="#3a2533" strokeWidth={2} />
        <g clipPath={`url(#${idp('eyeclip')})`}>
          <circle cx={3} cy={2} r={27} fill={`url(#${idp('iris')})`} stroke={ir.shade} strokeWidth={3} />
          <circle cx={3} cy={4} r={13} fill="#1d1420" />
          <path d="M-16 18a22 22 0 0 0 36 0" stroke={ir.light} strokeWidth={4} fill="none" opacity={0.7} />
          <circle cx={-7} cy={-8} r={8} fill="#fff" />
          <circle cx={12} cy={12} r={3.5} fill="#fff" opacity={0.9} />
          <path d={eyePath(shape)} fill="none" stroke="#c9b3c9" strokeWidth={8} opacity={0.35} transform="translate(0 -6)" />
        </g>
        <path d={lidPath(shape)} stroke="#2a1a26" strokeWidth={5.5} fill="none" strokeLinecap="round" />
        <path d="M-40 0l-10 -8" stroke="#2a1a26" strokeWidth={4} strokeLinecap="round" />
      </g>
    );
    return (
      <g data-part="face">
        <defs>
          <radialGradient id={idp('iris')} cx="0.5" cy="0.35" r="0.65">
            <stop offset="0" stopColor={ir.light} /><stop offset="0.55" stopColor={ir.main} /><stop offset="1" stopColor={ir.shade} />
          </radialGradient>
          <clipPath id={idp('eyeclip')} clipPathUnits="userSpaceOnUse"><path d={eyePath(shape)} /></clipPath>
          <linearGradient id={idp('lip')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={shift(sk.lip, 0.08)} /><stop offset="1" stopColor={shift(sk.lip, -0.12)} />
          </linearGradient>
        </defs>
        {eye(eyeL, false)}
        {eye(eyeR, true)}
        <path d={`M${nose.x - 7} ${nose.y + 2}Q${nose.x} ${nose.y + 9} ${nose.x + 7} ${nose.y + 2}`} stroke={sk.shade} strokeWidth={3} fill="none" strokeLinecap="round" />
        <g transform={`translate(${mouth.x} ${mouth.y})`}>
          <path d="M-24 0Q-12 -11 0 -4Q12 -11 24 0Q0 5 -24 0Z" fill={`url(#${idp('lip')})`} stroke={shift(sk.lip, -0.2)} strokeWidth={1.8} />
          <path d="M-24 0Q0 5 24 0Q14 19 0 20Q-14 19 -24 0Z" fill={`url(#${idp('lip')})`} stroke={shift(sk.lip, -0.2)} strokeWidth={1.8} />
          <ellipse cx={-6} cy={9} rx={7} ry={3} fill="#fff" opacity={0.45} />
        </g>
      </g>
    );
  };
}

export interface DollSpec {
  id: string;
  spokenName: string;
  skin: string;
  blush?: string;
  lip?: string;
  iris: string;
  eyeShape: EyeShape;
  faceShape: FaceShape;
  /** Ajuste fino de anclajes de cara (±10px). */
  anchorOffsets?: Partial<Record<AnchorName, Pt>>;
  defaultLook: DollBase['defaultLook'];
  /** Permite reemplazar el rostro por uno propio (p.ej. con pecas naturales). */
  Face?: DollBase['Face'];
  Head?: DollBase['Head'];
}

/** Fábrica estándar de muñecas sobre el cuerpo compartido. */
export function makeDoll(s: DollSpec): DollBase {
  const anchors = { ...BASE_ANCHORS };
  for (const [k, v] of Object.entries(s.anchorOffsets ?? {})) {
    const a = anchors[k as AnchorName];
    anchors[k as AnchorName] = { x: a.x + v.x, y: a.y + v.y };
  }
  const sk = makePalette(s.skin);
  return {
    id: s.id,
    spokenName: s.spokenName,
    skin: { ...sk, blush: s.blush ?? '#ff7a9a', lip: s.lip ?? '#e0557a' },
    eyes: { iris: makePalette(s.iris), shape: s.eyeShape },
    faceShape: s.faceShape,
    anchors,
    Body: SharedBody,
    Hands: SharedHands,
    Head: s.Head ?? makeHead(s.faceShape),
    Face: s.Face ?? makeFace(s.eyeShape),
    defaultLook: s.defaultLook,
  };
}
