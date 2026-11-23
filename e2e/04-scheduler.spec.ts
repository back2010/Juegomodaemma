import { test, expect, type Page } from '@playwright/test';
import { setup, enterSalon, advance, schedState, stored, openActivityViaScheduler } from './helpers';

const MIN = 60_000;
const sched = (o: Record<string, unknown> = {}) => ({ intervalMin: 10, durationMin: 2, mode: 'optional', reinviteMin: 3, ...o });

const hide = (page: Page, hidden: boolean) => page.evaluate((h) => {
  Object.defineProperty(document, 'visibilityState', { value: h ? 'hidden' : 'visible', configurable: true });
  document.dispatchEvent(new Event('visibilitychange'));
}, hidden);

test('7a. intervalo 10: no invita a 9:50 y sí a 10:05', async ({ page }) => {
  await setup(page, { scheduler: sched() });
  await enterSalon(page);
  await advance(page, 9 * MIN + 50_000);
  await expect(page.getByTestId('scheduler-invite')).toHaveCount(0);
  await advance(page, 15_000);
  await expect(page.getByTestId('invite-play')).toBeVisible({ timeout: 6000 });
});

test('7b. con la pestaña oculta no cuenta', async ({ page }) => {
  await setup(page, { scheduler: sched() });
  await enterSalon(page);
  await hide(page, true);
  await expect.poll(async () => ((await schedState(page)).pauseReasons as string[])).toContain('hidden');
  await advance(page, 11 * MIN);
  await expect(page.getByTestId('scheduler-invite')).toHaveCount(0);
  expect((await schedState(page)).elapsedMs as number).toBeLessThan(MIN);
  await hide(page, false);
  await expect.poll(async () => ((await schedState(page)).pauseReasons as string[])).not.toContain('hidden');
});

test('7c. intervalo desactivado no invita', async ({ page }) => {
  await setup(page, { scheduler: sched({ intervalMin: 0 }) });
  await enterSalon(page);
  await advance(page, 40 * MIN);
  await page.waitForTimeout(2000);
  await expect(page.getByTestId('scheduler-invite')).toHaveCount(0);
  expect((await schedState(page)).status).toBe('disabled');
});

test('8. modo opcional: jugar/seguir; seguir vuelve sin bloquear y re-invita', async ({ page }) => {
  await setup(page, { scheduler: sched() });
  await enterSalon(page);
  await openActivityViaScheduler(page);
  await expect(page.getByTestId('invite-keep')).toBeVisible();
  await page.getByTestId('invite-keep').tap();
  await expect(page.getByTestId('scheduler-invite')).toHaveCount(0);
  // el juego sigue usable
  await page.getByTestId('tab-hair').tap();
  await expect(page.getByTestId('tab-hair')).toHaveClass(/selected/);
  expect((await schedState(page)).phase).toBe('cooldown');
  await advance(page, 2 * MIN + 50_000);
  await expect(page.getByTestId('scheduler-invite')).toHaveCount(0);
  await advance(page, 15_000);
  await expect(page.getByTestId('invite-play')).toBeVisible({ timeout: 6000 });
});

test('9a. estado de la muñeca/pantalla/pestaña se conserva tras una actividad', async ({ page }) => {
  await setup(page, { scheduler: sched() });
  await enterSalon(page);
  await page.getByTestId('tab-accessories').tap();
  const tile = page.locator('[data-testid="item-grid"] [data-testid^="tile-"]:not([data-testid="tile-none"])').first();
  await tile.tap();
  const dolls0 = await stored(page, 'emma.dolls');
  await openActivityViaScheduler(page);
  await page.getByTestId('invite-play').tap();
  await expect(page.getByTestId('activity-session')).toBeVisible();
  await page.getByTestId('activity-exit').tap();
  await expect(page.getByTestId('scheduler-activity')).toHaveCount(0);
  await expect(page.getByTestId('stage')).toBeVisible();
  const dolls1 = await stored(page, 'emma.dolls');
  expect(dolls1).toEqual(dolls0);
  await expect(page.getByTestId('tab-accessories')).toHaveClass(/selected/);
});

test('9b. modo obligatorio: sin invite-keep ni activity-exit', async ({ page }) => {
  await setup(page, { scheduler: sched({ mode: 'mandatory' }) });
  await enterSalon(page);
  await openActivityViaScheduler(page);
  await expect(page.getByTestId('invite-keep')).toHaveCount(0);
  await page.getByTestId('invite-play').tap();
  await expect(page.getByTestId('activity-session')).toBeVisible();
  await expect(page.getByTestId('activity-exit')).toHaveCount(0);
});
