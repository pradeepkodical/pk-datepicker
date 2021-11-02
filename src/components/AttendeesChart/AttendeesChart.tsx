import { useCallback, useMemo, useState } from 'react';
import { BoxDrawItem } from '../../drawLib/boxDrawItem';
import { DrawItem, IDrawItem } from '../../drawLib/drawItem';
import { Property } from 'csstype';
import { LineDrawItem } from '../../drawLib/lineDrawItem';
import { CircleDrawItem } from '../../drawLib/circleDrawItem';
import CanvasContainer from '../../drawLib/canvasContainer';
import { ContainerDrawItem } from '../../drawLib/containerDrawItem';
import { ChartTooltip } from '../ChartTooltip/ChartTooltip';

type AttendeesChartConfig = {
  selBgColor?: Property.Color;
  defaultBgColor?: Property.Color;
  alternateBgColor?: Property.Color;
  textColor?: Property.Color;
  selTextColor?: Property.Color;
  borderColor?: Property.Color;

  purchaseColor?: Property.Color;
  eventColor?: Property.Color;

  rowSize?: number;
  colSize?: number;
  circleSize?: number;
};

const defaultConfig: AttendeesChartConfig = {
  selBgColor: '#dcf5ff',
  defaultBgColor: '#fff',
  alternateBgColor: '#fefefe',
  textColor: '#000',
  selTextColor: '#111',
  borderColor: '#efefef',

  purchaseColor: 'green',
  eventColor: 'blue',

  rowSize: 30,
  colSize: 150,
  circleSize: 25,
};

export type AttendeesChartEventData = {
  id: string;
  name: string;
  date: Date;
};
export type AttendeesChartPurchaseData = {
  id: string;
  name: string;
  date: Date;
  color?: Property.Color;
};
export type AttendeesChartData = {
  id: string;
  name: string;
  events: Array<string>;
  purchases?: Array<AttendeesChartPurchaseData>;
};

export type AttendeesChartProps = {
  events: Array<AttendeesChartEventData>;
  attendees: Array<AttendeesChartData>;
  config: AttendeesChartConfig;
  tooltip?: React.FC<{
    item?: { attendee: AttendeesChartData; event?: AttendeesChartEventData };
  }>;
  onClick?: (item: {
    attendee: AttendeesChartData;
    event?: AttendeesChartEventData;
    purchase?: AttendeesChartPurchaseData;
  }) => void;
};

function getEventPos(
  eventId: string,
  events: Array<AttendeesChartEventData>,
  theConfig: AttendeesChartConfig
) {
  const i = events.findIndex((x) => x.id === eventId);
  return { top: 0, left: (i + 1) * (theConfig.colSize || 0) };
}

function getHeat(delta: number) {
  return `rgb(255, ${(1 - delta) * 255} ,0)`;
}

function createEvents(
  events: Array<AttendeesChartEventData>,
  attendees: Array<AttendeesChartData>,
  theConfig: AttendeesChartConfig
) {
  const arr: Array<DrawItem> = [];

  const c = new ContainerDrawItem();
  c.items = arr;
  c.top = theConfig.rowSize || 0;
  c.width = (theConfig.colSize || 0) * (events.length + 1);

  events.forEach((evt: AttendeesChartEventData, i: number) => {
    const occurance = attendees.reduce(
      (p: number, c: any) => p + (c.events.indexOf(evt.id) >= 0 ? 1 : 0),
      0
    );
    const color = getHeat(occurance / attendees.length);

    const e1 = BoxDrawItem.create(
      (i + 1) * (theConfig.colSize || 0),
      theConfig.rowSize || 0,
      theConfig.colSize || 0,
      theConfig.textColor || '#fff',
      color,
      theConfig.selBgColor || '#fff',
      theConfig.borderColor || '#fff',
      evt,
      evt.name
    );
    e1.height = theConfig.rowSize || 0;
    arr.push(e1);
  });

  return c;
}

