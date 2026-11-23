/**
 * Stickers (P2): estrellas y corazones en varios colores, las 7 figuras y destellos.
 * Centrados en (0,0), radio ~40. El color lo da `paletteOf(colorTag)` del renderer.
 */
import type { ColorName, PartProps, ShapeName, StickerDef } from '@/types';
import { GemShape, Sparkle, shapePath, outline } from '@/art/kit';

const R: Record<ShapeName, number> = {
  circulo: 36, cuadrado: 40, triangulo: 40, rectangulo: 40, estrella: 40, corazon: 38, ovalo: 40,
};

const shapePart = (shape: ShapeName) =>
  function ShapeSticker({ palette, idp }: PartProps) {
    return <GemShape shape={shape} cx={0} cy={shape === 'triangulo' ? 2 : 0} r={R[shape]} p={palette} gid={idp('g')} />;
  };

/** Destello: estrella de 4 puntas con degradado y puntitos. */
function SparkleSticker({ palette: p, idp }: PartProps) {
  const d = 'M0 -40Q8 -9 40 0Q8 9 0 40Q-8 9 -40 0Q-8 -9 0 -40Z';
  return (
    <g>
      <defs>
        <radialGradient id={idp('g')} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor={p.light} /><stop offset="0.55" stopColor={p.main} /><stop offset="1" stopColor={p.shade} />
        </radialGradient>
      </defs>
      <path d={d} fill={`url(#${idp('g')})`} stroke={outline(p)} strokeWidth={3} strokeLinejoin="round" />
      <Sparkle x={0} y={0} r={11} fill="#fff" o={0.85} />
      <path d={shapePath('circulo', 24, -24, 3.5)} fill={p.light} stroke={outline(p)} strokeWidth={1.2} />
      <path d={shapePath('circulo', -26, 25, 2.6)} fill={p.light} stroke={outline(p)} strokeWidth={1} />
    </g>
  );
}

const mk = (shape: ShapeName, colors: ColorName[]): StickerDef[] =>
  colors.map((c) => ({ id: `st-${shape}-${c}`, shapeTag: shape, colorTag: c, Part: shapePart(shape) }));


const stickers: StickerDef[] = [
  { id: 'st-estrella-amarilla', shapeTag: 'estrella', colorTag: 'amarillo', Part: shapePart('estrella') },
  { id: 'st-corazon-rosa', shapeTag: 'corazon', colorTag: 'rosa', Part: shapePart('corazon') },
  ...mk('estrella', ['rojo', 'azul', 'verde', 'naranja', 'morado', 'rosa']),
  ...mk('corazon', ['rojo', 'azul', 'amarillo', 'verde', 'naranja', 'morado']),
  ...mk('circulo', ['rojo', 'azul', 'amarillo', 'verde', 'morado', 'rosa']),
  ...mk('cuadrado', ['rojo', 'azul', 'amarillo', 'verde', 'naranja', 'morado']),
  ...mk('triangulo', ['rojo', 'azul', 'amarillo', 'verde', 'naranja', 'morado']),
  ...mk('rectangulo', ['azul', 'verde', 'naranja', 'rosa', 'amarillo']),
  ...mk('ovalo', ['rojo', 'azul', 'verde', 'morado', 'naranja']),
  ...(['amarillo', 'rosa', 'azul', 'morado', 'blanco'] as ColorName[]).map((c): StickerDef => ({
    id: `st-destello-${c}`, shapeTag: 'estrella', colorTag: c, Part: SparkleSticker,
  })),
];
export default stickers;
