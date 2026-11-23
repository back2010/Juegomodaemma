import { memo, type ReactNode } from 'react';
import type { DollLook, HairColor, LayerId, WearSlot } from '@/types';
import { LAYER_Z, MAKEUP_PLACEMENT, makeupZ } from './layers';
import { Placed, RainbowGrad, makePalette, paletteOf, useIdp, VIEWBOX } from './kit';
import { catalog } from '@/catalog/registry';

export interface DollRendererProps {
  look: DollLook;
  /** viewBox de recorte [x,y,w,h]; por defecto la muñeca completa. */
  crop?: [number, number, number, number];
  /** Si se indica, solo se dibujan estas capas (miniaturas). */
  only?: LayerId[];
  /** Renderizar como <svg> anidado dentro de otro SVG (foto). */
  nested?: { x: number; y: number; width: number; height: number };
  className?: string;
  /** Prefijo de ids estable (necesario para render estático múltiple). */
  idPrefix?: string;
  title?: string;
}

interface Node { z: number; key: string; layer: LayerId; el: ReactNode }

/** Resuelve qué slots quedan ocultos (sin borrarlos del look). */
export function suppressedSlots(look: DollLook): Set<WearSlot> {
  const out = new Set<WearSlot>();
  for (const eq of Object.values(look.outfit)) {
    const item = eq && catalog.item(eq.itemId);
    item?.suppresses?.forEach((s) => out.add(s));
    if (item?.slot === 'hat' && item.hairFit === 'compress') out.add('hairAcc');
  }
  return out;
}

function hairPaint(c: HairColor, id: string) {
  switch (c.mode) {
    case 'solid':
      return { fill: c.a, palette: makePalette(c.a), def: null };
    case 'gradient':
      return {
        fill: `url(#${id})`, palette: makePalette(c.a),
        def: (
          <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="120" x2="0" y2="760">
            <stop offset="0" stopColor={c.a} /><stop offset="1" stopColor={c.b} />
          </linearGradient>
        ),
      };
    case 'two':
      return {
        fill: `url(#${id})`, palette: makePalette(c.a),
        def: (
          <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="160" y1="0" x2="440" y2="0">
            <stop offset="0.5" stopColor={c.a} /><stop offset="0.5" stopColor={c.b} />
          </linearGradient>
        ),
      };
    case 'rainbow':
      return { fill: `url(#${id})`, palette: makePalette('#9b4dff'), def: <RainbowGrad id={id} /> };
  }
}

