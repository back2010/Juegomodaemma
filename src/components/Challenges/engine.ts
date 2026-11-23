/**
 * ChallengeEngine (lógica pura): genera retos FACTIBLES para el salón a partir de los metadatos del
 * catálogo (kind, colorTags de variantes, shapeTag, count, stickers) y verifica si el look los cumple.
 */
import type { CatalogItem, ColorName, DollLook, ShapeName, StickerDef, StickerZone, WearSlot } from '@/types';
import type { Rng } from '@/learning/kit/rng';
import { type Noun, SHAPE_NOUN, article, colorAdj, numberWord, shapeAdj, shapePlural } from '@/learning/kit/words';

export interface ChallengeCatalog {
  items: CatalogItem[];
  stickers: StickerDef[];
  item(id: string): CatalogItem | undefined;
  sticker(id: string): StickerDef | undefined;
}

export type Challenge =
  | { type: 'itemColor'; kind: string; slot: WearSlot; color: ColorName }
  | { type: 'itemShape'; kind: string; slot: WearSlot; shape: ShapeName }
  | { type: 'accShape'; shape: ShapeName }
  | { type: 'itemCount'; kind: string; slot: WearSlot; n: number }
  | { type: 'sticker'; shape: ShapeName; zone: StickerZone; n: number };

/** Sustantivos hablados por `kind` del catálogo. Kinds sin entrada no generan retos de ese tipo. */
export const KIND_NOUNS: Record<string, Noun> = {
  vestido: { w: 'vestido', g: 'm', pl: false }, blusa: { w: 'blusa', g: 'f', pl: false },
  playera: { w: 'playera', g: 'f', pl: false }, camisa: { w: 'camisa', g: 'f', pl: false },
  falda: { w: 'falda', g: 'f', pl: false }, pantalon: { w: 'pantalón', g: 'm', pl: false },
  'pantalón': { w: 'pantalón', g: 'm', pl: false }, short: { w: 'short', g: 'm', pl: false },
  shorts: { w: 'shorts', g: 'm', pl: true }, chamarra: { w: 'chamarra', g: 'f', pl: false },
  abrigo: { w: 'abrigo', g: 'm', pl: false }, 'suéter': { w: 'suéter', g: 'm', pl: false },
  sueter: { w: 'suéter', g: 'm', pl: false }, capa: { w: 'capa', g: 'f', pl: false },
  zapatos: { w: 'zapatos', g: 'm', pl: true }, tenis: { w: 'tenis', g: 'm', pl: true },
  botas: { w: 'botas', g: 'f', pl: true }, sandalias: { w: 'sandalias', g: 'f', pl: true },
  aretes: { w: 'aretes', g: 'm', pl: true }, collar: { w: 'collar', g: 'm', pl: false },
  pulseras: { w: 'pulseras', g: 'f', pl: true }, pulsera: { w: 'pulsera', g: 'f', pl: false },
  anillo: { w: 'anillo', g: 'm', pl: false }, lentes: { w: 'lentes', g: 'm', pl: true },
  'moño': { w: 'moño', g: 'm', pl: false }, diadema: { w: 'diadema', g: 'f', pl: false },
  pasador: { w: 'pasador', g: 'm', pl: false }, broche: { w: 'broche', g: 'm', pl: false },
  sombrero: { w: 'sombrero', g: 'm', pl: false }, gorra: { w: 'gorra', g: 'f', pl: false },
  corona: { w: 'corona', g: 'f', pl: false }, tiara: { w: 'tiara', g: 'f', pl: false },
  bolsa: { w: 'bolsa', g: 'f', pl: false }, mochila: { w: 'mochila', g: 'f', pl: false },
  aros: { w: 'aros', g: 'm', pl: true }, boina: { w: 'boina', g: 'f', pl: false },
  brazaletes: { w: 'brazaletes', g: 'm', pl: true }, conjunto: { w: 'conjunto', g: 'm', pl: false },
  gorro: { w: 'gorro', g: 'm', pl: false }, leggings: { w: 'leggings', g: 'm', pl: true },
  'lentes de sol': { w: 'lentes de sol', g: 'm', pl: true }, 'moños': { w: 'moños', g: 'm', pl: true },
  'sombrero de fiesta': { w: 'sombrero de fiesta', g: 'm', pl: false }, 'traje de baño': { w: 'traje de baño', g: 'm', pl: false },
  'tutú': { w: 'tutú', g: 'm', pl: false }, zapatillas: { w: 'zapatillas', g: 'f', pl: true },
};

export const ACCESSORY_SLOTS: WearSlot[] = ['necklace', 'earrings', 'bracelet', 'ring', 'glasses', 'hairAcc', 'hat', 'bag'];

const fits = (i: CatalogItem, dollId: string) => !i.compat?.dolls || i.compat.dolls.includes(dollId);

