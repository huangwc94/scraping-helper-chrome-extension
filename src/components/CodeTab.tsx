import React from 'react';
import { Tabs } from 'antd';
import { generatePythonCode } from '../code/python';
import { generateNodejsCode } from '../code/nodejs';

import Editor from './Editor';
import { SelectData } from '../models/types';
import { connectApp } from '../utils/connect';
import { currentUrl } from '../utils/urls';

const { TabPane } = Tabs;

const availableCode: {
  [id: string]: (selector: string, url: string) => string;
} = {
  python: generatePythonCode,
  js: generateNodejsCode,
};

const CodeTab = ({ app }: { app: SelectData }) => {
  return (
    <Tabs defaultActiveKey="python">
      {Object.keys(availableCode).map((tp) => {
        return (
          <TabPane tab={tp} key={tp}>
            <Editor
              type={tp}
              code={availableCode[tp](app.suggestSelector, currentUrl())}
            />
          </TabPane>
        );
      })}
    </Tabs>
  );
};

export default connectApp(CodeTab);