function DollRendererImpl({ look, crop, only, nested, className, idPrefix, title }: DollRendererProps) {
  const hook = useIdp('d');
  const idp = idPrefix ? (n: string) => `${idPrefix}-${n}` : hook;
  const doll = catalog.doll(look.dollId) ?? catalog.dolls[0];
  if (!doll) return null;
  const nodes: Node[] = [];
  const add = (layer: LayerId, key: string, el: ReactNode, z = LAYER_Z[layer]) => {
    if (only && !only.includes(layer)) return;
    nodes.push({ z, key, layer, el });
  };
  const skin = doll.skin;
  const suppressed = suppressedSlots(look);

  // Sombrero / cabello
  const hatEq = look.outfit.hat;
  const hat = hatEq && !suppressed.has('hat') ? catalog.item(hatEq.itemId) : undefined;
  const hair = catalog.hair(look.hair.styleId);
  const hp = hairPaint(look.hair.color, idp('hairfill'));
  const hatY = hair ? (hat?.hairFit === 'compress' ? Math.round(hair.hatOffsetY * 0.3) : hair.hatOffsetY) : 0;
  const top = doll.anchors.headTop.y;
  const compress = hat?.hairFit === 'compress' ? `translate(0 ${top}) scale(1 0.92) translate(0 ${-top})` : undefined;

  if (hair) {
    const hprops = { doll, palette: hp.palette, fill: hp.fill, idp: (n: string) => idp(`hb-${n}`) };
    add('hairBack', 'hairBack', <g transform={compress}><hair.Back {...hprops} /></g>);
    add('hairFront', 'hairFront', <g transform={compress}><hair.Front {...hprops} idp={(n) => idp(`hf-${n}`)} /></g>);
  }

  add('body', 'body', <doll.Body doll={doll} palette={skin} idp={(n) => idp(`b-${n}`)} />);
  add('hands', 'hands', <doll.Hands doll={doll} palette={skin} idp={(n) => idp(`h-${n}`)} />);
  add('head', 'head', <doll.Head doll={doll} palette={skin} idp={(n) => idp(`hd-${n}`)} />);
  add('face', 'face', <doll.Face doll={doll} palette={skin} idp={(n) => idp(`f-${n}`)} />);

  // Maquillaje
  for (const [kind, layer] of Object.entries(look.makeup)) {
    if (!layer) continue;
    const style = catalog.makeup(layer.styleId);
    if (!style) continue;
    const k = style.kind;
    const pal = makePalette(layer.color);
    const ip = (n: string) => idp(`m${k}-${n}`);
    add('makeup', `mk-${kind}`, (
      <g opacity={k === 'gloss' || k === 'sparkle' ? 1 : layer.intensity} data-makeup={k}>
        <Placed placement={style.placement ?? MAKEUP_PLACEMENT[k]} doll={doll}>
          <style.Part doll={doll} palette={pal} intensity={layer.intensity} idp={ip} />
        </Placed>
      </g>
    ), makeupZ(k));
  }

  // Prendas y accesorios
  for (const [slot, eq] of Object.entries(look.outfit) as [WearSlot, { itemId: string; variantId: string }][]) {
    if (!eq || suppressed.has(slot)) continue;
    const item = catalog.item(eq.itemId);
    if (!item) continue;
    const variant = item.variants.find((v) => v.id === eq.variantId) ?? item.variants[0];
    const lift = slot === 'hat' || slot === 'hairAcc' ? hatY : 0;
    for (const [layer, Part] of Object.entries(item.parts) as [LayerId, NonNullable<typeof item.parts[LayerId]>][]) {
      const ip = (n: string) => idp(`${item.id}-${layer}-${n}`);
      add(layer, `${slot}-${layer}`, (
        <g transform={lift ? `translate(0 ${lift})` : undefined} data-item={item.id}>
          <Placed placement={item.placement} doll={doll}>
            <Part doll={doll} palette={variant.palette} idp={ip} />
          </Placed>
        </g>
      ));
    }
  }

  // Stickers
  look.stickers.forEach((s, i) => {
    const def = catalog.sticker(s.stickerId);
    if (!def) return;
    add('stickers', `st-${s.uid}`, (
      <g transform={`translate(${s.x} ${s.y}) rotate(${s.rot}) scale(${s.scale})`} data-sticker={s.uid}>
        <def.Part doll={doll} palette={paletteOf(def.colorTag)} idp={(n) => idp(`st${i}-${n}`)} />
      </g>
    ), LAYER_Z.stickers + i * 0.001);
  });

  nodes.sort((a, b) => a.z - b.z); // Array.prototype.sort es estable
  const vb = crop ?? [0, 0, VIEWBOX.w, VIEWBOX.h];
  const content = (
    <>
      {hp.def && <defs>{hp.def}</defs>}
      {nodes.map((n) => <g key={n.key} data-layer={n.layer}>{n.el}</g>)}
    </>
  );
  if (nested) {
    return (
      <svg x={nested.x} y={nested.y} width={nested.width} height={nested.height} viewBox={vb.join(' ')} overflow="visible">
        {content}
      </svg>
    );
  }
  return (
    <svg className={className} viewBox={vb.join(' ')} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title ?? doll.spokenName}>
      {content}
    </svg>
  );
}

export const DollRenderer = memo(DollRendererImpl);
