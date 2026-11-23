/** Pantalones, leggings, shorts y faldas. */
import type { CatalogItem, SvgPart } from '@/types';
import { Gloss, outline, shapePath, variant, variantsOf } from '@/art/kit';
import { CylGrad, Motifs, Pair, Sym, VGrad, contrast, mirror } from './parts';
import { leggingsL, pantsL, shortsL } from './geom';

const Jeans: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  const d = pantsL(908, 6);
  const stitch = p.light;
  return (
    <g>
      <defs><CylGrad id={idp('g')} p={p} x1={225} x2={375} /></defs>
      <Sym d={d} fill={`url(#${idp('g')})`} o={o} sw={3.5} clip={idp('c')}>
        <path d="M300 612L300 706" stroke={p.shade} strokeWidth={2.5} />
        <path d="M248 880L296 884M251 900L294 904" stroke={p.shade} strokeWidth={2} opacity={0.4} />
      </Sym>
      {/* cinturilla y pretina */}
      <Sym d="M300 592 L241 592 L239 618 L300 618 Z" fill={p.shade} o={o} sw={3} />
      <path d="M244 600L296 600M244 610L296 610" stroke={stitch} strokeWidth={2} strokeDasharray="5 4" opacity={0.8} />
      <Pair>
        {/* bolsillo, costuras y dobladillo */}
        <path d="M244 624C256 640 270 648 288 650" stroke={stitch} strokeWidth={3} strokeDasharray="6 5" fill="none" />
        <path d="M248 640L248 700" stroke={stitch} strokeWidth={2.5} strokeDasharray="6 5" opacity={0.8} />
        <path d="M252 900L296 906" stroke={p.light} strokeWidth={6} strokeLinecap="round" opacity={0.9} />
        <path d="M256 760C258 790 262 820 266 850M286 740C284 780 288 820 290 850" stroke={p.shade} strokeWidth={3} fill="none" opacity={0.3} />
        <Gloss cx={254} cy={700} rx={7} ry={44} rot={8} o={0.22} />
      </Pair>
      <circle cx={300} cy={605} r={6} fill="#ffd23f" stroke={o} strokeWidth={2} />
    </g>
  );
};

const Leggings: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  const c = contrast(p);
  return (
    <g>
      <defs><CylGrad id={idp('g')} p={p} x1={230} x2={370} /></defs>
      <Sym d={leggingsL(922)} fill={`url(#${idp('g')})`} o={o} sw={3} clip={idp('c')}>
        <Motifs shape="estrella" p={p} x0={246} x1={354} y0={650} y1={910} step={34} r={6} o={0.75} color={c} />
      </Sym>
      <Sym d="M300 592 L241 592 L239 618 L300 618 Z" fill={p.shade} o={o} sw={3} />
      <path d="M262 598L262 612M300 598L300 612M338 598L338 612" stroke={p.light} strokeWidth={2} opacity={0.6} />
      <Pair>
        <path d="M260 906Q274 912 288 906" stroke={p.light} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} />
        <Gloss cx={247} cy={720} rx={5} ry={50} rot={6} o={0.3} />
      </Pair>
    </g>
  );
};

