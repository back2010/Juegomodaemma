/** Miniaturas reutilizables (renderizan solo las capas necesarias, recortadas). */
import { memo } from 'react';
import type { CatalogItem, HairColor, MakeupKind, StickerDef } from '@/types';
import { DollRenderer } from '@/art/DollRenderer';
import { SLOT_THUMB } from '@/art/layers';
import { paletteOf, useIdp } from '@/art/kit';
import { defaultLookFor } from '@/store/dollStore';
import { catalog } from '@/catalog/registry';

const base = (dollId: string) => ({ ...defaultLookFor(dollId), makeup: {}, outfit: {}, stickers: [] });

export const ItemPreview = memo(function ItemPreview({ item, variantId, dollId }: { item: CatalogItem; variantId?: string; dollId: string }) {
  if (item.placement && item.placement !== 'abs') return <LocalItemPreview item={item} variantId={variantId} dollId={dollId} />;
  const look = { ...base(dollId), outfit: { [item.slot]: { itemId: item.id, variantId: variantId ?? item.variants[0].id } } };
  return <DollRenderer look={look} only={Object.keys(item.parts) as never} crop={item.thumb ?? SLOT_THUMB[item.slot]} title={item.spokenName} />;
});

/** Ítems anclados (aretes, pulseras, moños...): se dibuja una sola pieza en coordenadas locales. */
function LocalItemPreview({ item, variantId, dollId }: { item: CatalogItem; variantId?: string; dollId: string }) {
  const idp = useIdp('li');
  const doll = catalog.doll(dollId) ?? catalog.dolls[0];
  const v = item.variants.find((x) => x.id === variantId) ?? item.variants[0];
  return (
    <svg viewBox={(item.thumb ?? SLOT_THUMB[item.slot]).join(' ')} role="img" aria-label={item.spokenName}>
      {Object.entries(item.parts).map(([layer, Part]) => Part && <Part key={layer} doll={doll} palette={v.palette} idp={(n) => idp(`${layer}-${n}`)} />)}
    </svg>
  );
}

export const MAKEUP_CROP: Record<MakeupKind, [number, number, number, number]> = {
  brows: [176, 176, 248, 150], eyeshadow: [176, 190, 248, 150], liner: [176, 200, 248, 140], lashes: [176, 190, 248, 140],
  blush: [160, 230, 280, 160], freckles: [160, 230, 280, 160], lips: [236, 300, 128, 96], gloss: [236, 300, 128, 96],
  sparkle: [150, 150, 300, 200],
};

export const MakeupPreview = memo(function MakeupPreview({ kind, styleId, color, dollId }: { kind: MakeupKind; styleId: string; color: string; dollId: string }) {
  const look = { ...base(dollId), makeup: { [kind]: { styleId, color, colorTag: 'rosa' as const, intensity: 1 as const } } };
  return <DollRenderer look={look} only={['head', 'face', 'makeup']} crop={MAKEUP_CROP[kind]} />;
});

export const HairPreview = memo(function HairPreview({ styleId, color, dollId }: { styleId: string; color: HairColor; dollId: string }) {
  const look = { ...base(dollId), hair: { styleId, color } };
  return <DollRenderer look={look} only={['hairBack', 'head', 'face', 'hairFront']} crop={[100, 50, 400, 560]} />;
});

export const StickerPreview = memo(function StickerPreview({ def }: { def: StickerDef }) {
  const idp = useIdp('s');
  const doll = undefined as never; // los stickers no dependen de la muñeca
  return (
    <svg viewBox="-50 -50 100 100"><def.Part doll={doll} palette={paletteOf(def.colorTag)} idp={idp} /></svg>
  );
});
