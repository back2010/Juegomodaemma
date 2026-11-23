import { test, expect } from '@playwright/test';
import { setup, enterSalon, pickTile, stageItems, stageMakeup, layersOf, LAYER_Z } from './helpers';

test.beforeEach(async ({ page }) => { await setup(page); await enterSalon(page); });

test('1. personalizar ropa, maquillaje, cabello, accesorios y stickers se ve en el escenario', async ({ page }) => {
  // Ropa
  await page.getByTestId('tab-clothes').tap();
  const before = await stageItems(page);
  const cloth = await pickTile(page, 1);
  await expect.poll(() => stageItems(page)).toContain(cloth);
  expect(before).not.toContain(cloth);
  // Maquillaje
  await page.getByTestId('tab-makeup').tap();
  await page.getByTestId('subtab-lips').tap();
  await pickTile(page);
  await expect.poll(() => stageMakeup(page)).toContain('lips');
  // Cabello: cambia el estilo (cambia el SVG del pelo)
  await page.getByTestId('tab-hair').tap();
  const hairHtml = () => page.locator('[data-testid="stage"] svg').first().innerHTML();
  const h0 = await hairHtml();
  await pickTile(page, 1);
  await expect.poll(hairHtml).not.toBe(h0);
  // Accesorios
  await page.getByTestId('tab-accessories').tap();
  const acc = await pickTile(page);
  await expect.poll(() => stageItems(page)).toContain(acc);
  // Stickers: tocar una casilla de sticker lo añade al escenario
  await page.getByTestId('tab-stickers').tap();
  await expect(page.locator('[data-testid="stage"] [data-sticker]')).toHaveCount(0);
  await pickTile(page);
  await expect(page.locator('[data-testid="stage"] [data-sticker]').first()).toBeAttached();
});

test('2. el orden de capas data-layer es ascendente por z', async ({ page }) => {
  await page.getByTestId('tab-clothes').tap();
  await pickTile(page);
  await page.getByTestId('tab-makeup').tap();
  await pickTile(page);
  await page.getByTestId('tab-accessories').tap();
  await pickTile(page);
  await page.getByTestId('tab-stickers').tap();
  await pickTile(page);
  const layers = await layersOf(page);
  expect(layers.length).toBeGreaterThan(4);
  const zs = layers.map((l) => { expect(LAYER_Z[l], `capa desconocida ${l}`).toBeDefined(); return LAYER_Z[l]; });
  expect(zs).toEqual([...zs].sort((a, b) => a - b));
  expect(layers.indexOf('body')).toBeLessThan(layers.indexOf('makeup'));
  expect(layers[layers.length - 1]).toBe('stickers');
});

test('3. cambiar una categoría no borra las demás', async ({ page }) => {
  await page.getByTestId('tab-makeup').tap();
  await page.getByTestId('subtab-lips').tap();
  await pickTile(page);
  await page.getByTestId('tab-accessories').tap();
  const acc = await pickTile(page);
  await page.getByTestId('tab-hair').tap();
  await pickTile(page, 1);
  const hair = await page.locator('[data-testid="stage"] svg').first().innerHTML();
  // ahora una blusa/vestido/falda
  await page.getByTestId('tab-clothes').tap();
  await page.getByTestId('subtab-top').tap();
  const top = await pickTile(page);
  await expect.poll(() => stageItems(page)).toContain(top);
  expect(await stageMakeup(page)).toContain('lips');
  expect(await stageItems(page)).toContain(acc);
  const svg = await page.locator('[data-testid="stage"] svg').first().innerHTML();
  expect(svg).toContain('data-layer="hairFront"');
  expect(hair).toContain('data-layer="hairFront"');
});