function createAttendee(
  item: AttendeesChartData,
  i: number,
  events: Array<AttendeesChartEventData>,
  theConfig: AttendeesChartConfig
) {
  const arr: Array<DrawItem> = [];
  const lines: Array<IDrawItem> = [];
  const radius = theConfig.circleSize || 5;

  const c = new ContainerDrawItem();
  c.items = arr;
  c.lines = lines;
  c.top = (i + 2) * (theConfig.rowSize || 0);
  c.width = (theConfig.colSize || 0) * (events.length + 1);
  c.bgColor =
    (i % 2 === 0 ? theConfig.alternateBgColor : theConfig.defaultBgColor) ||
    '#fff';

  let left = 0;
  let top = (i + 2) * (theConfig.rowSize || 0);

  arr.push(
    BoxDrawItem.create(
      left,
      top,
      theConfig.colSize || 0,
      theConfig.textColor || '#fff',
      theConfig.defaultBgColor || '#fff',
      theConfig.selBgColor || '#fff',
      theConfig.borderColor || '#fff',
      { id: item.id, name: item.name },
      item.name
    ).setHeight(theConfig.rowSize || 0)
  );

  events.forEach((e: AttendeesChartEventData, j: number) => {
    if (item.events.indexOf(e.id) >= 0) {
      const pos = getEventPos(e.id, events, theConfig);
      lines.push(
        LineDrawItem.create(
          left + 1.2 * radius,
          top,
          pos.left - 1.2 * radius,
          top,
          theConfig.borderColor || '#fff',
          {}
        ).moveBy((theConfig.colSize || 0) / 2, (theConfig.rowSize || 0) / 2)
      );
      left = pos.left;
      arr.push(
        CircleDrawItem.create(
          pos.left,
          top,
          radius * 2,
          theConfig.eventColor || '#fff',
          {
            event: e,
            attendee: { id: item.id, name: item.name },
          },
          `${j}`
        ).moveBy(
          ((theConfig.colSize || 0) - 2 * radius) / 2,
          ((theConfig.rowSize || 0) - 2 * radius) / 2
        )
      );
    }
  });

  item.purchases?.forEach((purchase: AttendeesChartPurchaseData, j: number) => {
    const tippingPointEvt = events.reduce(
      (p: AttendeesChartEventData, c: AttendeesChartEventData) =>
        purchase.date >= c.date ? c : p,
      events[0]
    );
    const pos = getEventPos(tippingPointEvt.id, events, theConfig);
    arr.push(
      CircleDrawItem.create(
        pos.left,
        top,
        radius * 2,
        purchase.color || theConfig.purchaseColor || '#fff',
        {
          event: tippingPointEvt,
          attendee: { id: item.id, name: item.name },
          purchase: purchase,
        },
        `${j}`
      )
        .moveBy(
          2 + radius * 2 + ((theConfig.colSize || 0) - 2 * radius) / 2,
          ((theConfig.rowSize || 0) - 2 * radius) / 2
        )
        .moveBy(j * radius * 2, 0)
    );
  });

  return c;
}

function createDrawItems(
  attendees: Array<AttendeesChartData>,
  events: Array<AttendeesChartEventData>,
  theConfig: AttendeesChartConfig
) {
  const arr: Array<DrawItem> = [];

  arr.push(
    BoxDrawItem.create(
      0,
      0,
      theConfig.colSize || 0,
      theConfig.textColor || '#333',
      () => ['yellow', 'red'],
      () => ['red', 'yellow'],
      theConfig.borderColor || '#eee',
      null,
      'Heatmap'
    ).setHeight((theConfig.rowSize || 0) / 2)
  );

  arr.push(createEvents(events, attendees, theConfig));

  attendees.forEach((item: AttendeesChartData, i: number) => {
    arr.push(createAttendee(item, i, events, theConfig));
  });

  const c = new ContainerDrawItem();
  c.items = arr;
  return [c];
}

export function AttendeesChart(props: AttendeesChartProps) {
  const { attendees, events, config, tooltip, onClick } = props;
  const theConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config]);

  const [selected, setSelected] = useState<any>(null);

  const drawItems = useMemo(
    () => createDrawItems(attendees, events, theConfig),
    [attendees, events, theConfig]
  );

  const handleOnHover = useCallback(
    (item: any) => {
      setSelected(item);
    },
    [setSelected]
  );

  return (
    <div
      style={{
        display: 'flex',
        padding: '10px',
        justifyContent: 'stretch',
        backgroundColor: theConfig.defaultBgColor,
        color: theConfig.textColor,
      }}
    >
      <CanvasContainer
        drawItems={drawItems}
        onClick={onClick}
        onHover={handleOnHover}
      ></CanvasContainer>
      <ChartTooltip tooltip={tooltip} selected={selected} />
    </div>
  );
}
