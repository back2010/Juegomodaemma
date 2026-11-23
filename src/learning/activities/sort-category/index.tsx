import type { ActivityDef } from '@/types';
import { Animal, Garment } from '../../kit/art';
import { SortCategoryRound } from './SortCategoryRound';
import './phrases';
import '../activities.css';
import './sort-category.css';

function SortCategoryIcon() {
  return (
    <div className="act-icon act-icon-duo sct-icon" aria-hidden="true">
      <div className="sct-icon-box"><Animal kind="gato" /></div>
      <div className="sct-icon-box"><Garment slot="dress" color="rosa" /></div>
    </div>
  );
}

export const sortCategory: ActivityDef = {
  id: 'sort-category',
  category: 'clasificacion',
  spokenTitleKey: 'sct.title',
  inviteKey: 'sct.invite',
  Icon: SortCategoryIcon,
  estRoundSec: 35,
  maxLevel: 2,
  Round: SortCategoryRound,
};
