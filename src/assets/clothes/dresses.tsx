/** Vestidos, conjuntos y traje de baño (slot 'dress': cuerpo entero, ocultan blusa y pantalón). */
import type { CatalogItem, SvgPart } from '@/types';
import { Gloss, GemShape, Sparkle, outline, shapePath, variant, variantsOf } from '@/art/kit';
import { CylGrad, Motifs, Pair, Sym, VGrad, contrast, mirror } from './parts';
import { bodiceL, leggingsL, pantsL, shortsL } from './geom';
import { makeTee } from './tops';

const SUP: CatalogItem['suppresses'] = ['top', 'bottom'];

/** Vestido casual de tirantes con lunares y cinturón. */
const VestidoLunares: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  const d = bodiceL({ sleeve: 'none', hem: 592, after: 'C224 650 208 730 198 786 C230 800 270 806 300 802 Z' });
  return (
    <g>
      <defs><CylGrad id={idp('g')} p={p} x1={190} x2={410} /></defs>
      <Sym d={d} fill={`url(#${idp('g')})`} o={o} clip={idp('c')}>
        <Motifs shape="circulo" p={p} x0={200} x1={400} y0={480} y1={800} step={38} r={7.5} />
        <path d="M268 606C256 680 240 740 222 796M300 608L300 804" stroke={p.shade} strokeWidth={2.5} opacity={0.3} />
        <path d="M332 606C344 680 360 740 378 796" stroke={p.shade} strokeWidth={2.5} opacity={0.3} />
      </Sym>
      <path d="M198 786C230 800 270 806 300 802C330 806 370 800 402 786" stroke={p.light} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M254 440Q286 468 300 474Q314 468 346 440" stroke={p.light} strokeWidth={4} fill="none" strokeLinecap="round" />
      <Sym d="M300 584 L243 584 L242 606 L300 606 Z" fill={p.shade} o={o} sw={2.5} />
      <path d="M300 595L272 580L274 610ZM300 595L328 580L326 610Z" fill={p.light} stroke={o} strokeWidth={2.5} strokeLinejoin="round" />
      <circle cx={300} cy={595} r={6} fill={p.main} stroke={o} strokeWidth={2} />
      <Gloss cx={252} cy={520} rx={8} ry={26} o={0.28} />
      <Gloss cx={232} cy={700} rx={10} ry={46} rot={14} o={0.2} />
    </g>
  );
};

/** Vestido de corazones con cuello redondo y falda de vuelo. */
const VestidoCorazones: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  const d = bodiceL({ sleeve: 'cap', neck: 'scoop', hem: 590, after: 'C220 640 204 700 192 764 Q246 790 300 782 Z' });
  const c = contrast(p);
  return (
    <g>
      <defs><CylGrad id={idp('g')} p={p} x1={190} x2={410} /></defs>
      <Sym d={d} fill={`url(#${idp('g')})`} o={o} clip={idp('c')}>
        <Motifs shape="corazon" p={p} x0={206} x1={396} y0={470} y1={780} step={40} r={9} />
        <path d="M262 604C250 670 232 730 214 776M338 604C350 670 368 730 386 776M300 606L300 784" stroke={p.shade} strokeWidth={2.5} opacity={0.3} fill="none" />
      </Sym>
      <path d="M192 764Q246 790 300 782Q354 790 408 764" stroke={p.light} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M282 434Q300 474 318 434" stroke={c} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.9} />
      <Sym d="M300 582 L243 582 L242 600 L300 600 Z" fill={p.shade} o={o} sw={2.5} />
      <path d={shapePath('corazon', 300, 592, 15)} fill={c} stroke={o} strokeWidth={2} strokeLinejoin="round" />
      <Gloss cx={254} cy={520} rx={8} ry={26} o={0.28} />
      <Gloss cx={236} cy={690} rx={10} ry={44} rot={14} o={0.2} />
    </g>
  );
};

