import React from 'react';

export default () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h3 style={{ textAlign: 'left', width: '100%' }}>
        {chrome.i18n.getMessage('note')}
      </h3>
      <ul style={{ width: '100%', textAlign: 'left' }}>
        {chrome.i18n
          .getMessage('noteList')
          .split('|')
          .map((feature) => (
            <li key={feature}>
              <h5>{feature}</h5>
            </li>
          ))}
      </ul>
      <h3 style={{ textAlign: 'left', width: '100%' }}>
        {' '}
        {chrome.i18n.getMessage('demoLegend')}
      </h3>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: '10px',
          justifyContent: 'space-around',
        }}
      >
        <span
          className="sh-hover"
          style={{ textAlign: 'center', padding: '5px' }}
        >
          {chrome.i18n.getMessage('demoPrepare')}
        </span>
        <span
          className="sh-predict"
          style={{ textAlign: 'center', padding: '5px' }}
        >
          {chrome.i18n.getMessage('demoPredict')}
        </span>
      </div>
    </div>
  );
};
