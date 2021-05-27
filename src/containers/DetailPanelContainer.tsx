import React from 'react';
import { Row, Col, Divider, Tabs } from 'antd';

import DemoAndInstruction from '../components/DemoAndInstruction';
import SelectOverview from '../components/SelectOverview';
import PreviewTab from '../components/PreviewTab';
import CodeTab from '../components/CodeTab';

const { TabPane } = Tabs;

export default () => {
  return (
    <Row gutter={20}>
      <Col span={6}>
        <DemoAndInstruction />
        <Divider />
        <SelectOverview />
      </Col>
      <Col span={18}>
        <Tabs defaultActiveKey="1">
          <TabPane tab={chrome.i18n.getMessage('preview')} key="1">
            <PreviewTab />
          </TabPane>
          <TabPane tab={chrome.i18n.getMessage('sampleCode')} key="2">
            <CodeTab />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};
