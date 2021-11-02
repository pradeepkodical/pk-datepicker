import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {
  YearCalendarData,
  YearsCalendar,
} from '../components/YearsCalendar/YearsCalendar';

export default {
  title: 'Components/YearsCalendar',
  component: YearsCalendar,
} as ComponentMeta<typeof YearsCalendar>;

const Template: ComponentStory<typeof YearsCalendar> = (args) => (
  <YearsCalendar {...args} />
);

const data = [
  {
    date: new Date(),
    bgColor: 'red',
    data: {},
  },
  {
    date: new Date(2019, 1, 1),
    bgColor: 'pink',
    data: {},
  },
  {
    date: new Date(2019, 1, 1),
    bgColor: 'orange',
    data: {},
  },
  {
    date: new Date(),
    bgColor: 'purple',
    data: {},
  },
];

function Tooltip(props: { item?: YearCalendarData }) {
  const { item } = props;
  return (
    <div
      style={{
        backgroundColor: '#dcf5ff',
        color: '#333',
        padding: '10px',
        border: '1px solid #eee',
        borderRadius: '10px',
        //boxShadow: '1px 1px 5px 5px #eee',
      }}
    >
      My tool tip:{`${item?.date}`}
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
