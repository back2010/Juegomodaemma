/** Iconos y colores de las 6 categorías del hub (sin texto). */
import type { FC } from 'react';
import type { LearningCategory } from '@/types';
import { BRAND, GemShape, makePalette, paletteOf, useIdp } from '@/art/kit';
import { CardBack, ColorBlob, Fruit, Garment } from './kit/art';

function Colores() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <g transform="translate(2 6) scale(0.52)"><ColorBlob color="rojo" size={100} /></g>
      <g transform="translate(46 6) scale(0.52)"><ColorBlob color="azul" size={100} /></g>
      <g transform="translate(24 46) scale(0.52)"><ColorBlob color="amarillo" size={100} /></g>
    </svg>
  );
}

function Figuras() {
  const idp = useIdp('cfg');
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <GemShape shape="triangulo" cx={30} cy={34} r={22} p={makePalette(BRAND.turquesa)} gid={idp('a')} />
      <GemShape shape="circulo" cx={72} cy={34} r={20} p={makePalette(BRAND.coral)} gid={idp('b')} />
      <GemShape shape="cuadrado" cx={30} cy={74} r={20} p={makePalette(BRAND.azul)} gid={idp('c')} />
      <GemShape shape="estrella" cx={72} cy={74} r={22} p={makePalette(BRAND.amarillo)} gid={idp('d')} />
    </svg>
  );
}

function Numeros() {
  const idp = useIdp('cnu');
  const p = makePalette('#ffffff');
  const dot = paletteOf('rojo');
  const pts = [[30, 30], [50, 50], [70, 70], [70, 30], [30, 70]];
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <GemShape shape="cuadrado" cx={50} cy={50} r={44} p={{ ...p, shade: '#e7d6f5' }} gid={idp('d')} />
      {pts.map(([x, y], i) => <GemShape key={i} shape="circulo" cx={x} cy={y} r={8} p={dot} gid={idp(`p${i}`)} stroke={false} />)}
    </svg>
  );
}

function Memoria() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <g transform="translate(6 12) rotate(-8 30 30) scale(0.56)"><CardBack size={100} /></g>
      <g transform="translate(36 30) rotate(8 30 30) scale(0.56)"><CardBack size={100} /></g>
    </svg>
  );
}

function Patrones() {
  const idp = useIdp('cpa');
  const seq = [BRAND.fucsia, BRAND.amarillo, BRAND.fucsia, BRAND.amarillo];
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M6 54q44-16 88 0" fill="none" stroke="#9b4dff" strokeWidth={4} strokeLinecap="round" />
      {seq.map((c, i) => (
        <GemShape key={i} shape={i % 2 ? 'estrella' : 'corazon'} cx={16 + i * 23} cy={50 - (i === 1 || i === 2 ? 4 : 0)} r={12}
          p={makePalette(c)} gid={idp(`s${i}`)} />
      ))}
    </svg>
  );
}

function Clasificacion() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <g transform="translate(6 4) scale(0.42)"><Fruit kind="manzana" size={100} /></g>
      <g transform="translate(52 4) scale(0.42)"><Garment slot="dress" color="morado" size={100} /></g>
      <path d="M12 56h76l-8 34H20z" fill="#ffd23f" stroke="#c99a1a" strokeWidth={3} strokeLinejoin="round" />
      <path d="M20 66h60M24 78h52" stroke="#c99a1a" strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}

export const CATEGORY_UI: Record<LearningCategory, { Icon: FC; color: string }> = {
  colores: { Icon: Colores, color: BRAND.fucsia },
  figuras: { Icon: Figuras, color: BRAND.turquesa },
  numeros: { Icon: Numeros, color: BRAND.azul },
  memoria: { Icon: Memoria, color: BRAND.morado },
  patrones: { Icon: Patrones, color: BRAND.amarillo },
  clasificacion: { Icon: Clasificacion, color: BRAND.verde },
};
