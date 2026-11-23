/** Chamarras y suéteres (capa 'outer'): dos mitades con el frente abierto. */
import type { CatalogItem, SvgPart } from '@/types';
import { Gloss, outline, shapePath, variant, variantsOf } from '@/art/kit';
import { CylGrad, Pair, contrast } from './parts';

const HalfL = 'M292 472 L282 434 C258 440 226 440 210 452 C196 470 186 520 184 560 L182 634 L206 638 C208 600 214 560 222 530 C228 570 232 604 232 640 L293 644 Z';

/** Sudadera con capucha y cierre. */
const Sudadera: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  const c = contrast(p);
  return (
    <g>
      <defs><CylGrad id={idp('g')} p={p} x1={185} x2={300} /><linearGradient id={idp('h')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={p.shade} /><stop offset="1" stopColor={p.main} /></linearGradient></defs>
      {/* capucha detrás del cuello */}
      <path d="M258 424C262 448 282 470 300 474C318 470 338 448 342 424C362 440 366 466 346 482C330 494 270 494 254 482C234 466 238 440 258 424Z"
        fill={`url(#${idp('h')})`} stroke={o} strokeWidth={3.5} strokeLinejoin="round" />
      <Pair>
        <path d={HalfL} fill={`url(#${idp('g')})`} stroke={o} strokeWidth={3.5} strokeLinejoin="round" />
        {/* puños y elástico */}
        <path d="M182 616L206 620L206 638L182 634ZM232 622L293 626L293 644L232 640Z" fill={p.shade} stroke={o} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M188 622L188 636M194 623L194 637M200 624L200 638M240 626L240 642M250 627L250 643M260 627L260 643M270 628L270 644M280 628L280 644" stroke={p.light} strokeWidth={1.8} opacity={0.5} />
        {/* bolsillo canguro con estrella */}
        <path d="M240 560L292 556L292 622L246 620Z" fill={p.main} stroke={o} strokeWidth={2.5} strokeLinejoin="round" opacity={0.9} />
        <path d={shapePath('estrella', 266, 590, 12)} fill={c} stroke={o} strokeWidth={1.5} strokeLinejoin="round" />
        <path d="M284 478L276 520" stroke={c} strokeWidth={4} strokeLinecap="round" />
        <circle cx={276} cy={522} r={4} fill={c} stroke={o} strokeWidth={1.5} />
        <Gloss cx={232} cy={486} rx={8} ry={24} o={0.3} />
        <Gloss cx={196} cy={540} rx={4} ry={22} o={0.3} rot={-4} />
      </Pair>
      <path d="M300 474L300 644" stroke={p.shade} strokeWidth={4} />
      <path d="M296 480L296 640M304 480L304 640" stroke={c} strokeWidth={1.5} strokeDasharray="3 3" opacity={0.7} />
      <path d="M268 470Q300 490 332 470" stroke={p.light} strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  );
};

const CardiganL = 'M298 492 L282 434 C258 440 226 440 210 452 C196 470 186 520 184 560 L182 630 L206 634 C208 600 214 560 222 530 C228 570 232 604 234 636 L298 640 Z';

/** Suéter abierto con botones y bolsillos. */
const Cardigan: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  return (
    <g>
      <defs><CylGrad id={idp('g')} p={p} x1={185} x2={300} /></defs>
      <Pair>
        <path d={CardiganL} fill={`url(#${idp('g')})`} stroke={o} strokeWidth={3.5} strokeLinejoin="round" />
        <path d="M282 434L298 492L298 640" stroke={p.light} strokeWidth={9} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M182 622L206 626M234 624L298 628" stroke={p.light} strokeWidth={9} strokeLinecap="round" />
        <path d="M200 520C204 560 202 600 204 626" stroke={p.shade} strokeWidth={2.5} fill="none" opacity={0.3} />
        <path d="M244 580L282 578L282 620L248 618Z" fill="none" stroke={p.light} strokeWidth={3} strokeLinejoin="round" />
        <Gloss cx={232} cy={484} rx={8} ry={24} o={0.3} />
      </Pair>
      {[516, 550, 584].map((y) => (
        <g key={y}>
          <circle cx={292} cy={y} r={6} fill={p.light} stroke={o} strokeWidth={2} />
          <circle cx={290} cy={y - 1.5} r={1.4} fill={p.shade} /><circle cx={294} cy={y - 1.5} r={1.4} fill={p.shade} />
        </g>
      ))}
    </g>
  );
};

export const outerClothes: CatalogItem[] = [
  { id: 'outer-sudadera', slot: 'outer', kind: 'chamarra', spokenName: 'chamarra con capucha', theme: 'deporte', shapeTag: 'estrella',
    variants: variantsOf('rosa', 'morado', 'azul', 'verde', 'naranja', 'rojo', 'amarillo', 'cafe'), parts: { outer: Sudadera } },
  { id: 'outer-cardigan', slot: 'outer', kind: 'suéter', spokenName: 'suéter con botones', theme: 'casual',
    variants: [...variantsOf('blanco', 'rosa', 'amarillo', 'morado', 'cafe'), variant('turquesa', '#22d3c5', 'azul', 'verde')], parts: { outer: Cardigan } },
];
