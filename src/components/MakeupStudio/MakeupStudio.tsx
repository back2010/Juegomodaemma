/** Estudio de maquillaje. Versión base de P0 (P2 la amplía). */
import type { Intensity, MakeupKind } from '@/types';
import { catalog } from '@/catalog/registry';
import { MAKEUP_COLORS } from '@/assets/makeup/colors';
import { useDolls, useCurrentLook } from '@/store/dollStore';
import { ItemGrid } from '@/components/DollEditor/ItemGrid';
import { ColorSwatches } from '@/components/DollEditor/ColorSwatches';
import { SubTabs } from '@/components/DollEditor/SubTabs';
import { MakeupPreview } from '@/components/DollEditor/Preview';
import { swatchPaint } from '@/components/DollEditor/paint';
import { IconBig, IconMedium, IconSmall } from '@/components/Shell/icons';

export const MAKEUP_UI_ORDER: MakeupKind[] = ['lips', 'eyeshadow', 'blush', 'lashes', 'liner', 'brows', 'gloss', 'freckles', 'sparkle'];
const NO_INTENSITY: MakeupKind[] = ['gloss', 'sparkle'];

export function MakeupStudio() {
  const look = useCurrentLook();
  const subTab = useDolls((s) => s.subTab);
  const { setSubTab, setMakeup } = useDolls.getState();
  const kinds = MAKEUP_UI_ORDER.filter((k) => catalog.makeupOfKind(k).length > 0);
  const kind = (kinds.includes(subTab as MakeupKind) ? subTab : kinds[0]) as MakeupKind;
  const styles = catalog.makeupOfKind(kind);
  const colors = MAKEUP_COLORS[kind];
  const cur = look.makeup[kind];
  const defIntensity: Intensity = kind === 'brows' || kind === 'lashes' || kind === 'liner' ? 1 : 0.65;
  const apply = (p: Partial<NonNullable<typeof cur>>) => setMakeup(kind, {
    styleId: cur?.styleId ?? styles[0].id, color: cur?.color ?? colors[0].hex, colorTag: cur?.colorTag ?? colors[0].tag,
    intensity: cur?.intensity ?? defIntensity, ...p,
  });
  return (
    <div className="studio-body">
      <SubTabs value={kind} onChange={setSubTab} tabs={kinds.map((k) => ({
        key: k, label: k, icon: <MakeupPreview kind={k} styleId={catalog.makeupOfKind(k)[0].id} color={MAKEUP_COLORS[k][0].hex} dollId={look.dollId} />,
      }))} />
      <ItemGrid testId="item-grid" onNone={() => setMakeup(kind, null)} noneSelected={!cur}
        tiles={styles.map((st) => ({
          key: st.id, label: st.spokenName ?? st.kind, selected: cur?.styleId === st.id,
          preview: <MakeupPreview kind={kind} styleId={st.id} color={cur?.color ?? colors[0].hex} dollId={look.dollId} />,
          onPick: () => apply({ styleId: st.id }),
        }))} />
      <ColorSwatches testId="makeup-colors" swatches={colors.map((c, i) => ({
        key: `${c.tag}-${i}`, label: c.tag, paint: swatchPaint(c.hex), selected: cur?.color === c.hex,
        onPick: () => apply({ color: c.hex, colorTag: c.tag }),
      }))} />
      {cur && !NO_INTENSITY.includes(kind) && (
        <div className="intensity" data-testid="intensity">
          {([0.35, 0.65, 1] as Intensity[]).map((v, i) => {
            const Icon = [IconSmall, IconMedium, IconBig][i];
            return (
              <button key={v} type="button" className={`btn ${cur.intensity === v ? 'selected' : ''}`} aria-label={`intensidad ${i + 1}`}
                onClick={() => apply({ intensity: v })}><Icon /></button>
            );
          })}
        </div>
      )}
    </div>
  );
}
