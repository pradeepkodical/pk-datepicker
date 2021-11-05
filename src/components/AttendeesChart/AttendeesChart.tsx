import { useCallback, useMemo } from 'react';
import { BoxDrawItem } from '../../drawLib/boxDrawItem';
import { DrawItem, IDrawItem } from '../../drawLib/drawItem';
import { Property } from 'csstype';
import { LineDrawItem } from '../../drawLib/lineDrawItem';
import { CircleDrawItem } from '../../drawLib/circleDrawItem';

import { ContainerDrawItem } from '../../drawLib/containerDrawItem';

import { TextDrawItem } from '../../drawLib/textDrawItem';
import {
  ColorsConfig,
  DefaultColorOrFunc,
  getConfig,
  IColorsConfig,
} from '../ColorsConfig';
import { CanvasChart } from '../CanvasChart/CanvasChart';

interface IAttendeesChartConfig extends IColorsConfig {
  purchaseColor?: Property.Color;
  eventColor?: Property.Color;
  lineColor?: Property.Color;

  rowSize?: number;
  colSize?: number;
  circleSize?: number;
}

interface AttendeesChartConfig extends ColorsConfig {
  purchaseColor: Property.Color;
  eventColor: Property.Color;
  lineColor: Property.Color;

  rowSize: number;
  colSize: number;
  circleSize: number;
}

const defaultConfig = {
  purchaseColor: 'green',
  eventColor: 'blue',
  lineColor: 'pink',

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
export type AttendeesChartBadgeData = {
  bgColor: Property.Color;
  data?: any;
};
export type AttendeesChartData = {
  id: string;
  name: string;
  badges: Array<AttendeesChartBadgeData>;
  events: Array<string>;
  purchases?: Array<AttendeesChartPurchaseData>;
};

export type AttendeesChartProps = {
  events: Array<AttendeesChartEventData>;
  attendees: Array<AttendeesChartData>;
  config: IAttendeesChartConfig;
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
  return { top: 0, left: (i + 1) * theConfig.colSize };
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
  const lines: Array<IDrawItem> = [];

  const c = new ContainerDrawItem();
  c.items = arr;
  c.lines = lines;
  c.top = theConfig.rowSize;
  c.width = theConfig.colSize * (events.length + 1);

  events.forEach((evt: AttendeesChartEventData, i: number) => {
    const occurance = attendees.reduce(
      (p: number, c: any) => p + (c.events.indexOf(evt.id) >= 0 ? 1 : 0),
      0
    );
    const color = getHeat(occurance / attendees.length);
    const left = (i + 1) * theConfig.colSize;

    const e1 = BoxDrawItem.create(
      left,
      theConfig.rowSize,
      theConfig.colSize,
      theConfig.textColor,
      color,
      theConfig.selBgColor,
      theConfig.borderColor,
      evt,
      evt.name
    );
    e1.height = theConfig.rowSize;
    arr.push(e1);
  });

  return c;
}

function createAttendeeName(
  item: AttendeesChartData,
  top: number,
  bgColor: DefaultColorOrFunc,
  theConfig: AttendeesChartConfig
) {
  const c = new ContainerDrawItem();
  c.items = [];
  c.top = top;
  c.width = theConfig.colSize;
  c.bgColor = bgColor;

  const size = theConfig.circleSize * 2;
  const left = size * 4;

  item.badges?.forEach((b: AttendeesChartBadgeData, j: number) => {
    const bd = BoxDrawItem.create(
      j * size,
      top,
      size,
      theConfig.textColor,
      b.bgColor,
      theConfig.selBgColor,
      theConfig.borderColor,
      { item, badge: b },
      ''
    ).moveBy(0, (theConfig.rowSize - size) / 2);
    c.items.push(bd);
  });

  c.items.push(
    TextDrawItem.create(
      left,
      top,
      theConfig.rowSize,
      theConfig.textColor,
      bgColor,
      item.name,
      { id: item.id, name: item.name }
    )
  );

  return c;
}

function createAttendee(
  item: AttendeesChartData,
  top: number,
  bgColor: DefaultColorOrFunc,
  events: Array<AttendeesChartEventData>,
  theConfig: AttendeesChartConfig
) {
  const arr: Array<DrawItem> = [];
  const lines: Array<IDrawItem> = [];
  const radius = theConfig.circleSize;

  const c = new ContainerDrawItem();
  c.items = arr;
  c.lines = lines;
  c.top = top;
  c.width = theConfig.colSize * (events.length + 1);
  c.bgColor = bgColor;

  arr.push(createAttendeeName(item, top, c.bgColor, theConfig));

  lines.push(
    LineDrawItem.create(0, top, c.width, top, theConfig.lineColor, {}).moveBy(
      0,
      theConfig.rowSize / 2
    )
  );

  events.forEach((e: AttendeesChartEventData, j: number) => {
    if (item.events.indexOf(e.id) >= 0) {
      const pos = getEventPos(e.id, events, theConfig);
      arr.push(
        CircleDrawItem.create(
          pos.left,
          top,
          radius * 2,
          theConfig.eventColor,
          {
            event: e,
            attendee: { id: item.id, name: item.name },
          },
          ``
        ).moveBy(
          (theConfig.colSize - 2 * radius) / 2,
          (theConfig.rowSize - 2 * radius) / 2
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
        purchase.color || theConfig.purchaseColor,
        {
          event: tippingPointEvt,
          attendee: { id: item.id, name: item.name },
          purchase: purchase,
        },
        ``
      )
        .moveBy(
          2 + radius * 2 + (theConfig.colSize - 2 * radius) / 2,
          (theConfig.rowSize - 2 * radius) / 2
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
  const lines: Array<IDrawItem> = [];

  arr.push(
    BoxDrawItem.create(
      0,
      0,
      theConfig.colSize,
      theConfig.textColor,
      () => ['yellow', 'red'],
      () => ['red', 'yellow'],
      theConfig.borderColor,
      null,
      'Heatmap'
    ).setHeight(theConfig.rowSize * 0.8)
  );

  arr.push(createEvents(events, attendees, theConfig));

  attendees.forEach((item: AttendeesChartData, i: number) => {
    const bgColor =
      i % 2 === 0 ? theConfig.alternateBgColor : theConfig.defaultBgColor;

    const top = (i + 2) * theConfig.rowSize;

    arr.push(createAttendee(item, top, bgColor, events, theConfig));
  });

  const c = new ContainerDrawItem();
  c.items = arr;
  c.lines = lines;
  c.width = c.getWidth();
  c.height = c.getHeight();

  return [c];
}

export function AttendeesChart(props: AttendeesChartProps) {
  const { attendees, events, config, tooltip, onClick } = props;
  const theConfig = useMemo(
    () =>
      ({
        ...defaultConfig,
        ...getConfig(config),
      } as AttendeesChartConfig),
    [config]
  );

  const getDrawItems = useCallback(
    (width: number) => createDrawItems(attendees, events, theConfig),
    [attendees, events, theConfig]
  );

  return (
    <CanvasChart
      getDrawItems={getDrawItems}
      onClick={onClick}
      theConfig={theConfig}
      tooltip={tooltip}
    ></CanvasChart>
  );
}
