import type { ActivityDef } from '@/types';
import { ColorBlob } from '../../kit/art';
import { ColorFindRound } from './ColorFindRound';
import './phrases';
import '../activities.css';

function ColorFindIcon() {
  return (
    <div className="act-icon act-icon-trio" aria-hidden="true">
      <ColorBlob color="rojo" /><ColorBlob color="amarillo" /><ColorBlob color="azul" />
    </div>
  );
}

export const colorFind: ActivityDef = {
  id: 'color-find',
  category: 'colores',
  spokenTitleKey: 'cf.title',
  inviteKey: 'cf.invite',
  Icon: ColorFindIcon,
  estRoundSec: 15,
  maxLevel: 4,
  Round: ColorFindRound,
};
