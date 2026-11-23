import { test, expect } from '@playwright/test';
import { setup, enterSalon, pickTile, stored, stageItems } from './helpers';

test.beforeEach(async ({ page }) => { await setup(page); await enterSalon(page); });

async function makeLookAndSnap(page: import('@playwright/test').Page) {
  await page.getByTestId('tab-clothes').tap();
  const cloth = await pickTile(page);
  await page.getByTestId('tab-makeup').tap();
  await pickTile(page);
  await page.getByTestId('go-photo').tap();
  await expect(page.getByTestId('photo-studio')).toBeVisible();
  await page.getByTestId('photo-snap').tap();
  await expect.poll(async () => (await stored(page, 'emma.game'))?.photo?.editingCreationId).toBeTruthy();
  return cloth;
}

test('4. foto -> galería con miniatura blob; duplicar; editar restaura; descargar', async ({ page }) => {
  const cloth = await makeLookAndSnap(page);
  await page.getByTestId('photo-gallery').tap();
  const cards = page.locator('[data-testid^="creation-"]:not([data-testid="creation-edit"]):not([data-testid="creation-duplicate"]):not([data-testid="creation-download"]):not([data-testid="creation-delete"]):not([data-testid="creation-close"])');
  await expect(cards).toHaveCount(1);
  await expect(cards.first().locator('img')).toHaveAttribute('src', /^blob:/);
  await cards.first().tap();
  await expect(page.getByTestId('gallery-viewer')).toBeVisible();
  // duplicar
  await page.getByTestId('creation-duplicate').tap();
  await page.getByTestId('creation-close').tap();
  await expect(cards).toHaveCount(2);
  // descargar
  await cards.first().tap();
  const [dl] = await Promise.all([page.waitForEvent('download'), page.getByTestId('creation-download').tap()]);
  expect(dl.suggestedFilename()).toMatch(/\.png$/);
  // editar restaura el look
  await page.getByTestId('creation-edit').tap();
  await expect(page.getByTestId('stage')).toBeVisible();
  expect(await stageItems(page)).toContain(cloth);
});

test('4b. descargar desde el estudio de fotos', async ({ page }) => {
  await page.getByTestId('go-photo').tap();
  const [dl] = await Promise.all([page.waitForEvent('download'), page.getByTestId('photo-download').tap()]);
  expect(dl.suggestedFilename()).toMatch(/\.png$/);
});

test('10. las creaciones y el look persisten tras recargar', async ({ page }) => {
  const cloth = await makeLookAndSnap(page);
  await page.reload();
  await page.getByTestId('start').tap();
  // el juego persiste la pantalla: seguimos en el estudio de fotos; ir a galería
  await page.getByTestId('nav-home').tap();
  await page.getByTestId('go-gallery').tap();
  await expect(page.getByTestId('gallery')).toBeVisible();
  await expect(page.locator('[data-testid^="creation-"] img').first()).toHaveAttribute('src', /^blob:/);
  await page.getByTestId('nav-home').tap();
  await page.getByTestId('doll-sofi').tap();
  await expect(page.getByTestId('stage')).toBeVisible({ timeout: 5000 });
  expect(await stageItems(page)).toContain(cloth);
});
