import type { MakeupStyle } from '@/types';
import { referenceMakeup } from './reference';
import { extraMakeup } from './styles';

const makeup: MakeupStyle[] = [...referenceMakeup, ...extraMakeup];
export default makeup;