/** Vestido de princesa: falda de baile con capas de tul, brillos y estrellas. */
const VestidoPrincesa: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  const d = bodiceL({ sleeve: 'cap', neck: 'scoop', hem: 592,
    after: 'C206 640 150 780 120 884 Q132 912 160 904 Q184 922 214 908 Q242 926 270 910 Q286 920 300 914 Z' });
  const over = 'M300 604 L240 604 C214 660 168 760 146 842 Q172 856 196 846 Q222 864 250 848 Q278 862 300 856 Z';
  return (
    <g>
      <defs>
        <linearGradient id={idp('sk')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={p.shade} /><stop offset="0.28" stopColor={p.main} />
          <stop offset="0.5" stopColor={p.light} /><stop offset="0.72" stopColor={p.main} /><stop offset="1" stopColor={p.shade} />
        </linearGradient>
        <VGrad id={idp('ov')} p={p} y1={604} y2={860} />
      </defs>
      <Sym d={d} fill={`url(#${idp('sk')})`} o={o} sw={4} clip={idp('c')}>
        <Motifs shape="estrella" p={p} x0={150} x1={450} y0={620} y1={905} step={46} r={8} o={0.85} color={p.light} />
        <path d="M262 604C240 700 200 800 160 900M300 606L300 914M338 604C360 700 400 800 440 900" stroke={p.shade} strokeWidth={3} opacity={0.3} fill="none" />
      </Sym>
      <g opacity={0.62}>
        <Sym d={over} fill={`url(#${idp('ov')})`} o={p.light} sw={2.5} />
      </g>
      <path d={over} fill="none" stroke={p.light} strokeWidth={3} opacity={0.7} />
      <path d={mirror(over)} fill="none" stroke={p.light} strokeWidth={3} opacity={0.7} />
      <path d="M282 434Q300 474 318 434" stroke={p.light} strokeWidth={6} fill="none" strokeLinecap="round" />
      <Sym d="M300 580 L243 580 L241 604 L300 604 Z" fill={p.light} o={o} sw={3} />
      <GemShape shape="estrella" cx={300} cy={592} r={15} p={{ main: '#ffd23f', light: '#fff3a8', shade: '#c7901a' }} gid={idp('gem')} />
      <Sparkle x={236} y={510} r={11} /><Sparkle x={366} y={540} r={9} /><Sparkle x={206} y={800} r={12} />
      <Sparkle x={398} y={760} r={10} /><Sparkle x={300} y={720} r={9} o={0.8} />
      <Gloss cx={252} cy={520} rx={8} ry={26} o={0.3} />
      <Gloss cx={220} cy={740} rx={14} ry={60} rot={20} o={0.2} />
    </g>
  );
};

/** Conjunto deportivo: playera con franjas + shorts. */
const TeeSport = makeTee({
  sleeve: 'short', neck: 'v', hem: 618, pattern: 'none',
  extra: (p) => (
    <g fill="none" stroke={contrast(p)} strokeLinecap="round">
      <path d="M232 500C236 540 238 580 238 622M368 500C364 540 362 580 362 622" strokeWidth={8} opacity={0.85} />
      <path d="M190 514L214 520M410 514L386 520" strokeWidth={7} opacity={0.85} />
    </g>
  ),
});
const ConjuntoDeportivo: SvgPart = (props) => {
  const { palette: p, idp } = props;
  const o = outline(p);
  return (
    <g>
      <defs><CylGrad id={idp('s')} p={p} x1={225} x2={375} /></defs>
      <Sym d={shortsL(762)} fill={`url(#${idp('s')})`} o={o} sw={3.5}>
        <path d="M300 612L300 706" stroke={p.shade} strokeWidth={2.5} />
      </Sym>
      <Pair>
        <path d="M236 744Q268 760 298 754" stroke={contrast(p)} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.9} />
        <path d="M234 640C232 680 232 720 236 750" stroke={contrast(p)} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.85} />
        <Gloss cx={246} cy={680} rx={6} ry={28} rot={8} o={0.25} />
      </Pair>
      <TeeSport {...props} />
    </g>
  );
};

