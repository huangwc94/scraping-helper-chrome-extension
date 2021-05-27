import { Model } from 'dva';
import { SelectData, GetDefaultData } from './types';
import { UpdateState } from '../utils/updateState';

export interface AppModelType extends Model {
  state: SelectData;
}

export const AppModel: AppModelType = {
  namespace: 'app',
  state: GetDefaultData(),
  reducers: {
    update: UpdateState<SelectData>(),
  },
};
