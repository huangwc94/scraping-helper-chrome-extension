import React, { useState } from 'react';
import 'antd/dist/antd.css';
import 'antd/dist/antd.dark.css';
import '../styles/panel.css';

import { Card, Button } from 'antd';
import { InternalMessageType } from '../models/constant';
import { sendUpstreamMessage } from '../utils/message';
import { LeftOutlined, RightOutlined, CloseOutlined } from '@ant-design/icons';
import DetailPanelContainer from './DetailPanelContainer';

import OverviewPanelContainer from './OverviewPanelContainer';

export default () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
    sendUpstreamMessage(InternalMessageType.EXPAND, !expanded);
  };

  const close = () => {
    sendUpstreamMessage(InternalMessageType.STOP);
  };

  return (
    <Card
      style={{ height: '100vh', width: '100vw' }}
      title={
        chrome.i18n.getMessage('extName') +
        'v' +
        process.env.npm_package_version
      }
      className="sh-panel"
      type="inner"
      extra={
        <div>
          <Button
            type="default"
            onClick={toggleExpand}
            icon={expanded ? <RightOutlined /> : <LeftOutlined />}
            style={{ marginRight: '5px' }}
          />
          <Button onClick={close} type="default" icon={<CloseOutlined />} />
        </div>
      }
    >
      {expanded ? <DetailPanelContainer /> : <OverviewPanelContainer />}
    </Card>
  );
};
