import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {
  StackedBarChart,
  StackedBarChartData,
  StackedBarChartItemData,
} from '../components/StackedBarChart/StackedBarChart';

export default {
  title: 'Components/StackedBarChart',
  component: StackedBarChart,
} as ComponentMeta<typeof StackedBarChart>;

const Template: ComponentStory<typeof StackedBarChart> = (args) => (
  <StackedBarChart {...args} />
);

const generateData = (i: number) => {
  return {
    key: `${i}`,
    items: [
      {
        bgColor: '#388e3c',
        key: `A${i}`,
        value: Math.random() * 3,
      },
      {
        bgColor: '#64b5f6',
        key: `B${i}`,
        value: 5 + Math.random() * 10,
      },
      {
        bgColor: '#3f51b5',
        key: `C${i}`,
        value: 5 + Math.random() * 10,
      },
    ],
  };
};
const data: Array<StackedBarChartData> = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
].map((a: number, i: number) => generateData(i));

function Tooltip(props: { item?: StackedBarChartItemData }) {
  const { item } = props;
  return (
    <div
      style={{
        backgroundColor: '#fefefe',
        color: '#333',
        padding: '10px',
        border: '1px solid #eee',
        borderRadius: '10px',
      }}
    >
      My tool tip: {item?.key}:{item?.value}
    </div>
  );
}

export const LightMode = Template.bind({});
LightMode.args = {
  config: {
    selBgColor: '#dcf5ff',
    alternateBgColor: '#eee',
    defaultBgColor: '#fff',
    textColor: '#000',
    selTextColor: 'pink',
    borderColor: '#eee',
  },
  items: data,
  tooltip: Tooltip,
};

export const DarkMode = Template.bind({});
DarkMode.args = {
  config: {
    selBgColor: '#aaa',
    alternateBgColor: '#444',
    defaultBgColor: '#111',
    textColor: '#fff',
    selTextColor: 'red',
    borderColor: '#222',
  },
  items: data,
  tooltip: Tooltip,
};
