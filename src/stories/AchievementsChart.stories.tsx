import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {
  AchievementsChart,
  AchievementsChartData,
  AchievementsChartItemData,
} from '../components/AchievementsChart/AchievementsChart';

export default {
  title: 'Components/AchievementsChart',
  component: AchievementsChart,
} as ComponentMeta<typeof AchievementsChart>;

const Template: ComponentStory<typeof AchievementsChart> = (args) => (
  <AchievementsChart {...args} />
);

const randColor = () =>
  `rgb(${(Math.random() * 255).toFixed(0)},${(Math.random() * 255).toFixed(
    0
  )},${(Math.random() * 255).toFixed(0)})`;

const generateData = (i: number): AchievementsChartData => {
  return {
    id: `A${i}`,
    name: `A${i}`,
    bgColor: '#388e3c',
    badges: Array.from(
      { length: Math.floor(Math.random() * 5) },
      () => 0
    ).map((a, j) => ({ bgColor: randColor(), data: { name: `A${i}-${j}` } })),
    timeline: Array.from(
      { length: 1 + Math.floor(Math.random() * 100) },
      () => 0
    ).map((a, j) => ({
      bgColor: randColor(),
      badgeCount: 1,
      data: { name: `A${i}-${j}` },
    })),
  };
};
const data: Array<AchievementsChartData> = Array.from(
  { length: Math.floor(10 + Math.random() * 15) },
  () => 0
).map((a: number, i: number) => generateData(i));

function Tooltip(props: {
  item?: {
    item: AchievementsChartData;
    badge?: AchievementsChartItemData;
  };
}) {
  //console.log('Tooltip');

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
      My tool tip: {props.item?.item?.name}:{props.item?.badge?.bgColor}
      <pre>{JSON.stringify(props.item?.badge?.data, null, 2)}</pre>
    </div>
  );
}

export const LightMode = Template.bind({});
LightMode.args = {
  config: {
    selBgColor: '#dcf5ff',
    alternateBgColor: '#dcf5ff',
    defaultBgColor: '#fff',
    textColor: '#000',
    selTextColor: 'pink',
    borderColor: '#eee',
    rowSize: 30,
    boxSize: 15,
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
