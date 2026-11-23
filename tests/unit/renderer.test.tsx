import { renderToStaticMarkup } from 'react-dom/server';
import { DollRenderer, suppressedSlots } from '@/art/DollRenderer';
import { LAYER_Z } from '@/art/layers';
import { defaultLookFor } from '@/store/dollStore';
import type { DollLook, LayerId } from '@/types';

const full = (): DollLook => ({
  ...defaultLookFor('sofi'),
  makeup: {
    lips: { styleId: 'lips-classic', color: '#e8263b', colorTag: 'rojo', intensity: 1 },
    brows: { styleId: 'brows-natural', color: '#4a2c1d', colorTag: 'cafe', intensity: 1 },
  },
  outfit: {
    dress: { itemId: 'dress-fiesta', variantId: 'rosa' }, top: { itemId: 'top-camiseta', variantId: 'rojo' },
    shoes: { itemId: 'shoes-flats', variantId: 'rosa' }, earrings: { itemId: 'earrings-circulo', variantId: 'azul' },
    hat: { itemId: 'hat-sol', variantId: 'azul' }, bag: { itemId: 'bag-cuadrada', variantId: 'rosa' },
  },
  stickers: [{ uid: 'a', stickerId: 'st-estrella-amarilla', x: 300, y: 150, scale: 1, rot: 0, zone: 'hair' }],
});

function layers(html: string): LayerId[] {
  return [...html.matchAll(/data-layer="(\w+)"/g)].map((m) => m[1] as LayerId);
}

describe('DollRenderer', () => {
  it('dibuja las capas en orden z ascendente', () => {
    const ls = layers(renderToStaticMarkup(<DollRenderer look={full()} idPrefix="t" />));
    const zs = ls.map((l) => LAYER_Z[l]);
    expect(zs).toEqual([...zs].sort((a, b) => a - b));
    expect(ls[0]).toBe('hairBack');
    expect(ls.at(-1)).toBe('stickers');
    expect(ls.indexOf('face')).toBeLessThan(ls.indexOf('makeup'));
    expect(ls.indexOf('makeup')).toBeLessThan(ls.indexOf('hairFront'));
  });

  it('el vestido oculta la blusa sin borrarla del look', () => {
    const look = full();
    expect(suppressedSlots(look).has('top')).toBe(true);
    const html = renderToStaticMarkup(<DollRenderer look={look} idPrefix="t" />);
    expect(html).not.toContain('data-item="top-camiseta"');
    expect(look.outfit.top?.itemId).toBe('top-camiseta');
    const { dress: _d, ...rest } = look.outfit;
    const html2 = renderToStaticMarkup(<DollRenderer look={{ ...look, outfit: rest }} idPrefix="t" />);
    expect(html2).toContain('data-item="top-camiseta"');
  });

  it('los ítems en pares se dibujan dos veces (izquierda y derecha espejada)', () => {
    const html = renderToStaticMarkup(<DollRenderer look={full()} idPrefix="t" />);
    expect(html.match(/scale\(-1 1\)/g)!.length).toBeGreaterThanOrEqual(2);
  });

  it('no usa foreignObject ni recursos externos (exportable a canvas)', () => {
    const html = renderToStaticMarkup(<DollRenderer look={full()} idPrefix="t" />);
    expect(html).not.toMatch(/foreignObject|<image|href="http/);
  });

  it('el filtro only limita las capas', () => {
    const ls = layers(renderToStaticMarkup(<DollRenderer look={full()} only={['head', 'face']} idPrefix="t" />));
    expect(new Set(ls)).toEqual(new Set(['head', 'face']));
  });
});
