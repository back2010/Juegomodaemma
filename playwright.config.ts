import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  workers: 4,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4300',
    trace: 'off',
    actionTimeout: 10_000,
  },
  projects: [{
    name: 'ipad-chromium',
    use: {
      browserName: 'chromium',
      viewport: { width: 1180, height: 820 },
      hasTouch: true,
      isMobile: true,
      reducedMotion: 'reduce',
      acceptDownloads: true,
    },
  }],
  webServer: {
    command: 'VITE_E2E=1 npx vite build --outDir dist-e2e && npx vite preview --outDir dist-e2e --port 4300',
    url: 'http://localhost:4300',
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
