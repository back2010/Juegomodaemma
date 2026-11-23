import { act, fireEvent, render, screen } from '@testing-library/react';
import { ParentGate } from '@/components/ParentGate/ParentGate';
import { useGame } from '@/store/gameStore';

const hold = async (ms: number) => {
  fireEvent.pointerDown(screen.getByTestId('gate-hold'));
  await act(async () => { vi.advanceTimersByTime(ms); });
};
const answer = (n: number) => {
  for (const d of String(n)) fireEvent.click(screen.getByTestId(`key-${d}`));
  fireEvent.click(screen.getByTestId('key-ok'));
};
const sum = () => { const [a, b] = screen.getByTestId('gate-question').textContent!.split('+').map((x) => Number(x.trim())); return a + b; };

describe('ParentGate', () => {
  beforeEach(() => { vi.useFakeTimers(); useGame.setState({ overlay: 'parent', screen: { name: 'home' } }); });
  afterEach(() => vi.useRealTimers());

  it('soltar antes de 3 s reinicia el progreso', async () => {
    render(<ParentGate />);
    await hold(2000);
    expect(screen.queryByTestId('gate-question')).toBeNull();
    fireEvent.pointerUp(screen.getByTestId('gate-hold'));
    expect(screen.getByTestId('gate-progress').getAttribute('data-progress')).toBe('0.00');
    await hold(2000);
    expect(screen.queryByTestId('gate-question')).toBeNull();
  });
  it('3 s y suma correcta abre ajustes', async () => {
    render(<ParentGate />);
    await hold(3100);
    answer(sum());
    expect(useGame.getState().screen.name).toBe('parent');
    expect(useGame.getState().overlay).toBe('none');
  });
  it('dos fallos cierran el overlay', async () => {
    render(<ParentGate />);
    await hold(3100);
    answer(sum() + 1);
    expect(useGame.getState().overlay).toBe('parent');
    answer(sum() + 1);
    expect(useGame.getState().overlay).toBe('none');
    expect(useGame.getState().screen.name).toBe('home');
  });
});
