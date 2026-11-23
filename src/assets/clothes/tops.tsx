/** Blusas y playeras. Coordenadas absolutas sobre el cuerpo compartido. */
import type { ReactNode } from 'react';
import type { CatalogItem, PartProps, ShapeName, SvgPart } from '@/types';
import { Gloss, outline, variant, variantsOf } from '@/art/kit';
import { CylGrad, Motifs, Sym, contrast } from './parts';
import { bodiceL, type Neck, type Sleeve } from './geom';

type Pattern = 'dots' | 'stars' | 'hearts' | 'stripes' | 'none';
const SHAPE_OF: Record<Exclude<Pattern, 'stripes' | 'none'>, ShapeName> = { dots: 'circulo', stars: 'estrella', hearts: 'corazon' };

export function Pattern({ kind, p, y0 = 456, y1 = 640, x0 = 190, x1 = 410, step = 36, r = 7 }: {
  kind: Pattern; p: PartProps['palette']; y0?: number; y1?: number; x0?: number; x1?: number; step?: number; r?: number;
}) {
  if (kind === 'none') return null;
  if (kind === 'stripes') {
    const lines: ReactNode[] = [];
    for (let y = y0 + 8; y < y1; y += 24) lines.push(<rect key={y} x={x0 - 10} y={y} width={x1 - x0 + 20} height={10} fill={contrast(p)} opacity={0.75} />);
    return <g>{lines}</g>;
  }
  return <Motifs shape={SHAPE_OF[kind]} p={p} x0={x0} x1={x1} y0={y0} y1={y1} step={step} r={r} />;
}

interface TeeOpts {
  sleeve: Sleeve; hem: number; neck?: Neck; pattern: Pattern; r?: number; step?: number;
  extra?: (p: PartProps['palette'], o: string) => ReactNode;
}
export function makeTee(opt: TeeOpts): SvgPart {
  return function Tee({ palette: p, idp }: PartProps) {
    const o = outline(p);
    const neck = opt.neck ?? 'round';
    const d = bodiceL({ sleeve: opt.sleeve, hem: opt.hem, neck });
    const collar = neck === 'v' ? 'M282 434 L300 494 L318 434' : neck === 'scoop' ? 'M282 434 Q300 474 318 434' : 'M282 434 Q300 458 318 434';
    return (
      <g>
        <defs><CylGrad id={idp('g')} p={p} x1={190} x2={410} /></defs>
        <Sym d={d} fill={`url(#${idp('g')})`} o={o} clip={idp('c')}>
          <Pattern kind={opt.pattern} p={p} y1={opt.hem} r={opt.r} step={opt.step} />
          {opt.extra?.(p, o)}
        </Sym>
        {opt.sleeve !== 'none' && <path d={collar} stroke={p.light} strokeWidth={5} fill="none" strokeLinecap="round" />}
        <path d={`M240 ${opt.hem - 9} L360 ${opt.hem - 9}`} stroke={p.shade} strokeWidth={2.5} opacity={0.4} />
        <path d="M244 540C256 548 262 566 262 590M356 540C344 548 338 566 338 590" stroke={p.shade} strokeWidth={2.5} fill="none" opacity={0.35} strokeLinecap="round" />
        <Gloss cx={258} cy={492} rx={9} ry={24} o={0.28} />
        <Gloss cx={206} cy={494} rx={5} ry={12} o={0.3} rot={-12} />
      </g>
    );
  };
}

const BlusaLunares = makeTee({ sleeve: 'cap', neck: 'scoop', hem: 610, pattern: 'dots', r: 7, step: 34 });
const CamisetaEstrellas = makeTee({ sleeve: 'short', hem: 616, pattern: 'stars', r: 9, step: 40 });

/** Blusa de tirantes con volante y moño. */
const BlusaTirantes: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  const d = bodiceL({ sleeve: 'none', hem: 590, neck: 'round',
    after: 'C228 600 222 612 226 624 Q240 640 256 626 Q272 642 288 628 Q296 636 300 628 Z' });
  return (
    <g>
      <defs><CylGrad id={idp('g')} p={p} x1={200} x2={400} /></defs>
      <Sym d={d} fill={`url(#${idp('g')})`} o={o} clip={idp('c')}>
        <Pattern kind="hearts" p={p} y1={640} r={6} step={30} />
      </Sym>
      <path d="M244 580Q270 590 300 584Q330 590 356 580" stroke={p.shade} strokeWidth={3} fill="none" opacity={0.45} />
      <path d="M254 440Q286 466 300 472Q314 466 346 440" stroke={p.light} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M300 482L278 470L280 496ZM300 482L322 470L320 496Z" fill={p.light} stroke={o} strokeWidth={2.5} strokeLinejoin="round" />
      <circle cx={300} cy={483} r={5} fill={p.main} stroke={o} strokeWidth={2} />
      <Gloss cx={262} cy={520} rx={8} ry={22} o={0.28} />
    </g>
  );
};

/** Playera deportiva con franjas laterales y cuello en V. */
const PlayeraDeportiva = makeTee({
  sleeve: 'short', neck: 'v', hem: 620, pattern: 'none',
  extra: (p) => (
    <g fill="none" stroke={contrast(p)} strokeLinecap="round">
      <path d="M232 500C236 540 238 580 238 624M368 500C364 540 362 580 362 624" strokeWidth={9} opacity={0.85} />
      <path d="M190 514L214 520M410 514L386 520" strokeWidth={7} opacity={0.85} />
      <path d="M190 504L212 509M410 504L388 509" strokeWidth={3} opacity={0.6} />
    </g>
  ),
});

export const topClothes: CatalogItem[] = [
  { id: 'top-blusa-lunares', slot: 'top', kind: 'blusa', spokenName: 'blusa de lunares', theme: 'casual', shapeTag: 'circulo',
    variants: variantsOf('blanco', 'rosa', 'amarillo', 'azul', 'rojo', 'verde'), parts: { top: BlusaLunares } },
  { id: 'top-camiseta-estrellas', slot: 'top', kind: 'playera', spokenName: 'playera de estrellas', theme: 'casual', shapeTag: 'estrella',
    variants: variantsOf('amarillo', 'azul', 'naranja', 'rosa', 'negro', 'verde', 'morado'), parts: { top: CamisetaEstrellas } },
  { id: 'top-tirantes', slot: 'top', kind: 'blusa', spokenName: 'blusa de tirantes', theme: 'casual', shapeTag: 'corazon',
    variants: [...variantsOf('rosa', 'blanco', 'morado', 'amarillo', 'naranja'), variant('turquesa', '#22d3c5', 'azul', 'verde')], parts: { top: BlusaTirantes } },
  { id: 'top-deportivo', slot: 'top', kind: 'playera', spokenName: 'playera deportiva', theme: 'deporte',
    variants: variantsOf('azul', 'rojo', 'verde', 'negro', 'naranja', 'blanco'), parts: { top: PlayeraDeportiva } },
];
