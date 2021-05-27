import React from 'react';
import { render } from 'react-dom';
import '../styles/global.css';
import PopupContainer from '../containers/PopupContainer';

render(<PopupContainer />, window.document.querySelector('#app-container'));

//@ts-ignore
if (module.hot) module.hot.accept();
