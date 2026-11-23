/** Iconos coloridos y reconocibles (sin texto). */
import type { SVGProps } from 'react';
type P = SVGProps<SVGSVGElement>;
const S = (p: P & { children: React.ReactNode }) => <svg viewBox="0 0 100 100" aria-hidden="true" {...p} />;
const st = { stroke: '#3b2147', strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

export const IconHome = (p: P) => (
  <S {...p}><path d="M14 50L50 18L86 50" fill="none" {...st} /><path d="M24 44V84H76V44L50 22Z" fill="#ffd23f" {...st} />
    <rect x="42" y="58" width="16" height="26" rx="4" fill="#ff6f61" {...st} /><path d="M50 36l3 6 6 1-5 4 1 6-5-3-5 3 1-6-5-4 6-1z" fill="#ff2d95" /></S>
);
export const IconSpeaker = (p: P) => (
  <S {...p}><path d="M16 38H32L52 20V80L32 62H16Z" fill="#3a8bff" {...st} />
    <path d="M64 36Q74 50 64 64M74 26Q92 50 74 74" fill="none" {...st} stroke="#3a8bff" strokeWidth={7} /></S>
);
export const IconLock = (p: P) => (
  <S {...p}><rect x="22" y="44" width="56" height="42" rx="8" fill="#9b4dff" {...st} /><path d="M34 44V32a16 16 0 0 1 32 0V44" fill="none" {...st} /><circle cx="50" cy="64" r="6" fill="#fff" /></S>
);
export const IconCamera = (p: P) => (
  <S {...p}><rect x="12" y="30" width="76" height="52" rx="12" fill="#22d3c5" {...st} /><path d="M34 30l6-10h20l6 10" fill="#22d3c5" {...st} />
    <circle cx="50" cy="56" r="17" fill="#fff" {...st} /><circle cx="50" cy="56" r="8" fill="#3a8bff" /><circle cx="76" cy="40" r="4" fill="#ffd23f" /></S>
);
export const IconGallery = (p: P) => (
  <S {...p}><rect x="12" y="18" width="76" height="64" rx="10" fill="#fff" {...st} /><path d="M16 74L38 50L54 64L66 54L84 72" fill="#3ddc84" {...st} />
    <circle cx="66" cy="34" r="8" fill="#ffd23f" {...st} /></S>
);
export const IconStar = (p: P) => (
  <S {...p}><path d="M50 10l11 24 26 3-19 18 5 26-23-13-23 13 5-26-19-18 26-3z" fill="#ffd23f" {...st} /><circle cx="42" cy="44" r="4" fill="#3b2147" /><circle cx="58" cy="44" r="4" fill="#3b2147" />
    <path d="M42 56q8 7 16 0" fill="none" {...st} strokeWidth={4} /></S>
);
export const IconLipstick = (p: P) => (
  <S {...p}><path d="M38 14L62 26V50H38Z" fill="#ff2d95" {...st} /><rect x="32" y="50" width="36" height="12" rx="3" fill="#ffd23f" {...st} />
    <rect x="30" y="62" width="40" height="26" rx="5" fill="#9b4dff" {...st} /></S>
);
export const IconComb = (p: P) => (
  <S {...p}><path d="M16 40h68v14H16z" fill="#ff8ac6" {...st} />{[22, 32, 42, 52, 62, 72, 80].map((x) => <path key={x} d={`M${x} 54v22`} {...st} />)}
    <path d="M30 22q20-12 40 0" fill="none" {...st} stroke="#9b4dff" strokeWidth={7} /></S>
);
export const IconDress = (p: P) => (
  <S {...p}><path d="M38 12h24l-2 14 8 12-6 6 18 44H20l18-44-6-6 8-12z" fill="#ff6f61" {...st} /><path d="M36 44h28" {...st} stroke="#ffd23f" strokeWidth={6} /></S>
);
export const IconCrown = (p: P) => (
  <S {...p}><path d="M14 72L18 30L36 50L50 22L64 50L82 30L86 72Z" fill="#ffd23f" {...st} /><rect x="14" y="72" width="72" height="12" rx="4" fill="#ff2d95" {...st} />
    <circle cx="50" cy="60" r="6" fill="#22d3c5" {...st} strokeWidth={3} /></S>
);
export const IconStickers = (p: P) => (
  <S {...p}><path d="M34 14l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="#ffd23f" {...st} />
    <path d="M66 86C50 76 46 64 52 58c5-5 11-3 14 2 3-5 9-7 14-2 6 6 2 18-14 28Z" fill="#ff2d95" {...st} /></S>
);
export const IconNone = (p: P) => (
  <S {...p}><circle cx="50" cy="50" r="32" fill="#fff" {...st} stroke="#c9b6d6" strokeWidth={8} /><path d="M28 72L72 28" {...st} stroke="#c9b6d6" strokeWidth={8} /></S>
);
export const IconTrash = (p: P) => (
  <S {...p}><path d="M24 30h52l-6 56H30z" fill="#ff6f61" {...st} /><path d="M18 30h64M40 30v-10h20v10" fill="none" {...st} /></S>
);
export const IconReset = (p: P) => (
  <S {...p}><path d="M74 50a24 24 0 1 1-8-18" fill="none" {...st} stroke="#3a8bff" strokeWidth={9} /><path d="M58 16l14 16-20 4z" fill="#3a8bff" {...st} /></S>
);
export const IconPlay = (p: P) => (
  <S {...p}><path d="M34 20L80 50L34 80Z" fill="#fff" {...st} stroke="#fff" /></S>
);
export const IconCheck = (p: P) => (
  <S {...p}><path d="M20 52L42 72L82 28" fill="none" {...st} strokeWidth={12} stroke="#fff" /></S>
);
export const IconDoll = (p: P) => (
  <S {...p}><circle cx="50" cy="34" r="20" fill="#f6c9a4" {...st} /><path d="M30 34q0-24 20-24t20 24q-6-10-20-12-14 2-20 12z" fill="#8a5a33" {...st} />
    <path d="M34 90l6-36h20l6 36z" fill="#ff8ac6" {...st} /></S>
);
export const IconRotate = (p: P) => (
  <S {...p}><rect x="20" y="30" width="60" height="40" rx="8" fill="#fff" {...st} /><path d="M50 14a36 36 0 0 1 34 24" fill="none" {...st} stroke="#ff2d95" /><path d="M86 28l-2 12-11-4" fill="none" {...st} stroke="#ff2d95" /></S>
);
export const IconSmall = (p: P) => (<S {...p}><circle cx="50" cy="50" r="12" fill="#ff8ac6" {...st} /></S>);
export const IconMedium = (p: P) => (<S {...p}><circle cx="50" cy="50" r="22" fill="#ff8ac6" {...st} /></S>);
export const IconBig = (p: P) => (<S {...p}><circle cx="50" cy="50" r="34" fill="#ff8ac6" {...st} /></S>);