/** Overol de mezclilla sobre playera. */
const ConjuntoOverol: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  const shirt = { main: '#fff4f8', light: '#ffffff', shade: '#e8b8cf' };
  const so = outline(shirt);
  const d = bodiceL({ sleeve: 'short', hem: 610 });
  return (
    <g>
      <defs><CylGrad id={idp('g')} p={p} x1={225} x2={375} /><CylGrad id={idp('sh')} p={shirt} x1={190} x2={410} /></defs>
      <Sym d={pantsL(908, 6)} fill={`url(#${idp('g')})`} o={o} sw={3.5}>
        <path d="M300 612L300 706" stroke={p.shade} strokeWidth={2.5} />
      </Sym>
      <Pair>
        <path d="M252 900L296 906" stroke={p.light} strokeWidth={6} strokeLinecap="round" opacity={0.9} />
        <path d="M252 880L294 886" stroke={p.shade} strokeWidth={2} opacity={0.4} />
        <Gloss cx={254} cy={720} rx={7} ry={44} rot={8} o={0.22} />
      </Pair>
      {/* playera de rayas */}
      <Sym d={d} fill={`url(#${idp('sh')})`} o={so} clip={idp('c')}>
        {[466, 490, 514, 538, 562, 586].map((y) => <rect key={y} x={176} y={y} width={248} height={9} fill="#ff8ac6" opacity={0.75} />)}
      </Sym>
      <path d="M282 434Q300 458 318 434" stroke="#ffffff" strokeWidth={5} fill="none" />
      {/* peto y tirantes */}
      <Sym d="M300 520 L262 520 L254 604 L300 612 Z" fill={`url(#${idp('g')})`} o={o} sw={3.5} />
      <Pair>
        <path d="M264 520L258 452L276 452L280 520Z" fill={p.main} stroke={o} strokeWidth={3} strokeLinejoin="round" />
        <circle cx={268} cy={528} r={7} fill="#ffd23f" stroke={o} strokeWidth={2} />
        <path d="M262 560L262 604" stroke={p.light} strokeWidth={2.5} strokeDasharray="5 4" />
      </Pair>
      <path d={shapePath('estrella', 300, 560, 14)} fill="#ffd23f" stroke={o} strokeWidth={2} strokeLinejoin="round" />
      <path d="M262 526L338 526" stroke={p.light} strokeWidth={2.5} strokeDasharray="5 4" />
      <Sym d="M300 592 L241 592 L239 616 L300 616 Z" fill={p.shade} o={o} sw={3} />
      <Gloss cx={258} cy={560} rx={5} ry={18} o={0.25} />
    </g>
  );
};

/** Pijama de estrellas: blusa de manga larga y pantalón. */
const ConjuntoPijama: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  const d = bodiceL({ sleeve: 'long', hem: 630 });
  return (
    <g>
      <defs><CylGrad id={idp('g')} p={p} x1={190} x2={410} /></defs>
      <Sym d={leggingsL(916).replace('L241 598', 'L238 598')} fill={`url(#${idp('g')})`} o={o} sw={3.5} clip={idp('cp')}>
        <Motifs shape="estrella" p={p} x0={240} x1={360} y0={640} y1={910} step={34} r={8} />
        <path d="M300 612L300 706" stroke={p.shade} strokeWidth={2.5} />
      </Sym>
      <Pair><path d="M258 904Q274 912 290 906" stroke={p.light} strokeWidth={7} fill="none" strokeLinecap="round" /></Pair>
      <Sym d={d} fill={`url(#${idp('g')})`} o={o} clip={idp('c')}>
        <Motifs shape="estrella" p={p} x0={196} x1={404} y0={470} y1={630} step={40} r={9} />
      </Sym>
      <path d="M282 434L300 470L318 434" stroke={p.light} strokeWidth={5} fill="none" strokeLinejoin="round" />
      <Pair>
        <path d="M182 622L206 626" stroke={p.light} strokeWidth={7} strokeLinecap="round" />
      </Pair>
      <path d="M240 620L360 620" stroke={p.shade} strokeWidth={3} opacity={0.4} />
      {[490, 530, 570].map((y) => <circle key={y} cx={300} cy={y} r={4} fill={p.light} stroke={o} strokeWidth={1.5} />)}
      <Gloss cx={256} cy={492} rx={8} ry={24} o={0.28} />
    </g>
  );
};

