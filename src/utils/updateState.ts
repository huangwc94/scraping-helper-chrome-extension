import _ from 'lodash';
import { AnyAction, Reducer } from 'redux';

export function UpdateState<T>(): Reducer<T> {
  return UpdateStateG;
}

export function UpdateStateG<T>(
  oldState: T,
  { payload: newState }: AnyAction
): T {
  return { ...oldState, ...newState };
}
