/** Disfraces y fantasía: sirena, hada con alas y superheroína con capa (piezas detrás del cuerpo en 'itemBack'). */
import type { CatalogItem, SvgPart } from '@/types';
import { Gloss, GemShape, Sparkle, outline, variant, variantsOf } from '@/art/kit';
import { CylGrad, Pair, Sym, VGrad, contrast, mirror } from './parts';
import { bodiceL } from './geom';

const SUP: CatalogItem['suppresses'] = ['top', 'bottom'];

/** Cola de sirena que cubre las piernas, con escamas y conchas. */
const Sirena: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  const tail = 'M300 588 L240 588 C230 650 234 720 250 790 C258 840 250 884 226 922 C204 948 182 952 168 978 C196 992 250 982 300 944 Z';
  const fin = 'M300 944 C250 982 196 992 168 978';
  return (
    <g>
      <defs>
        <CylGrad id={idp('g')} p={p} x1={170} x2={430} />
        <clipPath id={idp('cl')}><path d={tail} /><path d={mirror(tail)} /></clipPath>
      </defs>
      <Sym d={tail} fill={`url(#${idp('g')})`} o={o} sw={3.5}>
        <g clipPath={`url(#${idp('cl')})`}>
          {Array.from({ length: 9 }, (_, r) => Array.from({ length: 6 }, (_, c) => {
            const x = 212 + c * 35 + (r % 2 ? 17 : 0), y = 612 + r * 32;
            return <path key={`${r}-${c}`} d={`M${x - 17} ${y}Q${x} ${y + 26} ${x + 17} ${y}`} fill="none" stroke={p.shade} strokeWidth={2.2} opacity={0.4} />;
          }))}
        </g>
      </Sym>
      <Sym d="M300 588 L240 588 L238 612 L300 612 Z" fill={p.light} o={o} sw={3} />
      {/* aletas con nervaduras */}
      <Pair>
        <path d="M226 922C216 940 196 952 176 972M236 934C230 950 214 964 194 978M256 942C250 956 236 968 222 982" stroke={p.light} strokeWidth={3} fill="none" opacity={0.75} />
      </Pair>
      <path d={fin} fill="none" stroke={p.light} strokeWidth={4} strokeLinecap="round" opacity={0.8} />
      {/* top de conchas */}
      <Pair>
        <path d="M296 486C282 470 252 470 242 494C238 508 250 518 268 518C284 518 298 506 296 486Z" fill={p.light} stroke={o} strokeWidth={3} strokeLinejoin="round" />
        <path d="M268 516L252 480M268 516L270 474M268 516L286 480" stroke={p.shade} strokeWidth={2.5} strokeLinecap="round" opacity={0.6} fill="none" />
        <path d="M244 490L256 442M292 486L282 436" stroke={p.light} strokeWidth={4} strokeLinecap="round" />
        <Gloss cx={254} cy={490} rx={6} ry={4} o={0.6} />
      </Pair>
      <circle cx={300} cy={500} r={6} fill="#fff" stroke={o} strokeWidth={2} />
      <Gloss cx={248} cy={680} rx={6} ry={40} rot={6} o={0.28} />
      <Sparkle x={330} y={760} r={8} /><Sparkle x={270} y={850} r={7} />
    </g>
  );
};

/** Vestido de hada con pétalos. */
const HadaVestido: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  const body = bodiceL({ sleeve: 'none', neck: 'v', hem: 590,
    after: 'C228 610 210 680 188 770 L216 746 L226 812 L254 764 L266 836 L288 774 L300 846 Z' });
  const inner = 'M300 596 L246 596 C232 640 220 690 208 740 L232 722 L244 780 L270 734 L282 792 L300 744 Z';
  return (
    <g>
      <defs><CylGrad id={idp('g')} p={p} x1={190} x2={410} /><VGrad id={idp('v')} p={p} y1={596} y2={800} /></defs>
      <Sym d={body} fill={`url(#${idp('g')})`} o={o} sw={3.5} clip={idp('c')}>
        <path d="M262 606L238 780M300 610L300 840M338 606L362 780" stroke={p.shade} strokeWidth={2.5} opacity={0.3} />
      </Sym>
      <Sym d={inner} fill={`url(#${idp('v')})`} o={p.light} sw={2.5} />
      <g opacity={0.5}><Sym d={inner} fill={p.light} o={p.light} sw={1} /></g>
      <Sym d="M300 584 L243 584 L242 604 L300 604 Z" fill={p.shade} o={o} sw={2.5} />
      {/* flor en la cintura */}
      <g>
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx={300} cy={582} rx={7} ry={13} fill={p.light} stroke={o} strokeWidth={2} transform={`rotate(${a} 300 595)`} />
        ))}
        <circle cx={300} cy={595} r={7} fill="#ffd23f" stroke={o} strokeWidth={2} />
      </g>
      <path d="M254 440Q286 470 300 498Q314 470 346 440" stroke={p.light} strokeWidth={4} fill="none" strokeLinecap="round" />
      <Sparkle x={250} y={540} r={8} /><Sparkle x={350} y={700} r={9} /><Sparkle x={236} y={760} r={7} />
      <Gloss cx={252} cy={520} rx={7} ry={24} o={0.3} />
    </g>
  );
};

