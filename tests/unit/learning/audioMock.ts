/** Mock compartido de '@/audio' para las pruebas de P5. Usar: vi.mock('@/audio', () => audioMock()). */
import { vi } from 'vitest';

export function audioMock() {
  const voice = { say: vi.fn(async () => {}), repeatLast: vi.fn(), stop: vi.fn(), unlock: vi.fn() };
  const sfx = { play: vi.fn() };
  return { voice, sfx, definePhrases: vi.fn(), phraseText: () => '', listVoices: () => [], testVoice: vi.fn() };
}
