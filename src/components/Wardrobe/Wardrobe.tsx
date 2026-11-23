/** Estudio de ropa. Versión base de P0 (P4 la amplía). */
import { CLOTHES_SLOTS } from '@/art/layers';
import { SlotStudio } from '@/components/DollEditor/SlotStudio';
export function Wardrobe() { return <SlotStudio slots={CLOTHES_SLOTS} />; }
