import type { ActivityDef } from '@/types';
import { ColorBlob, Garment } from '../../kit/art';
import { SORT_COLOR_MAX_LEVEL, SortColorRound } from './SortColorRound';
import './phrases';
import '../activities.css';
import './styles.css';

function SortColorIcon() {
  return (
    <div className="act-icon act-icon-duo" aria-hidden="true">
      <div className="act-icon-card"><Garment slot="top" color="azul" /></div>
      <ColorBlob color="azul" />
    </div>
  );
}

export const sortColor: ActivityDef = {
  id: 'sort-color',
  category: 'clasificacion',
  spokenTitleKey: 'sc.title',
  inviteKey: 'sc.invite',
  Icon: SortColorIcon,
  estRoundSec: 30,
  maxLevel: SORT_COLOR_MAX_LEVEL,
  Round: SortColorRound,
};