/** Traje de baño de una pieza con volante. */
const TrajeBano: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  const d = 'M300 472 Q286 470 276 438 L254 440 C252 462 244 482 230 496 C236 530 242 566 243 600 C240 622 234 640 240 656 C262 664 286 672 300 686 Z';
  return (
    <g>
      <defs><CylGrad id={idp('g')} p={p} x1={225} x2={375} /></defs>
      <Sym d={d} fill={`url(#${idp('g')})`} o={o} clip={idp('c')}>
        <Motifs shape="estrella" p={p} x0={250} x1={350} y0={500} y1={650} step={40} r={7} o={0.75} />
      </Sym>
      <path d="M254 440Q286 470 300 476Q314 470 346 440" stroke={p.light} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M240 658C262 666 286 674 300 688C314 674 338 666 360 658" stroke={p.light} strokeWidth={5} fill="none" strokeLinecap="round" />
      <Sym d="M300 556 L243 556 L243 570 L300 570 Z" fill={p.shade} o={o} sw={2} />
      <GemShape shape="estrella" cx={300} cy={528} r={16} p={{ main: '#ffd23f', light: '#fff3a8', shade: '#c7901a' }} gid={idp('gem')} />
      <Gloss cx={252} cy={516} rx={7} ry={24} o={0.3} />
      <Gloss cx={252} cy={620} rx={5} ry={14} o={0.25} />
    </g>
  );
};

export const dressClothes: CatalogItem[] = [
  { id: 'dress-lunares', slot: 'dress', kind: 'vestido', spokenName: 'vestido de lunares', theme: 'casual', shapeTag: 'circulo',
    variants: variantsOf('amarillo', 'rosa', 'azul', 'verde', 'naranja', 'rojo'), parts: { dress: VestidoLunares }, suppresses: SUP },
  { id: 'dress-corazones', slot: 'dress', kind: 'vestido', spokenName: 'vestido de corazones', theme: 'casual', shapeTag: 'corazon',
    variants: variantsOf('rojo', 'rosa', 'morado', 'blanco', 'azul', 'cafe'), parts: { dress: VestidoCorazones }, suppresses: SUP },
  { id: 'dress-princesa', slot: 'dress', kind: 'vestido', spokenName: 'vestido de princesa', theme: 'fantasia', shapeTag: 'estrella',
    variants: [...variantsOf('rosa', 'morado', 'azul', 'amarillo', 'blanco'), variant('menta', '#3ddc84', 'verde')],
    parts: { dress: VestidoPrincesa }, suppresses: SUP },
  { id: 'set-deportivo', slot: 'dress', kind: 'conjunto', spokenName: 'conjunto deportivo', theme: 'deporte',
    variants: variantsOf('naranja', 'azul', 'verde', 'rosa', 'negro', 'morado'), parts: { dress: ConjuntoDeportivo }, suppresses: SUP },
  { id: 'set-overol', slot: 'dress', kind: 'conjunto', spokenName: 'conjunto de overol', theme: 'casual', shapeTag: 'estrella',
    variants: [variant('mezclilla', '#4a7bd0', 'azul'), ...variantsOf('rosa', 'verde', 'amarillo', 'cafe', 'rojo')],
    parts: { dress: ConjuntoOverol }, suppresses: SUP },
  { id: 'set-pijama', slot: 'dress', kind: 'conjunto', spokenName: 'pijama de estrellas', theme: 'casual', shapeTag: 'estrella',
    variants: variantsOf('azul', 'morado', 'rosa', 'amarillo', 'verde', 'blanco'), parts: { dress: ConjuntoPijama }, suppresses: SUP },
  { id: 'dress-traje-bano', slot: 'dress', kind: 'traje de baño', spokenName: 'traje de baño', theme: 'playa', shapeTag: 'estrella',
    variants: [...variantsOf('rojo', 'amarillo', 'rosa', 'naranja', 'morado'), variant('turquesa', '#22d3c5', 'azul', 'verde')],
    parts: { dress: TrajeBano }, suppresses: SUP },
];
