/** Estudio de accesorios. Versión base de P0 (P4 la amplía). */
import { ACCESSORY_SLOTS } from '@/art/layers';
import { SlotStudio } from '@/components/DollEditor/SlotStudio';
export function Accessories() { return <SlotStudio slots={ACCESSORY_SLOTS} />; }
