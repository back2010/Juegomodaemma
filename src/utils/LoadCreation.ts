import { useDolls } from '@/store/dollStore';
import { useGame } from '@/store/gameStore';
import type { Creation } from '@/types';

/** Vuelve a editar una creación: carga el look, la escena y abre el salón. */
export function loadCreation(c: Creation) {
  useDolls.getState().loadLook(c.look);
  const g = useGame.getState();
  g.setPhoto({ scene: { ...c.scene }, editingCreationId: c.id });
  g.go('salon');
}
