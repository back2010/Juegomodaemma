/** Sombreros (coordenadas absolutas; DollRenderer los sube según hatOffsetY del peinado). Cabeza: x 168–432, tope y≈112. */
import type { CatalogItem, PartProps } from '@/types';
import { Gloss, GemShape, LinGrad, RadGrad, outline, variantsOf } from '@/art/kit';

function HatCap({ palette: p, idp }: PartProps) {
  const o = outline(p);
  return (
    <g strokeLinejoin="round">
      <defs>
        <LinGrad id={idp('d')} p={p} />
        <LinGrad id={idp('v')} p={{ main: p.shade, light: p.main, shade: p.shade }} />
      </defs>
      <path d="M194 142C192 70 240 46 300 46C360 46 408 70 406 142Q300 160 194 142Z" fill={`url(#${idp('d')})`} stroke={o} strokeWidth={3.5} />
      <path d="M300 48C282 80 282 118 288 152M300 48C318 80 318 118 312 152" stroke={p.shade} strokeWidth={2.2} fill="none" opacity={0.55} />
      <path d="M206 128Q300 150 394 128" stroke={p.shade} strokeWidth={3} fill="none" opacity={0.5} />
      <circle cx={300} cy={48} r={7} fill={p.main} stroke={o} strokeWidth={2.5} />
      <path d="M192 138Q300 170 408 138Q412 150 392 168Q300 224 208 168Q188 150 192 138Z" fill={`url(#${idp('v')})`} stroke={o} strokeWidth={3.5} />
      <path d="M206 150Q300 186 394 150" stroke={p.light} strokeWidth={2.4} fill="none" opacity={0.6} />
      <GemShape shape="estrella" cx={300} cy={104} r={21} p={{ main: '#fff0a0', light: '#ffffff', shade: '#e0b43a' }} gid={idp('s')} />
      <Gloss cx={248} cy={84} rx={20} ry={8} o={0.45} rot={-22} />
    </g>
  );
}

function HatParty({ palette: p, idp }: PartProps) {
  const o = outline(p);
  const cone = 'M224 138L316 24L380 126Q300 172 224 138Z';
  return (
    <g strokeLinejoin="round">
      <defs>
        <LinGrad id={idp('d')} p={p} dir="h" />
        <clipPath id={idp('c')}><path d={cone} /></clipPath>
        <RadGrad id={idp('pom')} p={{ main: '#fff0a0', light: '#ffffff', shade: '#e0b43a' }} />
      </defs>
      <path d={cone} fill={`url(#${idp('d')})`} stroke={o} strokeWidth={3.5} />
      <g clipPath={`url(#${idp('c')})`}>
        {[62, 92, 120].map((y, i) => <path key={i} d={`M200 ${y + 30}L400 ${y - 30}`} stroke="#fff" strokeOpacity={0.6} strokeWidth={8} />)}
        {[[302, 54], [290, 78], [330, 78], [268, 112], [346, 108], [310, 118]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={4.5} fill={i % 2 ? '#ffe27a' : '#fff'} opacity={0.9} />
        ))}
        <path d="M224 130Q300 164 380 118L380 140Q300 180 224 146Z" fill={p.shade} opacity={0.65} />
      </g>
      <path d={cone} fill="none" stroke={o} strokeWidth={3.5} />
      <Gloss cx={290} cy={72} rx={6} ry={22} o={0.35} rot={22} />
      <circle cx={316} cy={24} r={15} fill={`url(#${idp('pom')})`} stroke="#c99a2e" strokeWidth={2.5} />
      <Gloss cx={311} cy={19} rx={5} ry={3} o={0.8} />
    </g>
  );
}

