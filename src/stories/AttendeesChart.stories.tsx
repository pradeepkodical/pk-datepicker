import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {
  AttendeesChart,
  AttendeesChartData,
  AttendeesChartEventData,
} from '../components/AttendeesChart/AttendeesChart';

export default {
  title: 'Components/AttendeesChart',
  component: AttendeesChart,
} as ComponentMeta<typeof AttendeesChart>;

const Template: ComponentStory<typeof AttendeesChart> = (args) => (
  <AttendeesChart {...args} />
);

const events: Array<AttendeesChartEventData> = Array.from(
  { length: Math.floor(5 + Math.random() * 5) },
  () => 0
).map((a: number, i: number) => ({
  id: `${i}`,
  name: `event ${i}`,
  date: new Date(2021, i, 15),
}));

const generateData = (i: number): AttendeesChartData => {
  const myEvents = Array.from(
    { length: 2 + Math.floor(Math.random() * events.length) },
    () => Math.floor(2 + Math.random() * events.length - 2)
  ).map((a, j) => `${a}`);

  return {
    id: `A${i}`,
    name: `Customer ${i}`,
    purchases: [
      {
        id: '1',
        name: 'Essentials',
        date:
          events.find(
            (e) =>
              e.id === myEvents[Math.floor(Math.random() * myEvents.length)]
          )?.date || new Date(),
        color: 'green',
      },
      {
        id: '2',
        name: 'Pro',
        date:
          events.find(
            (e) =>
              e.id === myEvents[Math.floor(Math.random() * myEvents.length)]
          )?.date || new Date(),

        color: 'pink',
      },
    ],
    events: myEvents,
  };
};
const data: Array<AttendeesChartData> = Array.from(
  { length: Math.floor(5 + Math.random() * 5) },
  () => 0
).map((a: number, i: number) => generateData(i));

function Tooltip(props: {
  item?: { attendee: AttendeesChartData; event?: AttendeesChartEventData };
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
      My tool tip: {props.item?.attendee?.name}:{props.item?.event?.name}
      <pre>{JSON.stringify(props.item, null, 2)}</pre>
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
    borderColor: '#999',

    colSize: 180,
    rowSize: 40,
    circleSize: 10,
  },
  attendees: data,
  events,
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
    borderColor: '#666',
    colSize: 150,
    rowSize: 30,
    circleSize: 10,
  },
  attendees: data,
  events,
  tooltip: Tooltip,
};
