import { MessageType, InternalMessageType } from '../models/constant';
import { SelectData, GetDefaultData } from '../models/types';

export function sendMessage(event: MessageType, payload: any = null) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    if (!!tab && tab.id !== undefined) {
      chrome.tabs.sendMessage(tab.id, {
        SH_EVENT: true,
        event,
        payload,
      });
    }
  });
}

export function listenMessage(cb: (event: MessageType, payload: any) => void) {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.SH_EVENT) {
      cb(message.event, message.payload);
    }
  });
}

export function sendUpstreamMessage(
  event: InternalMessageType,
  payload: any = null
) {
  parent.postMessage(
    {
      SH_EVENT: true,
      event,
      payload,
    },
    '*'
  );
}

export function sendDownstreamMessage(
  event: InternalMessageType,
  payload: any = null
) {
  const frame = document.getElementById('sh-iframe');
  if (!!frame) {
    //@ts-ignore
    frame.contentWindow.postMessage(
      {
        SH_EVENT: true,
        event,
        payload,
      },
      '*'
    );
  }
}

export function listenInternalMessage(
  cb: (event: InternalMessageType, payload: any) => void
) {
  window.addEventListener('message', (e) => {
    if (e.data.SH_EVENT) {
      cb(e.data.event, e.data.payload);
    }
  });
}

export function updateSelection(select: SelectData) {
  sendDownstreamMessage(InternalMessageType.UPDATE, select);
}