/** Prendas puestas y visibles (sin las ocultas por `suppresses`). */
export function wornItems(look: DollLook, cat: ChallengeCatalog): { item: CatalogItem; colors: ColorName[] }[] {
  const worn = Object.values(look.outfit).flatMap((o) => {
    const item = o && cat.item(o.itemId);
    if (!item) return [];
    const v = item.variants.find((x) => x.id === o.variantId) ?? item.variants[0];
    return [{ item, colors: v ? [...v.colorTags] : [] }];
  });
  const hidden = new Set(worn.flatMap((w) => w.item.suppresses ?? []));
  return worn.filter((w) => !hidden.has(w.item.slot));
}

export function isChallengeMet(c: Challenge, look: DollLook, cat: ChallengeCatalog): boolean {
  if (c.type === 'sticker') {
    return look.stickers.filter((s) => s.zone === c.zone && cat.sticker(s.stickerId)?.shapeTag === c.shape).length >= c.n;
  }
  return wornItems(look, cat).some(({ item, colors }) => {
    switch (c.type) {
      case 'itemColor': return item.kind === c.kind && colors.includes(c.color);
      case 'itemShape': return item.kind === c.kind && item.shapeTag === c.shape;
      case 'accShape': return ACCESSORY_SLOTS.includes(item.slot) && item.shapeTag === c.shape;
      case 'itemCount': return item.kind === c.kind && item.count === c.n;
    }
  });
}

/** Todos los retos posibles con el catálogo actual para la muñeca del look. */
export function feasibleChallenges(look: DollLook, cat: ChallengeCatalog): Challenge[] {
  const out: Challenge[] = [];
  const items = cat.items.filter((i) => fits(i, look.dollId) && KIND_NOUNS[i.kind]);
  const byKind = new Map<string, CatalogItem[]>();
  for (const i of items) byKind.set(i.kind, [...(byKind.get(i.kind) ?? []), i]);

  for (const [kind, list] of byKind) {
    const slot = list[0].slot;
    const colors = new Set(list.flatMap((i) => i.variants.flatMap((v) => v.colorTags)));
    for (const color of colors) out.push({ type: 'itemColor', kind, slot, color });
    const shapes = new Set(list.flatMap((i) => (i.shapeTag ? [i.shapeTag] : [])));
    for (const shape of shapes) out.push({ type: 'itemShape', kind, slot, shape });
    const counts = new Set(list.flatMap((i) => (i.count ? [i.count] : [])));
    // Solo si hay que elegir entre cantidades distintas y la palabra es plural ("dos pulseras").
    if (counts.size >= 2 && KIND_NOUNS[kind].pl) {
      for (const n of counts) if (n >= 2 && n <= 10) out.push({ type: 'itemCount', kind, slot, n });
    }
  }
  const accShapes = new Set(cat.items.filter((i) => fits(i, look.dollId) && ACCESSORY_SLOTS.includes(i.slot) && i.shapeTag).map((i) => i.shapeTag!));
  for (const shape of accShapes) out.push({ type: 'accShape', shape });
  const stickerShapes = new Set(cat.stickers.map((s) => s.shapeTag));
  for (const shape of stickerShapes) for (const n of [2, 3]) out.push({ type: 'sticker', shape, zone: 'hair', n });

  return out.filter((c) => !isChallengeMet(c, look, cat));
}

/** Elige un reto factible: primero el tipo (equiprobable), luego el reto. null si no hay ninguno. */
export function generateChallenge(look: DollLook, cat: ChallengeCatalog, rng: Rng, avoid?: Challenge | null): Challenge | null {
  let all = feasibleChallenges(look, cat);
  if (avoid && all.length > 1) all = all.filter((c) => JSON.stringify(c) !== JSON.stringify(avoid));
  if (!all.length) return null;
  const types = [...new Set(all.map((c) => c.type))];
  const t = rng.pick(types);
  return rng.pick(all.filter((c) => c.type === t));
}

function withArticle(n: Noun, phrase: string) {
  // Plurales sin artículo ("zapatos amarillos"); singulares con indefinido ("un vestido rojo").
  return n.pl ? phrase : `${article(n, false)} ${phrase}`;
}

/** Clave de voz y parámetros para decir el reto. */
export function challengeSpeech(c: Challenge): { key: string; params: Record<string, string> } {
  switch (c.type) {
    case 'itemColor': {
      const n = KIND_NOUNS[c.kind];
      return { key: 'ch.itemColor', params: { what: withArticle(n, `${n.w} ${colorAdj(c.color, n.g, n.pl)}`) } };
    }
    case 'itemShape': {
      const n = KIND_NOUNS[c.kind];
      return { key: 'ch.itemShape', params: { what: withArticle(n, `${n.w} ${shapeAdj(c.shape, n.g, n.pl)}`) } };
    }
    case 'accShape':
      return { key: 'ch.accShape', params: { shape: SHAPE_NOUN[c.shape].w } };
    case 'itemCount': {
      const n = KIND_NOUNS[c.kind];
      return { key: 'ch.itemCount', params: { what: `${numberWord(c.n, n.g)} ${n.w}` } };
    }
    case 'sticker': {
      const g = SHAPE_NOUN[c.shape].g;
      return { key: 'ch.sticker', params: { what: `${numberWord(c.n, g)} ${c.n === 1 ? SHAPE_NOUN[c.shape].w : shapePlural(c.shape)}` } };
    }
  }
}