function HatBeret({ palette: p, idp }: PartProps) {
  const o = outline(p);
  return (
    <g strokeLinejoin="round" transform="rotate(-5 300 100)">
      <defs><RadGrad id={idp('d')} p={p} cx={0.4} cy={0.25} r={0.85} /></defs>
      <path d="M180 132C176 82 238 56 304 58C372 60 428 86 422 132C416 156 190 160 180 132Z" fill={`url(#${idp('d')})`} stroke={o} strokeWidth={3.5} />
      <path d="M300 62C270 84 244 110 232 146M330 62C340 90 350 118 368 146M268 60C228 80 204 104 196 134" stroke={p.shade} strokeWidth={2.2} fill="none" opacity={0.45} strokeLinecap="round" />
      <path d="M186 138C230 156 370 158 418 138" stroke={p.shade} strokeWidth={4} fill="none" opacity={0.6} strokeLinecap="round" />
      <path d="M296 58C296 48 302 44 308 44C312 44 316 48 314 58Z" fill={p.main} stroke={o} strokeWidth={2.5} />
      <Gloss cx={252} cy={92} rx={24} ry={9} o={0.4} rot={-18} />
    </g>
  );
}

function HatBeanie({ palette: p, idp }: PartProps) {
  const o = outline(p);
  return (
    <g strokeLinejoin="round">
      <defs>
        <LinGrad id={idp('d')} p={p} />
        <RadGrad id={idp('pom')} p={{ main: '#ffffff', light: '#ffffff', shade: '#d9cfe6' }} />
      </defs>
      <path d="M186 138C182 64 240 42 300 42C360 42 418 64 414 138Z" fill={`url(#${idp('d')})`} stroke={o} strokeWidth={3.5} />
      <path d="M244 50C232 80 230 110 232 138M300 44L300 138M356 50C368 80 370 110 368 138" stroke={p.shade} strokeWidth={2} fill="none" opacity={0.4} />
      <path d="M180 122Q300 146 420 122L424 164Q300 190 176 164Z" fill={p.light} stroke={o} strokeWidth={3.5} />
      {[200, 228, 256, 284, 312, 340, 368, 396].map((x, i) => (
        <path key={i} d={`M${x} ${133 + (Math.abs(x - 300) < 1 ? 0 : 0)}L${x} ${172}`} stroke={p.main} strokeWidth={5} opacity={0.55} strokeLinecap="round" />
      ))}
      <circle cx={300} cy={34} r={26} fill={`url(#${idp('pom')})`} stroke="#bdb0d0" strokeWidth={2.5} />
      <path d="M284 24Q300 14 316 24M282 38Q300 48 318 38" stroke="#d9cfe6" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <Gloss cx={252} cy={80} rx={20} ry={8} o={0.4} rot={-22} />
    </g>
  );
}

export const hats: CatalogItem[] = [
  { id: 'hat-gorra', slot: 'hat', kind: 'gorra', spokenName: 'gorra', theme: 'deporte', hairFit: 'over', shapeTag: 'estrella', count: 1,
    variants: variantsOf('azul', 'rojo', 'verde', 'morado', 'naranja'), parts: { hat: HatCap } },
  { id: 'hat-fiesta', slot: 'hat', kind: 'sombrero de fiesta', spokenName: 'sombrero de fiesta', theme: 'fiesta', hairFit: 'over', shapeTag: 'triangulo', count: 1,
    variants: variantsOf('rosa', 'morado', 'azul', 'amarillo', 'verde'), parts: { hat: HatParty }, thumb: [180, 0, 240, 190] },
  { id: 'hat-boina', slot: 'hat', kind: 'boina', spokenName: 'boina', theme: 'casual', hairFit: 'compress',
    variants: variantsOf('rojo', 'rosa', 'azul', 'cafe', 'negro'), parts: { hat: HatBeret }, thumb: [140, 20, 320, 170] },
  { id: 'hat-gorro', slot: 'hat', kind: 'gorro', spokenName: 'gorro de lana', theme: 'casual', hairFit: 'compress',
    variants: variantsOf('rosa', 'azul', 'amarillo', 'verde', 'morado'), parts: { hat: HatBeanie }, thumb: [140, 0, 320, 200] },
];
