import type { ActivityDef } from '@/types';
import { ShapeToken } from '../../kit/art';
import { SortShapeRound } from './SortShapeRound';
import './phrases';
import '../activities.css';
import './sort-shape.css';

function SortShapeIcon() {
  return (
    <div className="act-icon act-icon-duo ssh-icon" aria-hidden="true">
      <div className="ssh-icon-box"><ShapeToken shape="estrella" color="amarillo" /></div>
      <div className="ssh-icon-box"><ShapeToken shape="circulo" color="azul" /></div>
    </div>
  );
}

export const sortShape: ActivityDef = {
  id: 'sort-shape',
  category: 'clasificacion',
  spokenTitleKey: 'ssh.title',
  inviteKey: 'ssh.invite',
  Icon: SortShapeIcon,
  estRoundSec: 30,
  maxLevel: 2,
  Round: SortShapeRound,
};
