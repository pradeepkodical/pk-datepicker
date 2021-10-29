import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { YearsCalendar } from '../components/YearsCalendar/YearsCalendar';

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
  },
  {
    date: new Date(2019, 1, 1),
    bgColor: 'pink',
  },
  {
    date: new Date(2019, 1, 1),
    bgColor: 'orange',
  },
  {
    date: new Date(),
    bgColor: 'purple',
  },
];

export const LightMode = Template.bind({});
LightMode.args = {
  config: {
    selBgColor: '#dcf5ff',
    alternateBgColor: '#eee',
    defaultBgColor: '#fff',
    textColor: '#000',
    selTextColor: 'pink',
    borderColor: '#999',
  },
  items: data,
};

export const DarkMode = Template.bind({});
DarkMode.args = {
  config: {
    selBgColor: '#aaa',
    alternateBgColor: '#444',
    defaultBgColor: '#111',
    textColor: '#fff',
    selTextColor: 'red',
    borderColor: '#666',
  },
  items: data,
};
