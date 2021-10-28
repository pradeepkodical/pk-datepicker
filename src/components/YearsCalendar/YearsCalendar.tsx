import { useMemo } from 'react';

import { format, addDays, getWeek, getDaysInYear } from 'date-fns';

import { DrawItem } from '../../drawLib/drawItem';
import { TextDrawItem } from '../../drawLib/textDrawItem';
import { groupBy } from '../../utils/helperUtil';
import CanvasContainer from '../../drawLib/canvasContainer';
import { ContainerDrawItem } from '../../drawLib/containerDrawItem';
import { BoxDrawItem } from '../../drawLib/boxDrawItem';
import { GridDrawItem } from '../../drawLib/gridDrawItem';

import { Property } from 'csstype';

const CELL_SIZE = 25;

type ColorConfig = {
  selBgColor?: Property.Color;
  defaultBgColor?: Property.Color;
  alternateBgColor?: Property.Color;
  textColor?: Property.Color;
  selTextColor?: Property.Color;
  borderColor?: Property.Color;
};

const defaultConfig: ColorConfig = {
  selBgColor: '#dcf5ff',
  defaultBgColor: '#fff',
  alternateBgColor: '#fefefe',
  textColor: '#000',
  selTextColor: '#111',
  borderColor: '#efefef',
};

interface IHaveDate {
  date: Date;
  bgColor: string;
}

function getLocation(date: Date) {
  const top = date.getDay() * CELL_SIZE;
  let w = getWeek(date);
  if (date.getMonth() > 10 && w < 45) w = 53;
  const left = w * CELL_SIZE;
  return { top, left };
}

function getWeekDayHeader(config: ColorConfig) {
  const arr: Array<DrawItem> = [];
  ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach((x: string, idx: number) => {
    arr.push(
      TextDrawItem.create(
        CELL_SIZE,
        (idx + 1) * CELL_SIZE,
        CELL_SIZE,
        config.textColor || '#111',
        config.defaultBgColor || '#fff',
        x,
        {}
      )
    );
  });
  return arr;
}

function getMonthsHeader(year: number, config: ColorConfig) {
  const startDate = new Date(year, 0, 15);
  const arr: Array<DrawItem> = [];
  for (var i = 0; i < 12; i++) {
    startDate.setMonth(i);
    let w = getWeek(startDate);
    if (i > 10 && w < 45) w = 53;

    arr.push(
      TextDrawItem.create(
        (1 + w) * CELL_SIZE,
        0,
        CELL_SIZE,
        config.textColor || '#111',
        config.defaultBgColor || '#fff',
        format(startDate, 'MMM'),
        {}
      )
    );
  }
  return arr;
}

function YearBox(props: {
  year: number;
  items: Array<IHaveDate>;
  config: ColorConfig;
  onClick?: (item: any) => void;
  onHover?: (item: any, x: number, y: number) => void;
}) {
  const { year, items, onClick, onHover, config } = props;

  const drawItems = useMemo(() => {
    let startDate = new Date(year, 0, 15);
    const arr: Array<DrawItem> = [
      ...getWeekDayHeader(config),
      ...getMonthsHeader(year, config),
    ];

    startDate = new Date(year, 0, 1);
    const maxDays = getDaysInYear(startDate);

    const allData: any = {};
    items.forEach((a: any) => {
      const index = a.date.toDateString();
      if (!allData[index]) allData[index] = [];
      allData[index].push(a);
    });

    for (let i = 0; i < maxDays; i++) {
      const loc = getLocation(startDate);
      let bgColor =
        startDate.getMonth() % 2 === 0
          ? config.defaultBgColor
          : config.alternateBgColor;
      const index = startDate.toDateString();
      if (allData[index]) {
        const item = GridDrawItem.create(
          loc.top + CELL_SIZE,
          loc.left + CELL_SIZE,
          CELL_SIZE - 2,
          config.selTextColor || 'brown',
          bgColor || '#fff',
          config.selBgColor || '#fff',
          config.borderColor || '#fff',
          allData[index],
          `${startDate.getDate()}`
        );
        arr.push(item);
      } else {
        const item = BoxDrawItem.create(
          loc.top + CELL_SIZE,
          loc.left + CELL_SIZE,
          CELL_SIZE - 2,
          config.textColor || '#111',
          bgColor || '#fff',
          config.selBgColor || '#fff',
          config.borderColor || '#fff',
          '',
          `${startDate.getDate()}`
        );
        arr.push(item);
      }
      startDate = addDays(startDate, 1);
    }

    const c = new ContainerDrawItem();
    c.items = arr;
    c.bgColor = config.defaultBgColor || '#fff';
    c.color = config.textColor || '#111';
    return [c];
  }, [year, items, config]);

  return (
    <div
      style={{
        display: 'flex',
        padding: '10px',
        justifyContent: 'center',
        backgroundColor: config.defaultBgColor,
        color: config.textColor,
      }}
    >
      <div>
        <div
          style={{
            fontWeight: 'bold',
            fontSize: 'x-large',
            transform: 'translateY(80px) rotate(-90deg)',
          }}
        >
          {year}
        </div>
      </div>
      <CanvasContainer
        drawItems={drawItems}
        onClick={onClick}
        onHover={(item: any, x: number, y: number) => {
          if (item) {
            if (onHover) onHover(item, x, y);
          }
        }}
      ></CanvasContainer>
    </div>
  );
}

export type YearsCalendarProps = {
  items: Array<IHaveDate>;
  config?: ColorConfig;
  onClick?: (data: IHaveDate) => void;
  onHover?: (data: IHaveDate, x: number, y: number) => void;
};

export function YearsCalendar(props: YearsCalendarProps) {
  const { items, config, onClick, onHover } = props;

  const groupedItems = useMemo(
    () => groupBy(items, (item: IHaveDate) => item.date.getFullYear()),
    [items]
  );

  const theConfig = { ...defaultConfig, ...config };

  return (
    <div>
      {Object.keys(groupedItems).map((key: any, i: number) => (
        <div key={i}>
          <YearBox
            year={key}
            items={groupedItems[key]}
            config={theConfig}
            onClick={onClick}
            onHover={onHover}
          />
        </div>
      ))}
    </div>
  );
}
