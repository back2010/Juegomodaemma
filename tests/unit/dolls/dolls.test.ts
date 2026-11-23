/** Paquete P1: muñecas. */
import dolls from '@/assets/dolls';
import { catalog } from '@/catalog/registry';
import { BASE_ANCHORS, hexToHsl } from '@/art/kit';
import type { AnchorName } from '@/types';

const FACE: AnchorName[] = ['eyeL', 'eyeR', 'browL', 'browR', 'cheekL', 'cheekR', 'nose', 'mouth'];

describe('muñecas (P1)', () => {
  it('hay 6 muñecas con ids y nombres únicos', () => {
    expect(dolls).toHaveLength(6);
    expect(new Set(dolls.map((d) => d.id)).size).toBe(6);
    expect(new Set(dolls.map((d) => d.spokenName)).size).toBe(6);
    expect(dolls.map((d) => d.id)).toContain('sofi');
  });

  it('anclajes dentro de ±10 px de BASE_ANCHORS', () => {
    for (const d of dolls) {
      for (const k of Object.keys(BASE_ANCHORS) as AnchorName[]) {
        const a = d.anchors[k], b = BASE_ANCHORS[k];
        expect(Math.abs(a.x - b.x), `${d.id}.${k}.x`).toBeLessThanOrEqual(10);
        expect(Math.abs(a.y - b.y), `${d.id}.${k}.y`).toBeLessThanOrEqual(10);
        if (!FACE.includes(k)) expect(a, `${d.id}.${k}`).toEqual(b);
      }
    }
  });

  it('tonos de piel distintos, de muy claro a muy oscuro', () => {
    const skins = dolls.map((d) => d.skin.main.toLowerCase());
    expect(new Set(skins).size).toBe(6);
    const L = dolls.map((d) => hexToHsl(d.skin.main)[2]).sort((a, b) => a - b);
    for (let i = 1; i < L.length; i++) expect(L[i] - L[i - 1]).toBeGreaterThan(0.03);
    expect(L[L.length - 1] - L[0]).toBeGreaterThan(0.45);
  });

  it('variedad de cara, ojos e iris', () => {
    expect(new Set(dolls.map((d) => d.faceShape)).size).toBe(3);
    expect(new Set(dolls.map((d) => d.eyes.shape)).size).toBe(3);
    expect(new Set(dolls.map((d) => d.eyes.iris.main)).size).toBe(6);
  });

  it('el look por defecto usa ids y variantes existentes', () => {
    const items = new Map(catalog.items.map((i) => [i.id, i]));
    const hair = new Set(catalog.hairStyles.map((h) => h.id));
    const makeup = new Set(catalog.makeupStyles.map((m) => m.id));
    for (const d of dolls) {
      expect(hair.has(d.defaultLook.hair.styleId), d.id).toBe(true);
      for (const m of Object.values(d.defaultLook.makeup)) expect(makeup.has(m!.styleId), `${d.id} ${m!.styleId}`).toBe(true);
      for (const [slot, w] of Object.entries(d.defaultLook.outfit)) {
        const it = items.get(w!.itemId);
        expect(it, `${d.id} ${w!.itemId}`).toBeDefined();
        expect(it!.slot).toBe(slot);
        expect(it!.variants.some((v) => v.id === w!.variantId), `${d.id} ${w!.itemId}:${w!.variantId}`).toBe(true);
      }
    }
  });

  it('looks distintos entre muñecas', () => {
    const sig = dolls.map((d) => JSON.stringify([d.defaultLook.hair.color, d.defaultLook.outfit]));
    expect(new Set(sig).size).toBe(6);
  });
});
