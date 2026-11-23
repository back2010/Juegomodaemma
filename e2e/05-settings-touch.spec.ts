import { test, expect } from '@playwright/test';
import { setup, enterSalon, start, openParent, stored, advance, schedState } from './helpers';

test('11. puerta parental y configuración se reflejan en settings y scheduler', async ({ page }) => {
  await setup(page);
  await enterSalon(page);
  await openParent(page);
  await page.getByTestId('interval-10').tap();
  await page.getByTestId('mode-mandatory').tap();
  await page.getByTestId('reinvite-10').tap();
  await page.getByTestId('cat-all').tap();           // apaga todas
  await page.getByTestId('cat-colores').tap();       // solo colores
  await expect.poll(async () => (await stored(page, 'emma.settings')).scheduler).toMatchObject({
    intervalMin: 10, mode: 'mandatory', reinviteMin: 10,
    categories: { colores: true, figuras: false, numeros: false, memoria: false, patrones: false, clasificacion: false },
  });
  await page.getByTestId('ps-exit').tap();
  await page.getByTestId('doll-sofi').tap();
  await expect(page.getByTestId('stage')).toBeVisible({ timeout: 5000 });
  expect((await schedState(page)).targetMs).toBe(10 * 60_000);
  await advance(page, 10 * 60_000 + 5_000);
  await expect(page.getByTestId('invite-play')).toBeVisible({ timeout: 6000 });
  await expect(page.getByTestId('invite-keep')).toHaveCount(0);
  await page.getByTestId('invite-play').tap();
  await expect(page.getByTestId('activity-session')).toHaveAttribute('data-activity', /color-/);
});

test('11b. respuesta incorrecta en la puerta no da acceso', async ({ page }) => {
  await setup(page);
  await start(page);
  await page.getByTestId('parent-lock').tap();
  await page.getByTestId('gate-hold').dispatchEvent('pointerdown');
  await expect(page.getByTestId('gate-question')).toBeVisible({ timeout: 6000 });
  await page.getByTestId('key-1').tap();
  await page.getByTestId('key-ok').tap();
  await expect(page.getByTestId('parent-settings')).toHaveCount(0);
});

test('12. botones >= 72px y sin scroll horizontal', async ({ page }) => {
  await setup(page);
  await start(page);
  const check = async (name: string) => {
    const bad = await page.evaluate(() => {
      const out: string[] = [];
      document.querySelectorAll('button, [role=button]').forEach((el) => {
        const e = el as HTMLElement;
        if (e.dataset.testid === 'parent-lock' || (e.dataset.testid ?? '').startsWith('swatch-')) return;
        const r = e.getBoundingClientRect();
        const cs = getComputedStyle(e);
        if (r.width === 0 || r.height === 0 || cs.visibility === 'hidden' || cs.display === 'none') return;
        if (e.closest('[inert]')) return;
        if (r.width < 72 || r.height < 72) out.push(`${e.dataset.testid ?? e.getAttribute('aria-label')} ${Math.round(r.width)}x${Math.round(r.height)}`);
      });
      return out;
    });
    expect(bad, `${name}: botones pequeños`).toEqual([]);
    const scroll = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(scroll, `${name}: scroll horizontal`).toBeLessThanOrEqual(0);
  };
  await page.getByTestId('start-gate').waitFor({ state: 'detached' });
  await check('inicio');
  await page.getByTestId('go-gallery').tap();
  await check('galería vacía');
  await page.getByTestId('nav-home').tap();
  await page.getByTestId('go-learning').tap();
  await expect(page.getByTestId('learning-hub')).toBeVisible();
  await check('aprender');
  await page.getByTestId('nav-home').tap();
  await page.getByTestId('doll-sofi').tap();
  await expect(page.getByTestId('stage')).toBeVisible({ timeout: 5000 });
  for (const t of ['clothes', 'makeup', 'hair', 'accessories', 'stickers']) {
    await page.getByTestId(`tab-${t}`).tap();
    await check(`salón/${t}`);
  }
  await page.getByTestId('go-photo').tap();
  await expect(page.getByTestId('photo-studio')).toBeVisible();
  await check('fotos');
});

// DEFECTO: las casillas de color (swatch-*) miden 64x64 (<72). Ver src/components/DollEditor/editor.css (.swatch).
test('12b. swatches de color >= 72px', async ({ page }) => {
  await setup(page);
  await enterSalon(page);
  await page.getByTestId('tab-clothes').tap();
  await page.locator('[data-testid="item-grid"] [data-testid^="tile-"]:not([data-testid="tile-none"])').first().tap();
  const sw = page.locator('[data-testid^="swatch-"]');
  await expect(sw.first()).toBeVisible();
  for (const b of await sw.all()) {
    const r = (await b.boundingBox())!;
    expect(r.width).toBeGreaterThanOrEqual(72);
    expect(r.height).toBeGreaterThanOrEqual(72);
  }
});
