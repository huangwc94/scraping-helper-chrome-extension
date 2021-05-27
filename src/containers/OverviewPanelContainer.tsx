import React from 'react';
import { SelectData } from '../models/types';
import DemoAndInstruction from '../components/DemoAndInstruction';
import SelectOverview from '../components/SelectOverview';
import { Divider } from 'antd';

export default () => {
  return (
    <div>
      <DemoAndInstruction />
      <Divider />
      <SelectOverview />
    </div>
  );
};
