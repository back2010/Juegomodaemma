import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DollLook, EditorTab, HairColor, MakeupKind, MakeupLayer, StickerPlacement, WearSlot } from '@/types';
import { catalog } from '@/catalog/registry';

export function defaultLookFor(dollId: string): DollLook {
  const d = catalog.doll(dollId) ?? catalog.dolls[0];
  return structuredClone({ dollId: d.id, ...d.defaultLook });
}

interface DollState {
  selectedDollId: string;
  looks: Record<string, DollLook>;
  editorTab: EditorTab;
  subTab: string;
}
interface DollActions {
  selectDoll(id: string): void;
  /** Equipa en un slot. Solo cambia ese slot (y quita lo que lo ocultaría, p.ej. vestido al poner blusa). */
  equip(slot: WearSlot, itemId: string, variantId: string): void;
  unequip(slot: WearSlot): void;
  setHairStyle(styleId: string): void;
  setHairColor(color: HairColor): void;
  setMakeup(kind: MakeupKind, layer: MakeupLayer | null): void;
  addSticker(s: StickerPlacement): void;
  updateSticker(uid: string, p: Partial<StickerPlacement>): void;
  removeSticker(uid: string): void;
  resetDoll(id?: string): void;
  setTab(tab: EditorTab, subTab?: string): void;
  setSubTab(subTab: string): void;
  /** Carga un look completo (volver a editar una creación). */
  loadLook(look: DollLook): void;
  /** Restauración atómica (snapshot del scheduler). */
  restore(s: DollState): void;
}
export type DollStore = DollState & DollActions;

const firstDoll = () => catalog.dolls[0]?.id ?? 'sofi';

export const useDolls = create<DollStore>()(
  persist(
    (set) => {
      /** Modifica el look de la muñeca seleccionada (creándolo si no existe). */
      const edit = (fn: (l: DollLook) => DollLook) =>
        set((s) => {
          const id = s.selectedDollId;
          const cur = s.looks[id] ?? defaultLookFor(id);
          return { looks: { ...s.looks, [id]: fn(cur) } };
        });
      return {
        selectedDollId: firstDoll(),
        looks: {},
        editorTab: 'clothes',
        subTab: 'dress',
        selectDoll: (id) => set((s) => ({ selectedDollId: id, looks: s.looks[id] ? s.looks : { ...s.looks, [id]: defaultLookFor(id) } })),
        equip: (slot, itemId, variantId) =>
          edit((l) => {
            const outfit = { ...l.outfit };
            for (const [k, eq] of Object.entries(outfit) as [WearSlot, { itemId: string }][]) {
              const it = eq && catalog.item(eq.itemId);
              if (k !== slot && it?.suppresses?.includes(slot)) delete outfit[k];
              if (slot === 'hairAcc' && k === 'hat' && it?.hairFit === 'compress') delete outfit[k];
            }
            outfit[slot] = { itemId, variantId };
            return { ...l, outfit };
          }),
        unequip: (slot) => edit((l) => { const outfit = { ...l.outfit }; delete outfit[slot]; return { ...l, outfit }; }),
        setHairStyle: (styleId) => edit((l) => ({ ...l, hair: { ...l.hair, styleId } })),
        setHairColor: (color) => edit((l) => ({ ...l, hair: { ...l.hair, color } })),
        setMakeup: (kind, layer) => edit((l) => {
          const makeup = { ...l.makeup };
          if (layer) makeup[kind] = layer; else delete makeup[kind];
          return { ...l, makeup };
        }),
        addSticker: (st) => edit((l) => ({ ...l, stickers: [...l.stickers, st].slice(-40) })),
        updateSticker: (uid, p) => edit((l) => ({ ...l, stickers: l.stickers.map((x) => (x.uid === uid ? { ...x, ...p } : x)) })),
        removeSticker: (uid) => edit((l) => ({ ...l, stickers: l.stickers.filter((x) => x.uid !== uid) })),
        resetDoll: (id) => set((s) => { const d = id ?? s.selectedDollId; return { looks: { ...s.looks, [d]: defaultLookFor(d) } }; }),
        setTab: (editorTab, subTab) => set({ editorTab, ...(subTab ? { subTab } : {}) }),
        setSubTab: (subTab) => set({ subTab }),
        loadLook: (look) => set((s) => ({ selectedDollId: look.dollId, looks: { ...s.looks, [look.dollId]: structuredClone(look) } })),
        restore: (st) => set(structuredClone({ selectedDollId: st.selectedDollId, looks: st.looks, editorTab: st.editorTab, subTab: st.subTab })),
      };
    },
    {
      name: 'emma.dolls',
      version: 1,
      partialize: (s) => ({ selectedDollId: s.selectedDollId, looks: s.looks, editorTab: s.editorTab, subTab: s.subTab }),
    },
  ),
);

/** Look actual de la muñeca seleccionada (selector reactivo). */
export const selectCurrentLook = (s: DollStore): DollLook => s.looks[s.selectedDollId] ?? defaultLookFor(s.selectedDollId);
export const useCurrentLook = () => useDolls(selectCurrentLook);
