import type { SVGProps } from 'react';
type P = SVGProps<SVGSVGElement>;
const S = (p: P & { children: React.ReactNode }) => <svg viewBox="0 0 100 100" aria-hidden="true" {...p} />;
const st = { stroke: '#3b2147', strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

export const IconDownload = (p: P) => (
  <S {...p}><path d="M38 12h24v34h16L50 70 22 46h16z" fill="#3a8bff" {...st} /><path d="M16 80h68v10H16z" fill="#ffd23f" {...st} /></S>
);
export const IconClose = (p: P) => (
  <S {...p}><path d="M22 22L78 78M78 22L22 78" {...st} stroke="#fff" strokeWidth={14} /></S>
);
export const IconCopy = (p: P) => (
  <S {...p}><rect x="12" y="12" width="46" height="56" rx="8" fill="#ff8ac6" {...st} /><rect x="38" y="30" width="46" height="56" rx="8" fill="#fff" {...st} />
    <path d="M61 46v24M49 58h24" {...st} stroke="#9b4dff" strokeWidth={8} /></S>
);
export const IconEdit = (p: P) => (
  <S {...p}><path d="M20 80l6-22L66 18l16 16L42 74z" fill="#ffd23f" {...st} /><path d="M58 26l16 16" {...st} /><path d="M20 80l6-22 16 16z" fill="#ff8ac6" {...st} /></S>
);
export const IconEmptyFrames = (p: P) => (
  <svg viewBox="0 0 300 220" aria-hidden="true" {...p}>
    <rect x="30" y="40" width="150" height="120" rx="14" fill="#fff" {...st} transform="rotate(-8 105 100)" />
    <rect x="110" y="30" width="160" height="130" rx="14" fill="#ffe3f3" {...st} transform="rotate(6 190 95)" />
    <path d="M130 140L170 90L195 120L215 100L255 140Z" fill="#3ddc84" {...st} /><circle cx="225" cy="62" r="14" fill="#ffd23f" {...st} />
    <path d="M70 190l6 14 14 2-10 10 3 14-13-8-13 8 3-14-10-10 14-2z" fill="#ff2d95" {...st} transform="translate(60 -40) scale(0.9)" />
  </svg>
);
