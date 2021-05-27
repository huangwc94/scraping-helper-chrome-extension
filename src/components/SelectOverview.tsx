import React from 'react';
import { SelectData } from '../models/types';
import { Button, Descriptions, Tag, Alert, Divider } from 'antd';
import { connectApp } from '../utils/connect';
import { sendUpstreamMessage } from '../utils/message';
import { InternalMessageType } from '../models/constant';

function SelectOverview({ app }: { app: SelectData }) {
  const onReset = () => {
    sendUpstreamMessage(InternalMessageType.CLEAR);
  };

  return (
    <div>
      <Descriptions column={1}>
        <Descriptions.Item label={chrome.i18n.getMessage('selectCount')}>
          <Tag color={app.success ? 'green' : 'warning'}>
            {app.selectedCount}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label={chrome.i18n.getMessage('selector')}>
          <code
            style={{
              backgroundColor: '#222',
              color: 'white',
              padding: '0 5px',
            }}
          >
            {app.suggestSelector}
          </code>
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      {app.selected ? (
        <Button size="large" block type="primary" onClick={onReset}>
          {chrome.i18n.getMessage('reset')}
        </Button>
      ) : (
        <Alert
          message={chrome.i18n.getMessage('selectInstruction')}
          type="success"
          style={{ textAlign: 'center' }}
        />
      )}
    </div>
  );
}

export default connectApp(SelectOverview);
