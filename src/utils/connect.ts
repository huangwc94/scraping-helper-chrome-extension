import { ReactComponentLike } from 'prop-types';
import { connect } from 'dva';
import { mapAppStateToProps } from '../models/types';

export function connectApp(container: ReactComponentLike) {
  return connect(mapAppStateToProps)(container);
}