const Shorts: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  return (
    <g>
      <defs><CylGrad id={idp('g')} p={p} x1={225} x2={375} /></defs>
      <Sym d={shortsL(758)} fill={`url(#${idp('g')})`} o={o} sw={3.5} clip={idp('c')}>
        <path d="M300 612L300 706" stroke={p.shade} strokeWidth={2.5} />
      </Sym>
      <Sym d="M300 592 L241 592 L239 618 L300 618 Z" fill={p.shade} o={o} sw={3} />
      <path d="M244 600L296 600" stroke={p.light} strokeWidth={2} strokeDasharray="5 4" />
      <Pair>
        <path d="M236 740Q268 756 298 750" stroke={p.light} strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d="M246 630C260 646 274 652 288 652" stroke={p.light} strokeWidth={3} strokeDasharray="6 5" fill="none" />
        <path d={shapePath('estrella', 262, 690, 11)} fill={contrast(p)} stroke={o} strokeWidth={1.5} strokeLinejoin="round" />
        <Gloss cx={246} cy={670} rx={6} ry={28} rot={8} o={0.25} />
      </Pair>
      <path d="M296 608L296 640M304 608L304 640" stroke={p.light} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

/** Tutú de capas de tul. */
const Tutu: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  const layer = (hem: number, w: number, k: number, op: number, grad: string) => {
    const d = `M300 598 L242 598 C214 620 ${190 - w} ${hem - 60} ${160 - w} ${hem - 24} Q${178 - w} ${hem + 2} ${196 - w * 0.9} ${hem - 8} Q${220 - w * 0.6} ${hem + 14} ${246 - w * 0.4} ${hem - 4} Q${274} ${hem + 14} 300 ${hem + 2} Z`;
    return (
      <g opacity={op}>
        <Sym d={d} fill={grad} o={o} sw={k} />
        <path d={`M268 606C250 660 224 710 ${200 - w} ${hem - 10}M300 610L300 ${hem - 4}`} stroke={p.shade} strokeWidth={2.5} opacity={0.4} fill="none" />
        <path d={mirror(`M268 606C250 660 224 710 ${200 - w} ${hem - 10}`)} stroke={p.shade} strokeWidth={2.5} opacity={0.4} fill="none" />
      </g>
    );
  };
  return (
    <g>
      <defs>
        <VGrad id={idp('a')} p={p} y1={598} y2={800} />
        <linearGradient id={idp('b')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.main} /><stop offset="1" stopColor={p.light} />
        </linearGradient>
      </defs>
      {layer(790, 30, 3, 1, `url(#${idp('a')})`)}
      {layer(764, 6, 3, 0.9, `url(#${idp('b')})`)}
      {layer(738, -18, 3, 0.95, `url(#${idp('a')})`)}
      <Sym d="M300 590 L240 590 L238 614 L300 614 Z" fill={p.shade} o={o} sw={3} />
      <path d="M300 602L276 590L278 616ZM300 602L324 590L322 616Z" fill={p.light} stroke={o} strokeWidth={2.5} strokeLinejoin="round" />
      <circle cx={300} cy={602} r={5} fill={p.main} stroke={o} strokeWidth={2} />
      <Gloss cx={236} cy={700} rx={8} ry={30} rot={20} o={0.3} />
    </g>
  );
};

/** Falda con corazones. */
const FaldaCorazones: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  const d = 'M300 598 L242 598 C226 640 206 700 194 758 Q246 780 300 774 Z';
  return (
    <g>
      <defs><CylGrad id={idp('g')} p={p} x1={190} x2={410} /></defs>
      <Sym d={d} fill={`url(#${idp('g')})`} o={o} sw={3.5} clip={idp('c')}>
        <Motifs shape="corazon" p={p} x0={214} x1={390} y0={630} y1={770} step={38} r={8} />
        <path d="M262 606L240 766M284 608L276 774" stroke={p.shade} strokeWidth={2.5} opacity={0.35} />
        <path d="M338 606L360 766M316 608L324 774" stroke={p.shade} strokeWidth={2.5} opacity={0.35} />
      </Sym>
      <path d="M194 758Q246 780 300 774Q354 780 406 758" stroke={p.light} strokeWidth={6} fill="none" strokeLinecap="round" />
      <Sym d="M300 592 L241 592 L239 616 L300 616 Z" fill={p.shade} o={o} sw={3} />
      <Gloss cx={246} cy={670} rx={8} ry={36} rot={14} o={0.28} />
    </g>
  );
};

export const bottomClothes: CatalogItem[] = [
  { id: 'pants-mezclilla', slot: 'bottom', kind: 'pantalón', spokenName: 'pantalón de mezclilla', theme: 'casual',
    variants: [variant('mezclilla', '#4a7bd0', 'azul'), ...variantsOf('negro', 'rosa', 'cafe', 'blanco')], parts: { bottom: Jeans } },
  { id: 'pants-leggings', slot: 'bottom', kind: 'leggings', spokenName: 'leggings de estrellas', theme: 'casual', shapeTag: 'estrella',
    variants: variantsOf('negro', 'morado', 'rosa', 'azul', 'rojo', 'verde'), parts: { bottom: Leggings } },
  { id: 'shorts-estrella', slot: 'bottom', kind: 'shorts', spokenName: 'shorts de estrella', theme: 'casual', shapeTag: 'estrella',
    variants: [variant('mezclilla', '#4a7bd0', 'azul'), ...variantsOf('rosa', 'amarillo', 'naranja', 'verde', 'blanco')], parts: { bottom: Shorts } },
  { id: 'skirt-tutu', slot: 'bottom', kind: 'tutú', spokenName: 'tutú', theme: 'fiesta',
    variants: variantsOf('rosa', 'morado', 'azul', 'blanco', 'amarillo', 'rojo'), parts: { bottom: Tutu } },
  { id: 'skirt-corazones', slot: 'bottom', kind: 'falda', spokenName: 'falda de corazones', theme: 'casual', shapeTag: 'corazon',
    variants: variantsOf('rojo', 'rosa', 'morado', 'azul', 'negro', 'naranja', 'cafe'), parts: { bottom: FaldaCorazones } },
];
