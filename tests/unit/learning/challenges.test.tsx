import { act, cleanup, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import type { CatalogItem, DollLook, StickerDef } from '@/types';
import { variantsOf } from '@/art/kit';
import { catalog } from '@/catalog/registry';
import { makeRng } from '@/learning/kit/rng';
import {
  type Challenge, type ChallengeCatalog, challengeSpeech, feasibleChallenges, generateChallenge, isChallengeMet,
} from '@/components/Challenges/engine';
import { ChallengeBubble } from '@/components/Challenges/ChallengeBubble';
import { useDolls, defaultLookFor, selectCurrentLook } from '@/store/dollStore';
import { useGame } from '@/store/gameStore';
import { useSettings } from '@/store/settingsStore';

vi.mock('@/audio', async () => (await import('./audioMock')).audioMock());

const P = () => null;
const items: CatalogItem[] = [
  { id: 'v1', slot: 'dress', kind: 'vestido', spokenName: 'v', theme: 'casual', variants: variantsOf('rojo', 'azul', 'rosa'), parts: {}, suppresses: ['top', 'bottom'] },
  { id: 'z1', slot: 'shoes', kind: 'zapatos', spokenName: 'z', theme: 'casual', variants: variantsOf('amarillo', 'negro', 'blanco'), parts: {} },
  { id: 'a1', slot: 'earrings', kind: 'aretes', spokenName: 'a', theme: 'casual', shapeTag: 'circulo', count: 2, variants: variantsOf('azul', 'rosa', 'verde'), parts: {} },
  { id: 'c1', slot: 'necklace', kind: 'collar', spokenName: 'c', theme: 'casual', shapeTag: 'corazon', count: 1, variants: variantsOf('rojo', 'rosa', 'morado'), parts: {} },
  { id: 'b1', slot: 'top', kind: 'blusa', spokenName: 'b', theme: 'casual', variants: variantsOf('verde', 'rojo', 'azul'), parts: {} },
  { id: 'x1', slot: 'bag', kind: 'cosa-rara', spokenName: 'x', theme: 'casual', shapeTag: 'estrella', variants: variantsOf('verde', 'rojo', 'azul'), parts: {} },
  { id: 'solo', slot: 'hat', kind: 'sombrero', spokenName: 's', theme: 'casual', variants: variantsOf('naranja', 'cafe', 'azul'), parts: {}, compat: { dolls: ['otra'] } },
];
const stickers: StickerDef[] = [{ id: 'st1', shapeTag: 'estrella', colorTag: 'amarillo', Part: P }];
const cat: ChallengeCatalog = {
  items, stickers, item: (id) => items.find((i) => i.id === id), sticker: (id) => stickers.find((s) => s.id === id),
};
const base = (): DollLook => ({ dollId: 'sofi', hair: { styleId: 'h', color: { mode: 'rainbow' } }, makeup: {}, outfit: {}, stickers: [] });

/** Construye un look que cumple el reto usando solo el catálogo: prueba de factibilidad. */
function solve(c: Challenge, look: DollLook, k: ChallengeCatalog): DollLook | null {
  const l = structuredClone(look);
  if (c.type === 'sticker') {
    const st = k.stickers.find((s) => s.shapeTag === c.shape);
    if (!st) return null;
    for (let i = 0; i < c.n; i++) l.stickers.push({ uid: `u${i}`, stickerId: st.id, x: 0, y: 0, scale: 1, rot: 0, zone: c.zone });
    return l;
  }
  const ok = (i: CatalogItem) => !i.compat?.dolls || i.compat.dolls.includes(l.dollId);
  for (const i of k.items.filter(ok)) {
    for (const v of i.variants) {
      const hit = c.type === 'itemColor' ? i.kind === c.kind && v.colorTags.includes(c.color)
        : c.type === 'itemShape' ? i.kind === c.kind && i.shapeTag === c.shape
          : c.type === 'accShape' ? i.shapeTag === c.shape && ['necklace', 'earrings', 'bracelet', 'ring', 'glasses', 'hairAcc', 'hat', 'bag'].includes(i.slot)
            : i.kind === c.kind && i.count === c.n;
      if (hit) { l.outfit = { [i.slot]: { itemId: i.id, variantId: v.id } }; return l; }
    }
  }
  return null;
}

describe('generador de retos', () => {
  it('solo produce retos factibles y no cumplidos (catálogo de prueba)', () => {
    const look = base();
    const all = feasibleChallenges(look, cat);
    expect(all.length).toBeGreaterThan(5);
    for (const c of all) {
      expect(isChallengeMet(c, look, cat)).toBe(false);
      const solved = solve(c, look, cat);
      expect(solved).not.toBeNull();
      expect(isChallengeMet(c, solved!, cat)).toBe(true);
    }
    // kinds sin palabra hablada y prendas incompatibles con la muñeca no generan retos
    expect(all.some((c) => 'kind' in c && (c.kind === 'cosa-rara' || c.kind === 'sombrero'))).toBe(false);
    // colores inexistentes para un kind nunca aparecen
    expect(all.some((c) => c.type === 'itemColor' && c.kind === 'zapatos' && c.color === 'rojo')).toBe(false);
  });

  it('cubre los tipos pedidos (color, figura de accesorio, stickers en el cabello)', () => {
    const all = feasibleChallenges(base(), cat);
    expect(all).toContainEqual({ type: 'itemColor', kind: 'vestido', slot: 'dress', color: 'rojo' });
    expect(all).toContainEqual({ type: 'itemColor', kind: 'zapatos', slot: 'shoes', color: 'amarillo' });
    expect(all).toContainEqual({ type: 'itemShape', kind: 'aretes', slot: 'earrings', shape: 'circulo' });
    expect(all).toContainEqual({ type: 'accShape', shape: 'corazon' });
    expect(all).toContainEqual({ type: 'sticker', shape: 'estrella', zone: 'hair', n: 3 });
  });

  it('generateChallenge devuelve siempre uno de los factibles; null si no hay', () => {
    const look = base();
    const all = feasibleChallenges(look, cat).map((c) => JSON.stringify(c));
    for (let s = 1; s < 60; s++) {
      const c = generateChallenge(look, cat, makeRng(s));
      expect(all).toContain(JSON.stringify(c));
    }
    const empty: ChallengeCatalog = { items: [], stickers: [], item: () => undefined, sticker: () => undefined };
    expect(generateChallenge(look, empty, makeRng(1))).toBeNull();
  });

  it('con el catálogo real todos los retos son resolubles', () => {
    const look = defaultLookFor(catalog.dolls[0].id);
    for (const c of feasibleChallenges(look, catalog)) {
      const solved = solve(c, look, catalog);
      expect(solved, JSON.stringify(c)).not.toBeNull();
      expect(isChallengeMet(c, solved!, catalog)).toBe(true);
    }
  });

  it('frases con concordancia', () => {
    expect(challengeSpeech({ type: 'itemColor', kind: 'vestido', slot: 'dress', color: 'rojo' }).params.what).toBe('un vestido rojo');
    expect(challengeSpeech({ type: 'itemColor', kind: 'zapatos', slot: 'shoes', color: 'amarillo' }).params.what).toBe('zapatos amarillos');
    expect(challengeSpeech({ type: 'itemShape', kind: 'aretes', slot: 'earrings', shape: 'circulo' }).params.what).toBe('aretes circulares');
    expect(challengeSpeech({ type: 'sticker', shape: 'estrella', zone: 'hair', n: 3 }).params.what).toBe('tres estrellas');
  });
});

describe('verificación de cumplimiento', () => {
  it('color, figura, ocultos por suppresses y stickers por zona', () => {
    const l = base();
    l.outfit.dress = { itemId: 'v1', variantId: 'rojo' };
    expect(isChallengeMet({ type: 'itemColor', kind: 'vestido', slot: 'dress', color: 'rojo' }, l, cat)).toBe(true);
    expect(isChallengeMet({ type: 'itemColor', kind: 'vestido', slot: 'dress', color: 'azul' }, l, cat)).toBe(false);
    l.outfit.top = { itemId: 'b1', variantId: 'verde' }; // oculto por el vestido
    expect(isChallengeMet({ type: 'itemColor', kind: 'blusa', slot: 'top', color: 'verde' }, l, cat)).toBe(false);
    l.outfit.earrings = { itemId: 'a1', variantId: 'azul' };
    expect(isChallengeMet({ type: 'itemShape', kind: 'aretes', slot: 'earrings', shape: 'circulo' }, l, cat)).toBe(true);
    const star = (zone: 'hair' | 'face', i: number) => ({ uid: `s${zone}${i}`, stickerId: 'st1', x: 0, y: 0, scale: 1, rot: 0, zone });
    l.stickers = [star('hair', 1), star('hair', 2), star('face', 3)];
    const ch: Challenge = { type: 'sticker', shape: 'estrella', zone: 'hair', n: 3 };
    expect(isChallengeMet(ch, l, cat)).toBe(false);
    l.stickers.push(star('hair', 4));
    expect(isChallengeMet(ch, l, cat)).toBe(true);
  });
});

describe('ChallengeBubble', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    const id = catalog.dolls[0].id;
    useDolls.setState({ selectedDollId: id, looks: { [id]: defaultLookFor(id) } });
    useGame.setState({ overlay: 'none' });
    useSettings.getState().updateGame({ salonChallenges: true, idlePauseSec: 9999 });
  });
  afterEach(() => { cleanup(); vi.useRealTimers(); });

  it('aparece tras el tiempo activo, se cumple con el look y desaparece', () => {
    render(<ChallengeBubble everyMs={5000} expireMs={60_000} />);
    expect(screen.queryByTestId('challenge-bubble')).toBeNull();
    act(() => { vi.advanceTimersByTime(6000); });
    const bubble = screen.getByTestId('challenge-bubble');
    expect(bubble.dataset.met).toBe('no');
    // Resolver el reto mostrado
    const l = selectCurrentLook(useDolls.getState());
    const shown = feasibleChallenges(l, catalog).filter((c) => c.type === bubble.dataset.type);
    expect(shown.length).toBeGreaterThan(0);
    // Probar todos los candidatos del tipo hasta que la burbuja quede cumplida
    for (const c of shown) {
      const solved = solve(c, l, catalog)!;
      act(() => { useDolls.getState().loadLook(solved); });
      if (screen.queryByTestId('challenge-bubble')?.dataset.met === 'yes') break;
    }
    expect(screen.getByTestId('challenge-bubble').dataset.met).toBe('yes');
    act(() => { vi.advanceTimersByTime(3000); });
    expect(screen.queryByTestId('challenge-bubble')).toBeNull();
  });

  it('caduca sin cumplirse', () => {
    render(<ChallengeBubble everyMs={2000} expireMs={10_000} />);
    act(() => { vi.advanceTimersByTime(3000); });
    expect(screen.getByTestId('challenge-bubble')).toBeTruthy();
    act(() => { vi.advanceTimersByTime(11_000); });
    expect(screen.queryByTestId('challenge-bubble')).toBeNull();
  });

  it('no aparece con overlay abierto ni con el ajuste desactivado', () => {
    useGame.setState({ overlay: 'activity' });
    render(<ChallengeBubble everyMs={2000} />);
    act(() => { vi.advanceTimersByTime(10_000); });
    expect(screen.queryByTestId('challenge-bubble')).toBeNull();
    act(() => { useGame.setState({ overlay: 'none' }); useSettings.getState().updateGame({ salonChallenges: false }); });
    act(() => { vi.advanceTimersByTime(10_000); });
    expect(screen.queryByTestId('challenge-bubble')).toBeNull();
  });
});
