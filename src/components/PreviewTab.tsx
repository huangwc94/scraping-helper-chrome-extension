import React, { useState } from 'react';
import $ from 'cash-dom';
import { connectApp } from '../utils/connect';
import { SelectData } from '../models/types';
import { Radio, Divider } from 'antd';

const options = [
  { label: 'HTML', value: 'HTML' },
  { label: 'src', value: 'src' },
  { label: 'href', value: 'href' },
  { label: 'text', value: 'text' },
];

const Preview = ({ app }: { app: SelectData }) => {
  const [displayOption, setDisplayOption] = useState(options[0].value);

  const renderHtml = () => {
    return app.htmls.map((html, idx) => {
      return (
        <div
          key={idx}
          dangerouslySetInnerHTML={{ __html: html }}
          className="sh-preview-cell"
        />
      );
    });
  };

  const renderAttr = (attr: string) => {
    return app.htmls.map((html, idx) => {
      const element = $(html)[0];
      const href = element && element.getAttribute(attr);
      return (
        <div className="sh-preview-cell" key={idx}>
          {attr}: {href}
        </div>
      );
    });
  };

  const renderText = () => {
    return app.htmls.map((html, idx) => {
      return (
        <div className="sh-preview-cell" key={idx}>
          {$(html).text()}
        </div>
      );
    });
  };

  const renderDisplay = () => {
    switch (displayOption) {
      case 'src':
        return renderAttr('src');
      case 'href':
        return renderAttr('href');
      case 'text':
        return renderText();
      default:
        return renderHtml();
    }
  };

  return (
    <div style={{}}>
      <div>
        <Radio.Group
          options={options}
          onChange={(e) => setDisplayOption(e.target.value)}
          value={displayOption}
          optionType="button"
          buttonStyle="solid"
        />
      </div>
      <Divider />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          maxHeight: '60vh',
        }}
      >
        {renderDisplay()}
      </div>
    </div>
  );
};

export default connectApp(Preview);
