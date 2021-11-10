import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {
  BasicGantChart,
  BasicGantChartData,
} from '../components/BasicGantChart/BasicGantChart';

export default {
  title: 'Components/BasicGantChart',
  component: BasicGantChart,
} as ComponentMeta<typeof BasicGantChart>;

const Template: ComponentStory<typeof BasicGantChart> = (args) => {
  return (
    <>
      <BasicGantChart {...args} />
    </>
  );
};

const generateData = (name: string, i: number) => {
  const h = Math.ceil(Math.random() * 24);
  const d = Math.ceil(Math.random() * 60);
  const st = new Date(2021, 10, 4, h, 0, 0);
  const ed = new Date(2021, 10, 4, h + d, 0, 0);
  return {
    id: `${i}`,
    name,
    startDate: st,
    endDate: ed,
    bgColor: () => ['#eee', 'transparent'],
    itemBgColor: () =>
      i % 2 === 0 ? ['orange', 'white', 'green'] : ['red', 'white', 'blue'],
  };
};
const data: Array<BasicGantChartData> = [
  'Mark Zuckerberg - Mark Zuckerberg',
  'Steve Jobs',
  'Bill Gates',
  'Jeff Bezos',
  'Elon Musk',
].map((a: string, i: number) => generateData(a, i));

function Tooltip(props: { item?: BasicGantChartData }) {
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
      My tool tip: {item?.id}:{item?.name}
    </div>
  );
}

export const LightMode = Template.bind({});
LightMode.args = {
  config: {
    selBgColor: '#dcf5ff',
    alternateBgColor: () => ['#eee', 'white'],
    defaultBgColor: () => ['white', '#eee'],
    textColor: '#000',
    selTextColor: 'pink',
    borderColor: '#eee',
    itemColor: () => ['#fff', '#f66'],
    colSize: 80,
    rowSize: 40,
    itemSize: 20,
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
    itemColor: () => ['#222', '#0ff'],

    background: '#000',
    color: '#fff',
    colSize: 60,
    rowSize: 40,
    itemSize: 25,
  },
  items: data,
  tooltip: Tooltip,
};
