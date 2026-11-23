import type { ReactNode } from 'react';
import type { DollBase, Placement } from '@/types';

/** Aplica una Placement a un nodo (ver types/catalog.ts). */
export function Placed({ placement, doll, children }: { placement?: Placement; doll: DollBase; children: ReactNode }) {
  if (!placement || placement === 'abs') return <>{children}</>;
  if ('anchor' in placement) {
    const a = doll.anchors[placement.anchor];
    return <g transform={`translate(${a.x} ${a.y})`}>{children}</g>;
  }
  const [l, r] = placement.pair;
  const A = doll.anchors[l], B = doll.anchors[r];
  return (
    <>
      <g transform={`translate(${A.x} ${A.y})`}>{children}</g>
      <g transform={`translate(${B.x} ${B.y}) scale(-1 1)`}>{children}</g>
    </>
  );
}
