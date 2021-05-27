import { MessageType, InternalMessageType } from '../models/constant';
import { listenMessage, listenInternalMessage } from '../utils/message';
import { SHEngine } from '../search/engine';
let started = false;

let engine = new SHEngine();

listenMessage((event: MessageType, payload: any) => {
  switch (event) {
    case MessageType.START:
      initialize();
      break;
  }
});

listenInternalMessage((event: InternalMessageType, payload: any) => {
  switch (event) {
    case InternalMessageType.EXPAND:
      expand(payload);
      break;
    case InternalMessageType.STOP:
      stop();
      break;
    case InternalMessageType.CLEAR:
      engine.reset();
      break;
  }
});

function stop() {
  if (!started) {
    return;
  }
  started = false;
  const frame = document.getElementById('sh-iframe');
  if (!!frame) {
    frame.remove();
  }
  engine.unbind();
}

function initialize() {
  if (started) {
    return;
  }
  started = true;
  const frame = document.createElement('iframe');
  frame.src = chrome.extension.getURL('panel.html');
  frame.id = 'sh-iframe';
  frame.scrolling = 'no';
  frame.className = 'sh-frame-no-expand';
  frame.draggable = true;
  document.body.appendChild(frame);
  engine.bind();
}

function expand(expand: boolean) {
  const frame = document.getElementById('sh-iframe');
  if (!!frame) {
    if (expand) {
      frame.className = 'sh-frame-expand';
    } else {
      frame.className = 'sh-frame-no-expand';
    }
  }
}
