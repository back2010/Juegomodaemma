/** Prendas de referencia (P0): una por slot de ropa. Coordenadas absolutas sobre el cuerpo compartido. */
import type { CatalogItem, PartProps } from '@/types';
import { Gloss, LinGrad, GemShape, outline, shapePath, variantsOf, variant } from '@/art/kit';

function DressFiesta({ palette: p, idp }: PartProps) {
  const o = outline(p);
  return (
    <g>
      <defs>
        <LinGrad id={idp('bod')} p={p} dir="h" />
        <linearGradient id={idp('sk')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={p.shade} /><stop offset="0.3" stopColor={p.main} />
          <stop offset="0.5" stopColor={p.light} /><stop offset="0.7" stopColor={p.main} /><stop offset="1" stopColor={p.shade} />
        </linearGradient>
      </defs>
      {/* falda */}
      <path d="M238 592L362 592C400 660 440 740 462 806C400 834 200 834 138 806C160 740 200 660 238 592Z" fill={`url(#${idp('sk')})`} stroke={o} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M262 600C246 680 220 760 196 818M300 600L300 828M338 600C354 680 380 760 404 818" stroke={p.shade} strokeWidth={3} fill="none" opacity={0.45} />
      <path d="M138 806C160 826 180 826 200 812C220 830 240 830 262 816C282 832 318 832 338 816C360 830 380 830 400 812C420 826 440 826 462 806" stroke={p.light} strokeWidth={6} fill="none" strokeLinecap="round" />
      {/* corpiño */}
      <path d="M214 455C240 448 262 470 282 480Q300 492 318 480C338 470 360 448 386 455C380 500 360 550 362 598L238 598C240 550 220 500 214 455Z" fill={`url(#${idp('bod')})`} stroke={o} strokeWidth={3.5} strokeLinejoin="round" />
      {/* mangas abullonadas */}
      <path d="M214 450C188 446 172 480 184 510C200 520 220 508 228 492Z" fill={p.main} stroke={o} strokeWidth={3} strokeLinejoin="round" />
      <path d="M386 450C412 446 428 480 416 510C400 520 380 508 372 492Z" fill={p.main} stroke={o} strokeWidth={3} strokeLinejoin="round" />
      <Gloss cx={198} cy={474} rx={8} ry={5} o={0.5} />
      <Gloss cx={402} cy={474} rx={8} ry={5} o={0.5} rot={20} />
      {/* cinturón con moño */}
      <path d="M234 584L366 584L366 606L234 606Z" fill={p.light} stroke={o} strokeWidth={2.5} />
      <path d="M300 595L270 578L272 612ZM300 595L330 578L328 612Z" fill={p.light} stroke={o} strokeWidth={2.5} strokeLinejoin="round" />
      <GemShape shape="corazon" cx={300} cy={595} r={10} p={p} gid={idp('gem')} />
      <Gloss cx={262} cy={520} rx={14} ry={30} rot={-8} o={0.25} />
      <Gloss cx={240} cy={700} rx={16} ry={50} rot={18} o={0.2} />
    </g>
  );
}

function TopCamiseta({ palette: p, idp }: PartProps) {
  const o = outline(p);
  return (
    <g>
      <defs><LinGrad id={idp('t')} p={p} dir="h" /></defs>
      <path d="M282 434C260 440 226 440 210 452C196 470 184 500 186 522L214 528C218 512 222 502 228 494C232 532 236 572 236 614L364 614C364 572 368 532 372 494C378 502 382 512 386 528L414 522C416 500 404 470 390 452C374 440 340 440 318 434Q300 452 282 434Z"
        fill={`url(#${idp('t')})`} stroke={o} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M282 434Q300 452 318 434" stroke={p.light} strokeWidth={5} fill="none" />
      <path d={shapePath('corazon', 300, 520, 26)} fill="#fff" stroke={o} strokeWidth={2.5} />
      <path d={shapePath('corazon', 300, 520, 16)} fill={p.accent ?? p.light} />
      <Gloss cx={258} cy={490} rx={10} ry={24} o={0.25} />
    </g>
  );
}

function SkirtTablas({ palette: p, idp }: PartProps) {
  const o = outline(p);
  return (
    <g>
      <defs><LinGrad id={idp('s')} p={p} /></defs>
      <path d="M238 596L362 596C380 650 396 700 406 742C340 764 260 764 194 742C204 700 220 650 238 596Z" fill={`url(#${idp('s')})`} stroke={o} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M262 600L236 752M286 602L276 758M314 602L324 758M338 600L364 752" stroke={p.shade} strokeWidth={3} opacity={0.55} />
      <path d="M236 596L364 596L364 614L236 614Z" fill={p.shade} />
      <Gloss cx={252} cy={660} rx={8} ry={34} rot={12} o={0.3} />
    </g>
  );
}

function JacketMezclilla({ palette: p, idp }: PartProps) {
  const o = outline(p);
  const L = 'M282 432C258 438 226 440 210 452C196 470 186 520 184 560L182 636L204 640C206 600 212 560 216 528C222 560 228 600 230 630L282 632C276 580 270 520 282 468Z';
  const R = 'M318 432C342 438 374 440 390 452C404 470 414 520 416 560L418 636L396 640C394 600 388 560 384 528C378 560 372 600 370 630L318 632C324 580 330 520 318 468Z';
  return (
    <g>
      <defs><LinGrad id={idp('j')} p={p} dir="d" /></defs>
      <path d={L} fill={`url(#${idp('j')})`} stroke={o} strokeWidth={3.5} strokeLinejoin="round" />
      <path d={R} fill={`url(#${idp('j')})`} stroke={o} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M282 432L262 470L282 486ZM318 432L338 470L318 486Z" fill={p.light} stroke={o} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M240 500L276 500M324 500L360 500" stroke={p.light} strokeWidth={3} strokeDasharray="5 5" />
      <path d="M182 620L204 624M396 624L418 620" stroke={p.light} strokeWidth={6} />
      <circle cx={272} cy={540} r={5} fill={p.accent ?? '#ffd23f'} stroke={o} strokeWidth={1.5} />
      <circle cx={272} cy={580} r={5} fill={p.accent ?? '#ffd23f'} stroke={o} strokeWidth={1.5} />
      <Gloss cx={232} cy={480} rx={8} ry={22} o={0.3} />
    </g>
  );
}

function ShoesFlats({ palette: p, idp }: PartProps) {
  const o = outline(p);
  const shoe = (d: string, bx: number) => (
    <g>
      <path d={d} fill={`url(#${idp('sh')})`} stroke={o} strokeWidth={3} strokeLinejoin="round" />
      <path d={`M${bx - 10} 952l10 6 10-6-4 12-6-4-6 4z`} fill={p.light} stroke={o} strokeWidth={1.5} />
      <Gloss cx={bx - 6} cy={968} rx={8} ry={3} o={0.6} />
    </g>
  );
  return (
    <g>
      <defs><LinGrad id={idp('sh')} p={p} /></defs>
      {shoe('M258 936C252 950 244 962 242 974C248 990 288 990 292 974C292 960 288 946 288 936Q273 944 258 936Z', 268)}
      {shoe('M342 936C348 950 356 962 358 974C352 990 312 990 308 974C308 960 312 946 312 936Q327 944 342 936Z', 332)}
    </g>
  );
}

export const referenceClothes: CatalogItem[] = [
  { id: 'dress-fiesta', slot: 'dress', kind: 'vestido', spokenName: 'vestido de fiesta', theme: 'fiesta',
    variants: [...variantsOf('rosa', 'morado', 'azul', 'rojo', 'amarillo'), variant('turquesa', '#22d3c5', 'azul', 'verde')],
    parts: { dress: DressFiesta }, suppresses: ['top', 'bottom'] },
  { id: 'top-camiseta', slot: 'top', kind: 'blusa', spokenName: 'blusa de corazón', theme: 'casual', shapeTag: 'corazon',
    variants: variantsOf('rojo', 'amarillo', 'verde', 'azul', 'blanco'), parts: { top: TopCamiseta } },
  { id: 'skirt-tablas', slot: 'bottom', kind: 'falda', spokenName: 'falda de tablas', theme: 'casual',
    variants: variantsOf('azul', 'rosa', 'morado', 'rojo', 'negro'), parts: { bottom: SkirtTablas } },
  { id: 'jacket-mezclilla', slot: 'outer', kind: 'chamarra', spokenName: 'chamarra', theme: 'casual',
    variants: [variant('mezclilla', '#4a7bd0', 'azul'), ...variantsOf('rosa', 'morado', 'negro')], parts: { outer: JacketMezclilla } },
  { id: 'shoes-flats', slot: 'shoes', kind: 'zapatos', spokenName: 'zapatos', theme: 'fiesta',
    variants: variantsOf('morado', 'rosa', 'rojo', 'amarillo', 'azul', 'blanco'), parts: { shoes: ShoesFlats } },
];
