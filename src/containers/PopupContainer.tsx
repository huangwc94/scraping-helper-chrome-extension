import React, { useState, useEffect } from 'react';
import { MessageType } from '../models/constant';
import 'antd/dist/antd.css';
import 'antd/dist/antd.dark.css';

import { Button, Layout, Card } from 'antd';
import updates from '../../updates.json';
import { sendMessage } from '../utils/message';
import { getCurrentUrl } from '../utils/urls';

const { Header, Content } = Layout;

export default () => {
  const onStartClicked = () => {
    sendMessage(MessageType.START);
    window.close();
  };

  const [canStart, setCanStart] = useState(false);

  useEffect(() => {
    getCurrentUrl().then((url) => {
      setCanStart(url.startsWith('http') || url.startsWith('https'));
    });
  });

  return (
    <div style={{ width: '370px' }}>
      <Layout>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0,
          }}
        >
          <img src="icon.png" style={{ width: '64px', height: '64px' }} />
          <Header style={{ padding: 0, flex: 1 }}>
            <span
              style={{
                color: 'white',
                fontSize: '20px',
                marginLeft: '30px',
              }}
            >
              {chrome.i18n.getMessage('extName')}
              <span style={{ fontSize: '12px', marginLeft: '20px' }}>
                v{process.env.npm_package_version}
              </span>
            </span>
          </Header>
          <a
            href="https://github.com/huangwc94/scraping-helper-chrome-extension"
            target="blank"
            style={{
              backgroundColor: '#1f1f1f',
              height: '64px',
              display: 'flex',
              alignItems: 'center',
              paddingRight: '15px',
            }}
          >
            <img
              src="GitHub-Mark-Light-64px.png"
              className="sh-with-shadow"
              style={{ width: '32px', height: '32px' }}
            />
          </a>
        </div>

        <Content>
          <Card>
            <h4>{chrome.i18n.getMessage('feature')}</h4>
            <ul>
              {chrome.i18n
                .getMessage('featureList')
                .split('|')
                .map((feature) => (
                  <li key={feature}>
                    <h5>{feature}</h5>
                  </li>
                ))}
            </ul>
            <h4>{chrome.i18n.getMessage('note')}</h4>
            <ul>
              {chrome.i18n
                .getMessage('noteList')
                .split('|')
                .map((feature) => (
                  <li key={feature}>
                    <h5>{feature}</h5>
                  </li>
                ))}
            </ul>
            <h4>{chrome.i18n.getMessage('update')}</h4>
            <ul>
              {updates.map((feature) => (
                <li key={feature}>
                  <h5>{feature}</h5>
                </li>
              ))}
            </ul>
          </Card>
          <Button
            onClick={onStartClicked}
            type="primary"
            size="large"
            block
            disabled={!canStart}
            style={{ height: '50px' }}
          >
            {canStart
              ? chrome.i18n.getMessage('launch')
              : chrome.i18n.getMessage('cantLaunch')}
          </Button>
        </Content>
      </Layout>
    </div>
  );
};
