import { applyRound, roundsFor } from '@/learning/kit/progression';
import { makeRng } from '@/learning/kit/rng';
import { NEW_PROGRESS } from '@/store/learningStore';

describe('roundsFor', () => {
  it('clamp(round(durationMin*60/estRoundSec), 2, 12)', () => {
    expect(roundsFor(3, 15)).toBe(12);
    expect(roundsFor(2, 35)).toBe(3);
    expect(roundsFor(3, 35)).toBe(5);
    expect(roundsFor(2, 100)).toBe(2);
    expect(roundsFor(5, 10)).toBe(12);
  });
});

describe('progresión silenciosa', () => {
  const P = { ...NEW_PROGRESS };
  it('3 rondas seguidas sin errores suben un nivel', () => {
    let p = applyRound(P, 0, 4); p = applyRound(p, 0, 4);
    expect(p.level).toBe(1);
    p = applyRound(p, 0, 4);
    expect(p.level).toBe(2);
    expect(p.streak).toBe(0);
  });
  it('un error rompe la racha', () => {
    let p = applyRound(P, 0, 4); p = applyRound(p, 0, 4); p = applyRound(p, 1, 4); p = applyRound(p, 0, 4);
    expect(p.level).toBe(1);
  });
  it('2 rondas con ≥2 errores bajan un nivel (mínimo 1)', () => {
    let p = applyRound({ ...P, level: 3 }, 2, 4);
    expect(p.level).toBe(3);
    p = applyRound(p, 1, 4);
    p = applyRound(p, 3, 4);
    expect(p.level).toBe(2);
    p = applyRound(applyRound({ ...P, level: 1 }, 2, 4), 2, 4);
    expect(p.level).toBe(1);
  });
  it('no supera maxLevel', () => {
    let p = { ...P, level: 4 };
    for (let i = 0; i < 6; i++) p = applyRound(p, 0, 4);
    expect(p.level).toBe(4);
  });
});

describe('rng con semilla', () => {
  it('es determinista', () => {
    const a = makeRng(42), b = makeRng(42);
    expect([a.next(), a.int(1, 6), a.shuffle([1, 2, 3, 4])]).toEqual([b.next(), b.int(1, 6), b.shuffle([1, 2, 3, 4])]);
    expect(makeRng(7).sample([1, 2, 3, 4, 5], 3)).toHaveLength(3);
  });
});
