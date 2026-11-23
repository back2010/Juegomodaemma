import { test, expect } from '@playwright/test';
import { setup, enterSalon, start, spoken } from './helpers';

const CATS = ['colores', 'figuras', 'numeros', 'memoria', 'patrones', 'clasificacion'];

test.describe('5. actividades', () => {
  for (const c of CATS) {
    test(`categoría ${c} abre una sesión`, async ({ page }) => {
      await setup(page);
      await start(page);
      await page.getByTestId('go-learning').tap();
      await expect(page.getByTestId('learning-hub')).toBeVisible();
      await page.getByTestId(`learn-cat-${c}`).tap();
      await expect(page.getByTestId('activity-session')).toBeVisible();
      await page.getByTestId('activity-exit').tap();
      await expect(page.getByTestId('learning-hub')).toBeVisible();
    });
  }

  test('completar color-find vuelve al hub', async ({ page }) => {
    const now = Date.now() + 3_600_000;
    await setup(page, { learning: { v: 1, history: [], perActivity: { 'color-bucket': { level: 1, streak: 0, struggle: 0, plays: 1, lastPlayed: now } } } });
    await start(page);
    await page.getByTestId('go-learning').tap();
    await page.getByTestId('learn-cat-colores').tap();
    const session = page.getByTestId('activity-session');
    await expect(session).toHaveAttribute('data-activity', 'color-find');
    const total = Number(await session.getAttribute('data-total'));
    for (let i = 0; i < total; i++) {
      await expect(session).toHaveAttribute('data-round', String(i));
      await expect(session).toHaveAttribute('data-phase', 'play');
      await page.locator('[data-answer="yes"]').first().tap();
    }
    await expect(page.getByTestId('learning-hub')).toBeVisible({ timeout: 15_000 });
  });
});

test.describe('6. voz', () => {
  test('instrucciones al entrar al salón y repetir', async ({ page }) => {
    await setup(page);
    await enterSalon(page);
    await expect.poll(async () => (await spoken(page)).length).toBeGreaterThan(0);
    const n = (await spoken(page)).length;
    await page.getByTestId('tab-hair').tap();
    await expect.poll(async () => (await spoken(page)).length).toBeGreaterThan(n);
    const m = (await spoken(page)).length;
    await page.getByTestId('repeat-voice').tap();
    await expect.poll(async () => (await spoken(page)).length).toBeGreaterThan(m);
    // repetir la última instrucción: una variante de la frase del peinado
    expect(['Elige tu peinado favorito', '¿Cómo la peinamos hoy?']).toContain((await spoken(page)).at(-1));
  });

  test('instrucción al iniciar una actividad y repetir', async ({ page }) => {
    await setup(page);
    await start(page);
    await page.getByTestId('go-learning').tap();
    const n = (await spoken(page)).length;
    await page.getByTestId('learn-cat-colores').tap();
    await expect(page.getByTestId('activity-session')).toBeVisible();
    await expect.poll(async () => (await spoken(page)).length).toBeGreaterThan(n);
    const last = (await spoken(page)).at(-1);
    const m = (await spoken(page)).length;
    await page.getByTestId('activity-repeat').tap();
    await expect.poll(async () => (await spoken(page)).length).toBeGreaterThan(m);
    // la repetición dice de nuevo una instrucción (puede ser otra variante de la misma frase)
    expect((await spoken(page)).at(-1)).toBeTruthy();
    expect(last).toBeTruthy();
  });
});