/** Alas de hada, detrás del cuerpo. */
const HadaAlas: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  const upper = 'M268 476C214 396 120 340 90 392C72 440 140 520 266 548Z';
  const lower = 'M268 548C206 560 128 620 146 690C166 716 240 650 272 584Z';
  return (
    <g>
      <defs>
        <radialGradient id={idp('w')} cx="0.75" cy="0.6" r="0.9">
          <stop offset="0" stopColor="#ffffff" /><stop offset="0.5" stopColor={p.light} /><stop offset="1" stopColor={p.main} />
        </radialGradient>
      </defs>
      <Pair>
        <path d={upper} fill={`url(#${idp('w')})`} stroke={o} strokeWidth={3.5} strokeLinejoin="round" opacity={0.88} />
        <path d={lower} fill={`url(#${idp('w')})`} stroke={o} strokeWidth={3.5} strokeLinejoin="round" opacity={0.88} />
        <path d="M268 512C220 470 150 420 100 400M268 520C210 500 150 480 104 428M262 566C210 600 170 640 154 684" stroke={p.shade} strokeWidth={2.2} fill="none" opacity={0.45} />
        <Gloss cx={160} cy={430} rx={30} ry={10} rot={30} o={0.6} />
        <Gloss cx={170} cy={640} rx={14} ry={6} rot={50} o={0.5} />
      </Pair>
      <Sparkle x={130} y={470} r={10} /><Sparkle x={470} y={470} r={10} /><Sparkle x={170} y={660} r={7} /><Sparkle x={430} y={660} r={7} />
    </g>
  );
};

/** Traje de superheroína (malla, faldita, cinturón y emblema). */
const SuperTraje: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  const body = bodiceL({ sleeve: 'none', hem: 604, after: 'C226 640 210 680 198 712 Q250 730 300 724 Z' });
  return (
    <g>
      <defs><CylGrad id={idp('g')} p={p} x1={190} x2={410} /></defs>
      <Sym d={body} fill={`url(#${idp('g')})`} o={o} sw={3.5} clip={idp('c')}>
        <path d="M262 616L244 716M300 616L300 724M338 616L356 716" stroke={p.shade} strokeWidth={2.5} opacity={0.3} />
      </Sym>
      <path d="M198 712Q250 730 300 724Q350 730 402 712" stroke={contrast(p)} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.9} />
      <path d="M254 440Q286 472 300 474Q314 472 346 440" stroke={contrast(p)} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.9} />
      {/* cinturón dorado */}
      <Sym d="M300 586 L241 586 L239 612 L300 612 Z" fill="#ffd23f" o={o} sw={3} />
      <rect x={288} y={584} width={24} height={30} rx={5} fill="#fff3a8" stroke={o} strokeWidth={2.5} />
      {/* emblema */}
      <path d="M300 496L338 520L300 566L262 520Z" fill="#ffd23f" stroke={o} strokeWidth={3} strokeLinejoin="round" />
      <GemShape shape="estrella" cx={300} cy={528} r={20} p={{ main: p.main, light: p.light, shade: p.shade }} gid={idp('gem')} />
      <Gloss cx={252} cy={520} rx={7} ry={26} o={0.3} />
    </g>
  );
};

/** Capa ondeante detrás del cuerpo. */
const SuperCapa: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  const cape = 'M282 432C238 452 198 530 172 690C160 780 148 850 136 906Q172 930 216 912Q258 932 300 910Z';
  return (
    <g>
      <defs><linearGradient id={idp('cp')} x1="0" y1="0" x2="1" y2="0.2">
        <stop offset="0" stopColor={p.main} /><stop offset="0.5" stopColor={p.light} /><stop offset="1" stopColor={p.shade} /></linearGradient></defs>
      <Sym d={cape} fill={`url(#${idp('cp')})`} o={o} sw={3.5} clip={idp('c')}>
        <path d="M262 470C240 600 214 760 190 900M300 450L300 900" stroke={p.shade} strokeWidth={3} opacity={0.3} fill="none" />
        <path d="M338 470C360 600 386 760 410 900" stroke={p.shade} strokeWidth={3} opacity={0.3} fill="none" />
      </Sym>
      <path d="M136 906Q172 930 216 912Q258 932 300 910Q342 932 384 912Q428 930 464 906" stroke="#ffd23f" strokeWidth={6} fill="none" strokeLinecap="round" />
      <Gloss cx={190} cy={640} rx={10} ry={70} rot={10} o={0.28} />
    </g>
  );
};

export const costumeClothes: CatalogItem[] = [
  { id: 'costume-sirena', slot: 'dress', kind: 'disfraz de sirena', spokenName: 'disfraz de sirena', theme: 'disfraz',
    variants: [variant('turquesa', '#22d3c5', 'azul', 'verde'), ...variantsOf('rosa', 'morado', 'verde', 'azul')],
    parts: { dress: Sirena }, suppresses: SUP },
  { id: 'costume-hada', slot: 'dress', kind: 'disfraz de hada', spokenName: 'disfraz de hada', theme: 'fantasia', shapeTag: 'estrella',
    variants: variantsOf('rosa', 'morado', 'verde', 'azul', 'amarillo', 'blanco'),
    parts: { dress: HadaVestido, itemBack: HadaAlas }, suppresses: SUP },
  { id: 'costume-superheroina', slot: 'dress', kind: 'disfraz de superheroína', spokenName: 'disfraz de superheroína', theme: 'disfraz', shapeTag: 'estrella',
    variants: variantsOf('rojo', 'azul', 'morado', 'rosa', 'amarillo', 'negro'),
    parts: { dress: SuperTraje, itemBack: SuperCapa }, suppresses: SUP },
];
