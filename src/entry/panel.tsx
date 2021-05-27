import React from 'react';
import '../styles/global.css';
import PanelContainer from '../containers/PanelContainer';
import dva from 'dva';
import { AppModel } from '../models/app';
import { listenInternalMessage } from '../utils/message';
import { InternalMessageType } from '../models/constant';

const app = dva();

app.model(AppModel);

listenInternalMessage((event: InternalMessageType, payload: any) => {
  if (event === InternalMessageType.UPDATE) {
    //@ts-ignore
    app._store.dispatch({ type: 'app/update', payload });
  }
});

app.router(() => {
  return <PanelContainer />;
});

app.start('#app-container');

//@ts-ignore
if (module.hot) module.hot.accept();
