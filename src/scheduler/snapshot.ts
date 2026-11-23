/** Snapshot exacto del juego (ARQUITECTURA §G). Se guarda al invitar y se restaura de forma atómica. */
import type { EditorTab, GameSnapshot } from '@/types';
import { useDolls } from '@/store/dollStore';
import { useGame } from '@/store/gameStore';

export function takeSnapshot(): GameSnapshot {
  const g = useGame.getState();
  const d = useDolls.getState();
  return structuredClone({
    screen: g.screen,
    selectedDollId: d.selectedDollId,
    looks: d.looks,
    editorTab: d.editorTab as EditorTab,
    subTab: d.subTab,
    photo: g.photo,
  });
}

/**
 * Reescribe dollStore y gameStore. Si `keepParentScreen` y el adulto está en su zona, no lo saca de ella
 * (cancelación desde ajustes).
 */
export function restoreSnapshot(s: GameSnapshot, opts: { keepParentScreen?: boolean } = {}) {
  const g = useGame.getState();
  const screen = opts.keepParentScreen && g.screen.name === 'parent' ? g.screen : s.screen;
  useDolls.getState().restore({ selectedDollId: s.selectedDollId, looks: s.looks, editorTab: s.editorTab, subTab: String(s.subTab) });
  useGame.getState().restore({ screen, photo: s.photo });
}
