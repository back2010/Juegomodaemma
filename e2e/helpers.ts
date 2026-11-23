import { expect, type Page } from '@playwright/test';

export const DOLLS = ['luna', 'mia', 'sofi', 'ana', 'zoe', 'nala'];

export const LAYER_Z: Record<string, number> = {
  hairBack: 10, itemBack: 15, body: 20, shoes: 30, bottom: 40, top: 45, dress: 50, outer: 55,
  necklace: 60, hands: 65, bracelet: 68, ring: 68.5, head: 70, earrings: 72, face: 74, makeup: 76,
  hairFront: 80, hairAcc: 84, glasses: 86, hat: 88, bag: 90, stickers: 95,
};

export interface BootOpts {
  scheduler?: Record<string, unknown>;
  game?: Record<string, unknown>;
  learning?: unknown;
}

/** Mock de speechSynthesis (registra textos en window.__spoken) + ajustes preconfigurados (solo si no existen). */
export async function setup(page: Page, o: BootOpts = {}) {
  await page.addInitScript((opts) => {
    const w = window as unknown as Record<string, unknown>;
    if (!w.__spoken) w.__spoken = [];
    const voice = { voiceURI: 'mock-es', name: 'Mock', lang: 'es-MX', localService: true, default: true };
    class Utt {
      text: string; voice: unknown; lang = ''; volume = 1; rate = 1; onend: (() => void) | null = null; onerror: (() => void) | null = null;
      constructor(t: string) { this.text = t; }
    }
    const synth = {
      speaking: false, pending: false, paused: false,
      getVoices: () => [voice],
      speak(u: Utt) {
        if (u.text) (w.__spoken as string[]).push(u.text);
        setTimeout(() => u.onend?.(), 20);
      },
      cancel() {}, pause() {}, resume() {},
      addEventListener() {}, removeEventListener() {},
    };
    Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
    (window as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = Utt;
    try {
      if (!localStorage.getItem('emma.settings') && (opts.scheduler || opts.game)) {
        localStorage.setItem('emma.settings', JSON.stringify({ state: { v: 1, scheduler: opts.scheduler ?? {}, game: opts.game ?? {} }, version: 1 }));
      }
      if (opts.learning && !localStorage.getItem('emma.learning')) {
        localStorage.setItem('emma.learning', JSON.stringify({ state: opts.learning, version: 1 }));
      }
    } catch { /* noop */ }
  }, o);
}

export async function start(page: Page) {
  await page.goto('/');
  await page.getByTestId('start').tap();
  await expect(page.getByTestId('doll-row')).toBeVisible();
}

export async function enterSalon(page: Page, doll = 'sofi') {
  await start(page);
  await page.getByTestId(`doll-${doll}`).tap();
  await expect(page.getByTestId('stage')).toBeVisible({ timeout: 5000 });
}

export const spoken = (page: Page) => page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken.slice());

export const stored = (page: Page, key: string) =>
  page.evaluate((k) => { const r = localStorage.getItem(k); return r ? JSON.parse(r).state : null; }, key);

export const stageSvg = (page: Page) => page.locator('[data-testid="stage"] svg.stage-doll, [data-testid="stage"] svg').first();

export const layersOf = (page: Page) => page.evaluate(() => {
  const svg = document.querySelector('[data-testid="stage"] svg')!;
  return Array.from(svg.querySelectorAll(':scope > g[data-layer]')).map((g) => g.getAttribute('data-layer')!);
});

export const stageItems = (page: Page) => page.evaluate(() =>
  Array.from(document.querySelectorAll('[data-testid="stage"] [data-item]')).map((e) => e.getAttribute('data-item')!));
export const stageMakeup = (page: Page) => page.evaluate(() =>
  Array.from(document.querySelectorAll('[data-testid="stage"] [data-makeup]')).map((e) => e.getAttribute('data-makeup')!));

/** Toca la primera casilla (no "none") de la rejilla actual cuyo testid no esté ya seleccionado; devuelve su id. */
export async function pickTile(page: Page, nth = 0): Promise<string> {
  const tiles = page.locator('[data-testid="item-grid"] [data-testid^="tile-"]:not([data-testid="tile-none"])');
  await expect(tiles.first()).toBeVisible();
  const t = tiles.nth(nth);
  const id = (await t.getAttribute('data-testid'))!.replace('tile-', '');
  await t.tap();
  return id;
}

export async function openActivityViaScheduler(page: Page) {
  await page.evaluate(() => (window as unknown as { __emma: { forceInvite(): void } }).__emma.forceInvite());
  await expect(page.getByTestId('invite-play')).toBeVisible();
}

export const schedState = (page: Page) =>
  page.evaluate(() => (window as unknown as { __emma: { getSchedulerState(): Record<string, unknown> } }).__emma.getSchedulerState());
export const advance = (page: Page, ms: number) =>
  page.evaluate((m) => (window as unknown as { __emma: { advanceScheduler(m: number): void } }).__emma.advanceScheduler(m), ms);

/** Puerta parental: mantener 3 s + suma. */
export async function openParent(page: Page) {
  await page.getByTestId('parent-lock').tap();
  const hold = page.getByTestId('gate-hold');
  await expect(hold).toBeVisible();
  await hold.dispatchEvent('pointerdown');
  await expect(page.getByTestId('gate-question')).toBeVisible({ timeout: 6000 });
  const q = (await page.getByTestId('gate-question').textContent())!;
  const [a, b] = q.split('+').map((x) => Number(x.trim()));
  for (const d of String(a + b)) await page.getByTestId(`key-${d}`).tap();
  await page.getByTestId('key-ok').tap();
  await expect(page.getByTestId('parent-settings')).toBeVisible();
}
