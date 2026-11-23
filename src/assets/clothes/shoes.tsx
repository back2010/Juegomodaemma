/** Calzado: botas, tenis, sandalias y zapatillas brillantes. Pie izquierdo; el derecho se refleja. */
import type { CatalogItem, SvgPart } from '@/types';
import { Gloss, LinGrad, Sparkle, outline, variant, variantsOf } from '@/art/kit';
import { Pair, contrast } from './parts';

const Botas: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  return (
    <g>
      <defs><LinGrad id={idp('g')} p={p} dir="h" /></defs>
      <Pair>
        <path d="M251 870L293 870C292 906 291 930 293 952C297 972 302 984 282 988C262 991 244 989 240 978C240 964 254 954 258 940C258 914 254 892 251 870Z"
          fill={`url(#${idp('g')})`} stroke={o} strokeWidth={3} strokeLinejoin="round" />
        <path d="M251 870L293 870L293 884L252 884Z" fill={p.light} stroke={o} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M241 980C250 994 286 994 298 982L296 972C284 984 252 984 242 972Z" fill={p.shade} stroke={o} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M257 906L292 910" stroke={p.shade} strokeWidth={3} strokeLinecap="round" />
        <rect x={270} y={902} width={12} height={14} rx={3} fill="#ffd23f" stroke={o} strokeWidth={2} />
        <path d="M261 946Q272 956 286 950" stroke={p.shade} strokeWidth={2.5} fill="none" opacity={0.5} />
        <Gloss cx={262} cy={920} rx={3.5} ry={18} o={0.45} rot={4} />
      </Pair>
    </g>
  );
};

const Tenis: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  const c = contrast(p);
  return (
    <g>
      <defs><LinGrad id={idp('g')} p={p} /></defs>
      <Pair>
        <path d="M253 928C252 944 246 958 243 972C240 984 252 990 272 990C290 990 299 986 297 974C292 962 291 948 291 928Q272 938 253 928Z"
          fill={`url(#${idp('g')})`} stroke={o} strokeWidth={3} strokeLinejoin="round" />
        <path d="M242 978C244 998 292 998 299 980L298 972C290 984 250 986 242 970Z" fill="#fffdfb" stroke={o} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M244 972C256 976 268 966 276 958C284 966 294 972 297 974" fill="none" stroke={c} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
        <path d="M262 938L282 944M262 947L283 953" stroke="#fffdfb" strokeWidth={3} strokeLinecap="round" />
        <path d="M253 928Q272 938 291 928" stroke={p.light} strokeWidth={5} fill="none" strokeLinecap="round" />
        <Gloss cx={260} cy={956} rx={6} ry={3} o={0.5} />
      </Pair>
    </g>
  );
};

const Sandalias: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  return (
    <g>
      <defs><LinGrad id={idp('g')} p={p} dir="h" /></defs>
      <Pair>
        <path d="M244 978C246 994 288 994 296 980C296 974 290 970 286 970L252 970C246 970 244 974 244 978Z" fill={p.shade} stroke={o} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M264 940L272 962" stroke={p.main} strokeWidth={6} strokeLinecap="round" />
        <path d="M250 966Q268 958 288 962L288 974Q268 970 250 976Z" fill={`url(#${idp('g')})`} stroke={o} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M258 928Q274 936 292 928L292 941Q274 949 258 941Z" fill={`url(#${idp('g')})`} stroke={o} strokeWidth={2.5} strokeLinejoin="round" />
        <circle cx={272} cy={966} r={6} fill={p.light} stroke={o} strokeWidth={2} />
        <circle cx={272} cy={966} r={2} fill={p.shade} />
        <Gloss cx={266} cy={934} rx={6} ry={2.5} o={0.55} />
      </Pair>
    </g>
  );
};

const Zapatillas: SvgPart = ({ palette: p, idp }) => {
  const o = outline(p);
  return (
    <g>
      <defs><LinGrad id={idp('g')} p={p} /></defs>
      <Pair>
        <path d="M257 934C252 950 245 962 242 974C246 992 288 992 293 976C293 960 289 946 289 934Q273 942 257 934Z" fill={`url(#${idp('g')})`} stroke={o} strokeWidth={3} strokeLinejoin="round" />
        <path d="M242 976C250 990 286 990 293 978L293 984C286 996 248 996 242 984Z" fill={p.shade} stroke={o} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M257 950L289 950L289 959L257 959Z" fill={p.light} stroke={o} strokeWidth={2} strokeLinejoin="round" />
        <circle cx={277} cy={954.5} r={4.2} fill="#ffd23f" stroke={o} strokeWidth={1.8} />
        <Sparkle x={262} y={972} r={5} /><Sparkle x={280} y={980} r={4} />
        <path d="M257 934Q273 942 289 934" stroke={p.light} strokeWidth={4} fill="none" strokeLinecap="round" />
        <Gloss cx={260} cy={966} rx={6} ry={3} o={0.6} />
      </Pair>
    </g>
  );
};

export const shoeClothes: CatalogItem[] = [
  { id: 'shoes-botas', slot: 'shoes', kind: 'botas', spokenName: 'botas', theme: 'casual',
    variants: variantsOf('cafe', 'negro', 'rojo', 'rosa', 'morado', 'blanco'), parts: { shoes: Botas } },
  { id: 'shoes-tenis', slot: 'shoes', kind: 'tenis', spokenName: 'tenis', theme: 'deporte',
    variants: variantsOf('blanco', 'rosa', 'azul', 'verde', 'naranja', 'negro', 'rojo', 'amarillo'), parts: { shoes: Tenis } },
  { id: 'shoes-sandalias', slot: 'shoes', kind: 'sandalias', spokenName: 'sandalias', theme: 'playa',
    variants: [...variantsOf('amarillo', 'rosa', 'azul', 'cafe', 'naranja', 'blanco'), variant('turquesa', '#22d3c5', 'azul', 'verde')], parts: { shoes: Sandalias } },
  { id: 'shoes-brillantes', slot: 'shoes', kind: 'zapatillas', spokenName: 'zapatillas brillantes', theme: 'fiesta',
    variants: variantsOf('negro', 'rojo', 'rosa', 'morado', 'azul', 'blanco', 'amarillo'), parts: { shoes: Zapatillas } },
];
