import type { ActivityDef } from '@/types';
import { ColorBlob } from '../../kit/art';
import { BucketArt, ColorBucketRound, COLOR_BUCKET_MAX_LEVEL } from './ColorBucketRound';
import './phrases';
import '../activities.css';
import './styles.css';

function ColorBucketIcon() {
  return (
    <div className="act-icon act-icon-duo" aria-hidden="true">
      <div className="cb-icon-bucket"><BucketArt color="azul" /></div>
      <div className="act-icon-card"><ColorBlob color="rojo" /></div>
    </div>
  );
}

export const colorBucket: ActivityDef = {
  id: 'color-bucket',
  category: 'colores',
  spokenTitleKey: 'cb.title',
  inviteKey: 'cb.invite',
  Icon: ColorBucketIcon,
  estRoundSec: 25,
  maxLevel: COLOR_BUCKET_MAX_LEVEL,
  Round: ColorBucketRound,
};
